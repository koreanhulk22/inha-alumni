import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_PDF   = ["application/pdf"];
const ALLOWED_VIDEO = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
const ALLOWED_POST_MEDIA = [...ALLOWED_IMAGE, ...ALLOWED_VIDEO];
const MAX_SIZE      = 200 * 1024 * 1024; // 200MB (동영상 고려)

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const bucket = formData.get("bucket") as string | null;

  if (!file || !bucket) return NextResponse.json({ error: "파일과 버킷을 지정해주세요." }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "파일 크기는 200MB 이하여야 합니다." }, { status: 400 });

  let allowed: string[];
  if (bucket === "newsletter-pdfs") allowed = ALLOWED_PDF;
  else if (bucket === "post-media") allowed = ALLOWED_POST_MEDIA;
  else allowed = ALLOWED_IMAGE;

  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: `허용되지 않는 파일 형식입니다. (${allowed.join(", ")})` }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const admin = createAdminClient();
  const { error } = await admin.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = admin.storage.from(bucket).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, path });
}
