import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const navItems = [
  { label: "대시보드", href: "/admin" },
  { label: "게시글 관리", href: "/admin/posts" },
  { label: "자유게시판 승인", href: "/admin/board" },
  { label: "경조사 관리", href: "/admin/condolences" },
  { label: "회원 관리", href: "/admin/users" },
  { label: "업소 관리", href: "/admin/businesses" },
  { label: "배너 관리", href: "/admin/banners" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirect=/admin");

  const { data: profile } = await supabase.from("users").select("is_admin, name").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/");

  return (
    <div className="min-h-screen flex font-[Pretendard,system-ui,sans-serif] bg-gray-50 pt-16">
      {/* 사이드바 */}
      <aside className="w-56 shrink-0 bg-[#003876] min-h-screen flex flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <div className="text-white font-bold text-sm">인하 총동창회</div>
          <div className="text-white/50 text-xs mt-0.5">관리자 패널</div>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-5 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-white/50 text-xs truncate">{profile.name}</p>
          <Link href="/" className="text-white/40 text-xs hover:text-white/70 transition-colors">
            홈으로 →
          </Link>
        </div>
      </aside>

      {/* 메인 */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
