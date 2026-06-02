"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: profile } = await supabase.from("users").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) throw new Error("Forbidden");
  return user;
}

export async function createPost(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const imageUrl = formData.get("image_url") as string;
  const attachments = formData.getAll("attachments").filter(Boolean) as string[];
  const { error } = await admin.from("posts").insert({
    type: formData.get("type") as string,
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    summary: formData.get("summary") as string,
    image_url: imageUrl || null,
    is_pinned: formData.get("is_pinned") === "true",
    author_name: formData.get("author_name") as string || "총동창회",
    attachments: attachments.length > 0 ? attachments : null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/news/notice");
  revalidatePath("/");
}

export async function updatePost(id: string, formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const imageUrl = formData.get("image_url") as string;
  const attachments = formData.getAll("attachments").filter(Boolean) as string[];
  const { error } = await admin.from("posts").update({
    type: formData.get("type") as string,
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    summary: formData.get("summary") as string,
    image_url: imageUrl || null,
    is_pinned: formData.get("is_pinned") === "true",
    author_name: formData.get("author_name") as string || "총동창회",
    attachments: attachments.length > 0 ? attachments : null,
  }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deletePost(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function verifyAlumni(userId: string, verified: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("users").update({ is_alumni_verified: verified }).eq("id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function setAdmin(userId: string, isAdmin: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("users").update({ is_admin: isAdmin }).eq("id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function approveBusiness(id: string, approved: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("alumni_businesses").update({ is_approved: approved }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/business/place");
}

export async function deleteBusiness(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("alumni_businesses").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function createBanner(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const imageUrl = formData.get("image_url") as string;
  const { error } = await admin.from("banners").insert({
    title: formData.get("title") as string,
    subtitle: formData.get("subtitle") as string || null,
    image_url: imageUrl || null,
    link_url: formData.get("link_url") as string || null,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    is_active: true,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteBanner(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("banners").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function toggleBanner(id: string, isActive: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("banners").update({ is_active: isActive }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateBanner(id: string, formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const imageUrl = formData.get("image_url") as string;
  const { error } = await admin.from("banners").update({
    title: formData.get("title") as string,
    subtitle: formData.get("subtitle") as string || null,
    image_url: imageUrl || null,
    link_url: formData.get("link_url") as string || null,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function approveBoardPost(id: string, approved: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("posts").update({ is_board_approved: approved }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/community/board");
}

export async function createCondolence(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("condolence_events").insert({
    type: formData.get("type") as string,
    name: formData.get("name") as string,
    content: formData.get("content") as string,
    event_date: formData.get("event_date") as string || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/community/condolence");
  revalidatePath("/");
}

export async function deleteCondolence(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("condolence_events").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/community/condolence");
  revalidatePath("/");
}

export async function approveVerification(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { data: req, error: fetchError } = await admin
    .from("alumni_verification_requests")
    .select("user_id")
    .eq("id", id)
    .single();
  if (fetchError || !req) throw new Error("신청 내역을 찾을 수 없습니다.");

  const { error: updateError } = await admin
    .from("alumni_verification_requests")
    .update({ status: "approved", reviewed_at: new Date().toISOString() })
    .eq("id", id);
  if (updateError) throw new Error(updateError.message);

  const { error: userError } = await admin
    .from("users")
    .update({ is_alumni_verified: true })
    .eq("id", req.user_id);
  if (userError) throw new Error(userError.message);

  revalidatePath("/admin");
  revalidatePath("/admin");
}

export async function rejectVerification(id: string, note?: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from("alumni_verification_requests")
    .update({ status: "rejected", admin_note: note ?? null, reviewed_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function deleteVerification(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("alumni_verification_requests").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function createAdSlide(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("ad_slides").insert({
    title: formData.get("title") as string,
    label: formData.get("label") as string || "총동창회 업무 제휴 협력 기업",
    image_url: formData.get("image_url") as string || null,
    link_url: formData.get("link_url") as string || null,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    is_active: true,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateAdSlide(id: string, formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("ad_slides").update({
    title: formData.get("title") as string,
    label: formData.get("label") as string || "총동창회 업무 제휴 협력 기업",
    image_url: formData.get("image_url") as string || null,
    link_url: formData.get("link_url") as string || null,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteAdSlide(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("ad_slides").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function toggleAdSlide(id: string, isActive: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("ad_slides").update({ is_active: isActive }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createSideBanner(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("side_banners").insert({
    image_url: formData.get("image_url") as string || null,
    link_url: formData.get("link_url") as string || null,
    alt_text: formData.get("alt_text") as string || "AD",
    position: formData.get("position") as string || "left",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    is_active: true,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateSideBanner(id: string, formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("side_banners").update({
    image_url: formData.get("image_url") as string || null,
    link_url: formData.get("link_url") as string || null,
    alt_text: formData.get("alt_text") as string || "AD",
    position: formData.get("position") as string || "left",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteSideBanner(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("side_banners").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function toggleSideBanner(id: string, isActive: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("side_banners").update({ is_active: isActive }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
}

// ===== 회원 승인 =====
export async function approveUser(id: string, approved: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("users").update({ is_alumni_verified: approved }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

// ===== 행사 달력 =====
export async function createCalendarEvent(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("calendar_events").insert({
    title: formData.get("title") as string,
    description: formData.get("description") as string || null,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string || null,
    location: formData.get("location") as string || null,
    category: formData.get("category") as string || "행사",
    color: formData.get("color") as string || "#003876",
    is_active: true,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/news/events");
}

export async function updateCalendarEvent(id: string, formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("calendar_events").update({
    title: formData.get("title") as string,
    description: formData.get("description") as string || null,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string || null,
    location: formData.get("location") as string || null,
    category: formData.get("category") as string || "행사",
    color: formData.get("color") as string || "#003876",
  }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/news/events");
}

export async function deleteCalendarEvent(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("calendar_events").delete().eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/news/events");
}

export async function toggleCalendarEnabled(enabled: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("site_settings").update({ value: enabled ? "true" : "false" }).eq("key", "calendar_enabled");
  revalidatePath("/admin");
  revalidatePath("/news/events");
}

// ===== 유튜브 영상 =====
export async function createVideo(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const youtubeUrl = formData.get("youtube_url") as string;
  const youtubeId = extractYoutubeId(youtubeUrl) ?? youtubeUrl;
  const { error } = await admin.from("videos").insert({
    title: formData.get("title") as string,
    description: formData.get("description") as string || null,
    youtube_id: youtubeId,
    is_active: true,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    published_at: formData.get("published_at") as string || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/news/videos");
}

export async function deleteVideo(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("videos").delete().eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/news/videos");
}

export async function toggleVideo(id: string, isActive: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("videos").update({ is_active: isActive }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/news/videos");
}

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}
