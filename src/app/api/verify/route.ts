import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const formData = await request.formData();
  const name = formData.get("name") as string;
  const department = formData.get("department") as string;
  const entryYear = parseInt(formData.get("entryYear") as string);
  const graduationYear = parseInt(formData.get("graduationYear") as string);
  const studentId = formData.get("studentId") as string | null;
  const phone = formData.get("phone") as string | null;
  const file = formData.get("file") as File | null;

  if (!name || !department || !entryYear || !graduationYear) {
    return NextResponse.json({ error: "필수 항목을 입력해주세요." }, { status: 400 });
  }

  const admin = createAdminClient();
  let fileUrl: string | null = null;

  if (file && file.size > 0) {
    const ext = file.name.split(".").pop() ?? "pdf";
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error: uploadError } = await admin.storage
      .from("verification-files")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (!uploadError) {
      const { data } = admin.storage.from("verification-files").getPublicUrl(path);
      fileUrl = data?.publicUrl ?? null;
    }
  }

  const { error } = await admin.from("alumni_verification_requests").insert({
    user_id: user.id,
    name,
    department,
    entry_year: entryYear,
    graduation_year: graduationYear,
    student_id: studentId || null,
    phone: phone || null,
    file_url: fileUrl,
    status: "pending",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
