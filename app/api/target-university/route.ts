// src/app/api/target-university/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * POST handler expects JSON: { targetId: string }
 * Requires authenticated user (Supabase session cookie).
 * Will update public.users.target_university = targetId for the logged-in user.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { targetId } = body as { targetId?: string };

    if (!targetId || typeof targetId !== "string") {
      return NextResponse.json({ error: "Missing targetId" }, { status: 400 });
    }

    const supabase = await createClient();

    // get user from supabase auth
    const {
      data: { user },
      error: getUserErr,
    } = await supabase.auth.getUser();

    if (getUserErr || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Update user's profile: set target_university
    const { error: updateErr } = await supabase
      .from("users")
      .update({ target_university: targetId })
      .eq("id", user.id);

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message || "Failed to update" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}