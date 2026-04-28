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
  const { error } = await admin.from("posts").insert({
    type: formData.get("type") as string,
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    summary: formData.get("summary") as string,
    image_url: imageUrl || null,
    is_pinned: formData.get("is_pinned") === "true",
    author_name: formData.get("author_name") as string || "총동창회",
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/posts");
  revalidatePath("/news/notice");
  revalidatePath("/");
}

export async function updatePost(id: string, formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const imageUrl = formData.get("image_url") as string;
  const { error } = await admin.from("posts").update({
    type: formData.get("type") as string,
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    summary: formData.get("summary") as string,
    image_url: imageUrl || null,
    is_pinned: formData.get("is_pinned") === "true",
    author_name: formData.get("author_name") as string || "총동창회",
  }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/posts");
  revalidatePath("/");
}

export async function deletePost(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/posts");
  revalidatePath("/");
}

export async function verifyAlumni(userId: string, verified: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("users").update({ is_alumni_verified: verified }).eq("id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/users");
}

export async function setAdmin(userId: string, isAdmin: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("users").update({ is_admin: isAdmin }).eq("id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/users");
}

export async function approveBusiness(id: string, approved: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("alumni_businesses").update({ is_approved: approved }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/businesses");
  revalidatePath("/business/place");
}

export async function deleteBusiness(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("alumni_businesses").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/businesses");
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
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function deleteBanner(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("banners").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function toggleBanner(id: string, isActive: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("banners").update({ is_active: isActive }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function approveBoardPost(id: string, approved: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("posts").update({ is_board_approved: approved }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/board");
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
  revalidatePath("/admin/condolences");
  revalidatePath("/community/condolence");
  revalidatePath("/");
}

export async function deleteCondolence(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("condolence_events").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/condolences");
  revalidatePath("/community/condolence");
  revalidatePath("/");
}
