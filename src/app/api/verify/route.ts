import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code?.trim()) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          error:
            "Missing server Supabase env vars (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)",
        },
        { status: 500 }
      );
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const trimmed = code.trim();

    const { data: cert, error: certError } = await admin
      .from("certificates")
      .select("certificate_code, created_at, asset_id")
      .eq("certificate_code", trimmed)
      .single();

    if (certError || !cert) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { data: asset, error: assetError } = await admin
      .from("assets")
      .select("title, owner_name, description")
      .eq("id", cert.asset_id)
      .single();

    if (assetError || !asset) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      certificate_code: cert.certificate_code,
      created_at: cert.created_at,
      asset_title: asset.title ?? "",
      owner_name: asset.owner_name ?? null,
      description: asset.description ?? "",
    });
  } catch (err) {
    console.error("Verify API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
