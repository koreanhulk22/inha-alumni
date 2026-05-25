import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const admin = createAdminClient();
  const { error } = await admin.rpc("run_migration" as never, {} as never).maybeSingle();
  // RPC 없으니 직접 insert로 테이블 존재 확인 후 생성은 SQL Editor에서 진행
  // 이 route는 테이블 생성 확인용
  const { error: tableError } = await admin.from("ad_banners" as never).select("id").limit(1);
  if (tableError && tableError.code === "42P01") {
    return NextResponse.json({ ok: false, message: "ad_banners 테이블이 없습니다. Supabase SQL Editor에서 migrations/010_ad_banners.sql을 실행해주세요." });
  }
  return NextResponse.json({ ok: true, message: "ad_banners 테이블 준비됨" });
}
