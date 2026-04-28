import { createClient } from "@/lib/supabase/server";
import { SubPageLayout } from "@/components/layout/SubPageLayout";
import { BoardList } from "@/components/common/BoardList";
import { WriteButton } from "@/components/common/WriteButton";

const sideMenus = [
  { label: "단위동문회 소식", href: "/community/local-news" },
  { label: "자유게시판", href: "/community/board" },
  { label: "경조사 알림", href: "/community/condolence" },
  { label: "구인구직", href: "/community/jobs" },
];

export default async function JobsPage() {
  const supabase = await createClient();
  const [{ data: posts }, { data: { user } }] = await Promise.all([
    supabase
      .from("posts")
      .select("id, type, title, summary, created_at, is_pinned, views")
      .eq("type", "구인구직")
      .order("created_at", { ascending: false }),
    supabase.auth.getUser(),
  ]);

  return (
    <SubPageLayout
      breadcrumbs={[{ label: "동문 커뮤니티" }, { label: "구인구직" }]}
      sideMenus={sideMenus}
      currentPath="/community/jobs"
    >
      <div className="space-y-3">
        {user && (
          <WriteButton postType="구인구직" userId={user.id} />
        )}
        {!user && (
          <div className="bg-[#E8F0FE] rounded-xl px-4 py-3 text-sm text-[#003876]">
            <a href="/auth/login?redirect=/community/jobs" className="font-semibold hover:underline">로그인</a> 후 구인구직 글을 작성할 수 있습니다.
          </div>
        )}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h1 className="text-xl font-bold text-[#003876]">구인구직</h1>
          </div>
          <BoardList posts={posts ?? []} detailBase="/news" />
        </div>
      </div>
    </SubPageLayout>
  );
}
