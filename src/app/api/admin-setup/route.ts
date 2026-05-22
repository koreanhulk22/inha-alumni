import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

const ADMIN_EMAIL = "admin@inhain.com";
const ADMIN_PASSWORD = "Inha2026!@";
const ADMIN_NAME = "관리자";

export async function GET() {
  const admin = createAdminClient();

  // 이미 어드민이 있으면 중단
  const { data: existing } = await admin
    .from("users")
    .select("id")
    .eq("is_admin", true)
    .limit(1)
    .single();

  if (existing) {
    return NextResponse.json({ message: "어드민 계정이 이미 존재합니다." }, { status: 409 });
  }

  // Supabase Auth에 유저 생성
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    return NextResponse.json({ error: authError?.message ?? "유저 생성 실패" }, { status: 500 });
  }

  const userId = authData.user.id;

  // users 테이블에 프로필 upsert (auth trigger가 이미 생성했을 수 있음)
  const { error: profileError } = await admin.from("users").upsert({
    id: userId,
    name: ADMIN_NAME,
    is_admin: true,
    is_alumni_verified: true,
  });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    message: "어드민 계정이 생성되었습니다. 이 API는 한 번만 동작합니다.",
  });
}
