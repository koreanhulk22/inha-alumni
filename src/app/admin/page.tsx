import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { SeedButton } from "./SeedButton";

export default async function AdminDashboard() {
  const admin = createAdminClient();

  const [
    { count: postCount },
    { count: userCount },
    { count: verifiedCount },
    { count: pendingBusinessCount },
  ] = await Promise.all([
    admin.from("posts").select("*", { count: "exact", head: true }),
    admin.from("users").select("*", { count: "exact", head: true }),
    admin.from("users").select("*", { count: "exact", head: true }).eq("is_alumni_verified", true),
    admin.from("alumni_businesses").select("*", { count: "exact", head: true }).eq("is_approved", false),
  ]);

  const stats = [
    { label: "전체 게시글", value: postCount ?? 0, href: "/admin/posts", color: "#003876" },
    { label: "전체 회원", value: userCount ?? 0, href: "/admin/users", color: "#0066CC" },
    { label: "인증 동문", value: verifiedCount ?? 0, href: "/admin/users", color: "#22c55e" },
    { label: "업소 승인 대기", value: pendingBusinessCount ?? 0, href: "/admin/businesses", color: "#C8A951" },
  ];

  const { data: recentPosts } = await admin
    .from("posts")
    .select("id, type, title, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentUsers } = await admin
    .from("users")
    .select("id, name, email, is_alumni_verified, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">대시보드</h1>
        {(postCount ?? 0) < 10 && <SeedButton />}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
            <div className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-700">최근 게시글</h2>
            <Link href="/admin/posts/new" className="text-xs text-[#003876] hover:underline">+ 새 글</Link>
          </div>
          <div className="space-y-2">
            {recentPosts?.map((post) => (
              <div key={post.id} className="flex items-center gap-3 text-sm">
                <span className="text-xs bg-[#E8F0FE] text-[#003876] px-2 py-0.5 rounded shrink-0">{post.type}</span>
                <Link href={`/admin/posts/${post.id}/edit`} className="flex-1 truncate text-gray-700 hover:text-[#003876]">{post.title}</Link>
                <span className="text-xs text-gray-400 shrink-0">
                  {new Date(post.created_at).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-700">최근 가입 회원</h2>
            <Link href="/admin/users" className="text-xs text-[#003876] hover:underline">전체 보기</Link>
          </div>
          <div className="space-y-2">
            {recentUsers?.map((user) => (
              <div key={user.id} className="flex items-center gap-3 text-sm">
                <div className="flex-1 min-w-0">
                  <span className="text-gray-700 font-medium">{user.name || "(이름 없음)"}</span>
                  <span className="text-gray-400 text-xs ml-2 truncate">{user.email}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded shrink-0 ${user.is_alumni_verified ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                  {user.is_alumni_verified ? "인증" : "미인증"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
