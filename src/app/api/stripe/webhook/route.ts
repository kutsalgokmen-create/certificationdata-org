// src/app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}`);
  }
  return value;
}

const supabaseUrl = requireEnv("SUPABASE_URL");
const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const webhookSecret = requireEnv("STRIPE_WEBHOOK_SECRET");

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing stripe-signature header", {
      status: 400,
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err?.message);
    return new NextResponse(`Webhook Error: ${err?.message ?? "Invalid signature"}`, {
      status: 400,
    });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.user_id;
      const tierId = session.metadata?.tier_id;
      const maxBytes = session.metadata?.max_bytes;
      const priceCents = session.metadata?.price_cents;
      const currency = session.metadata?.currency ?? "USD";
      const source = session.metadata?.source ?? "pricing";

      if (!userId || !tierId || !maxBytes || !priceCents) {
        console.error("Missing required metadata on checkout.session.completed", {
          sessionId: session.id,
          metadata: session.metadata,
        });

        return NextResponse.json({ received: true });
      }

      const providerPaymentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || session.id;

      const { data: existing, error: existingError } = await supabaseAdmin
        .from("single_use_credits")
        .select("id")
        .eq("provider_payment_id", providerPaymentId)
        .maybeSingle();

      if (existingError) {
        throw existingError;
      }

      if (!existing) {
        const { error: insertError } = await supabaseAdmin
          .from("single_use_credits")
          .insert({
            user_id: userId,
            tier_id: tierId,
            max_bytes: Number(maxBytes),
            price_cents: Number(priceCents),
            currency,
            is_used: false,
            source,
            note: "Stripe payment completed.",
            payment_provider: "stripe",
            provider_payment_id: providerPaymentId,
            provider_status: session.payment_status,
            provider_raw: session,
          });

        if (insertError) {
          throw insertError;
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}