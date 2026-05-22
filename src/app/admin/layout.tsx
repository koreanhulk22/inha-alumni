import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { SidebarNav } from "./SidebarNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirect=/admin");

  const { data: profile } = await supabase.from("users").select("is_admin, name").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/");

  return (
    <div className="min-h-screen flex font-[Pretendard,system-ui,sans-serif] bg-gray-50">
      <aside className="w-56 shrink-0 bg-[#003876] min-h-screen flex flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <div className="text-white font-bold text-sm">인하 총동창회</div>
          <div className="text-white/50 text-xs mt-0.5">관리자 패널</div>
        </div>
        <Suspense fallback={<nav className="flex-1 py-4" />}>
          <SidebarNav />
        </Suspense>
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-white/50 text-xs truncate">{profile.name}</p>
          <Link href="/" className="text-white/40 text-xs hover:text-white/70 transition-colors">
            홈으로 →
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
