import { createClient } from "@/lib/supabase/server";
import { SubPageLayout } from "@/components/layout/SubPageLayout";
import { BoardList } from "@/components/common/BoardList";

const sideMenus = [
  { label: "단위동문회 소식", href: "/community/local-news" },
  { label: "자유게시판", href: "/community/board" },
  { label: "경조사 알림", href: "/community/condolence" },
  { label: "구인구직", href: "/community/jobs" },
];

export default async function LocalNewsPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, type, title, summary, created_at, is_pinned, views")
    .eq("type", "단위동문회소식")
    .order("created_at", { ascending: false });

  return (
    <SubPageLayout
      breadcrumbs={[{ label: "동문 커뮤니티" }, { label: "단위동문회 소식" }]}
      sideMenus={sideMenus}
      currentPath="/community/local-news"
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#003876]">단위동문회 소식</h1>
        </div>
        <BoardList posts={posts ?? []} detailBase="/news" />
      </div>
    </SubPageLayout>
  );
}
