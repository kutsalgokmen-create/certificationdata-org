// src/app/api/pay-per-certificate/checkout/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getPayPerCertTier } from "@/app/config/payPerCertificate";
import { resolvePublicSiteOrigin } from "@/lib/siteUrl";
import { stripe } from "@/lib/stripe";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const accessToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

    if (!accessToken) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        { ok: false, error: "Invalid session" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { tierId, source = "pricing" } = body as {
      tierId?: string;
      source?: string;
    };

    const tier = getPayPerCertTier(tierId ?? null);

    if (!tier) {
      return NextResponse.json(
        { ok: false, error: "Invalid tier" },
        { status: 400 }
      );
    }

    const origin = resolvePublicSiteOrigin();
    if (process.env.CHECKOUT_DEBUG_ORIGIN === "1") {
      console.info("[checkout] Stripe redirect origin:", origin);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${origin}/checkout/pay-per-certificate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/pay-per-certificate/cancel?tier=${encodeURIComponent(
        tier.id
      )}&source=${encodeURIComponent(source)}`,
      customer_email: user.email ?? undefined,
      client_reference_id: user.id,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: tier.priceCents,
            product_data: {
              name: `CertificationData.org – ${tier.label}`,
              description: `One-time certificate credit for one file up to ${tier.label}`,
            },
          },
        },
      ],
      metadata: {
        user_id: user.id,
        tier_id: tier.id,
        max_bytes: String(tier.maxBytes),
        price_cents: String(tier.priceCents),
        currency: "USD",
        source,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { ok: false, error: "Stripe session URL was not created" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (err) {
    console.error("Checkout API error:", err);

    return NextResponse.json(
      { ok: false, error: "Failed to create Stripe Checkout session" },
      { status: 500 }
    );
  }
}