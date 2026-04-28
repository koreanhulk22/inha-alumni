import { createClient } from "@/lib/supabase/server";
import { SubPageLayout } from "@/components/layout/SubPageLayout";
import { BoardList } from "@/components/common/BoardList";

const sideMenus = [
  { label: "대학 주요 소식", href: "/university/news" },
  { label: "학사 안내", href: "/university/academic" },
];

export default async function UniversityNewsPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, type, title, summary, created_at, is_pinned, views")
    .eq("type", "모교소식")
    .order("created_at", { ascending: false });

  return (
    <SubPageLayout
      breadcrumbs={[{ label: "모교소식" }, { label: "대학 주요 소식" }]}
      sideMenus={sideMenus}
      currentPath="/university/news"
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#003876]">대학 주요 소식</h1>
        </div>
        <BoardList posts={posts ?? []} detailBase="/news" />
      </div>
    </SubPageLayout>
  );
}
