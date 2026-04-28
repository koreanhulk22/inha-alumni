import { createClient } from "@/lib/supabase/server";
import { SubPageLayout } from "@/components/layout/SubPageLayout";
import { BoardList } from "@/components/common/BoardList";

const sideMenus = [
  { label: "장학회 소개", href: "/scholarship/about" },
  { label: "기금 현황", href: "/scholarship/fund" },
  { label: "기부내역", href: "/scholarship/donors" },
  { label: "공지사항", href: "/scholarship/notice" },
];

export default async function ScholarshipNoticePage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, type, title, summary, created_at, is_pinned, views")
    .eq("type", "공지사항")
    .order("created_at", { ascending: false });

  return (
    <SubPageLayout
      breadcrumbs={[{ label: "동문장학회", href: "/scholarship/about" }, { label: "공지사항" }]}
      sideMenus={sideMenus}
      currentPath="/scholarship/notice"
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#003876]">장학회 공지사항</h1>
        </div>
        <BoardList posts={posts ?? []} detailBase="/news" />
      </div>
    </SubPageLayout>
  );
}
