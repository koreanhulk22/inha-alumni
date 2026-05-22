import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

const ADMIN_EMAIL = "admin@inhain.com";
const ADMIN_PASSWORD = "Inha2026!@";

export async function GET() {
  const admin = createAdminClient();

  // auth.users에서 해당 이메일 찾기
  const { data: { users }, error: listError } = await admin.auth.admin.listUsers();
  if (listError) return NextResponse.json({ error: listError.message }, { status: 500 });

  const existing = users.find((u) => u.email === ADMIN_EMAIL);

  if (existing) {
    // 비밀번호 + 이메일 확인 상태 강제 업데이트
    const { error } = await admin.auth.admin.updateUserById(existing.id, {
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // users 테이블 is_admin 확인
    await admin.from("users").upsert({
      id: existing.id,
      name: "관리자",
      is_admin: true,
      is_alumni_verified: true,
    });

    return NextResponse.json({ success: true, message: "비밀번호가 초기화되었습니다.", email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  }

  // 없으면 새로 생성
  const { data: authData, error: createError } = await admin.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
  });
  if (createError || !authData.user) return NextResponse.json({ error: createError?.message }, { status: 500 });

  await admin.from("users").upsert({
    id: authData.user.id,
    name: "관리자",
    is_admin: true,
    is_alumni_verified: true,
  });

  return NextResponse.json({ success: true, message: "어드민 계정이 생성되었습니다.", email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
}
