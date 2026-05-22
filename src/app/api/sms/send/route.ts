import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendSMS } from "@/lib/sms";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // 관리자 인증
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { message, recipientType, customNumbers, senderNo } = await request.json() as {
    message: string;
    recipientType: "all" | "verified" | "custom";
    customNumbers?: string;
    senderNo?: string;
  };

  if (!message?.trim()) {
    return NextResponse.json({ error: "메시지를 입력해주세요." }, { status: 400 });
  }

  const admin = createAdminClient();
  let phones: string[] = [];

  if (recipientType === "custom") {
    phones = (customNumbers ?? "")
      .split(/[\n,]/)
      .map((p) => p.trim())
      .filter(Boolean);
  } else {
    const query = admin.from("users").select("phone").not("phone", "is", null);
    if (recipientType === "verified") query.eq("is_alumni_verified", true);
    const { data: users } = await query;
    phones = (users ?? []).map((u) => u.phone).filter(Boolean) as string[];
  }

  if (phones.length === 0) {
    return NextResponse.json({ error: "수신 가능한 번호가 없습니다. 회원 연락처를 먼저 등록해주세요." }, { status: 400 });
  }

  const result = await sendSMS(phones, message, senderNo ?? "032-887-2345");

  // 발송 내역 저장
  await admin.from("sms_logs").insert({
    message,
    sender_no: senderNo ?? "032-887-2345",
    recipient_type: recipientType,
    recipient_count: result.success ? result.sentCount : phones.length,
    status: result.success ? "sent" : "failed",
    error_message: result.error ?? null,
    sent_by: user.id,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true, sentCount: result.sentCount });
}
