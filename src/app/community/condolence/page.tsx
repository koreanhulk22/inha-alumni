import { createClient } from "@/lib/supabase/server";
import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "단위동문회 소식", href: "/community/local-news" },
  { label: "자유게시판", href: "/community/board" },
  { label: "경조사 알림", href: "/community/condolence" },
  { label: "구인구직", href: "/community/jobs" },
];

export default async function CondolencePage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("condolence_events")
    .select("*")
    .order("created_at", { ascending: false });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });

  return (
    <SubPageLayout
      breadcrumbs={[{ label: "동문 커뮤니티" }, { label: "경조사 알림" }]}
      sideMenus={sideMenus}
      currentPath="/community/condolence"
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#003876]">경조사 알림</h1>
        </div>
        <div className="divide-y divide-gray-100">
          {events?.map((event) => (
            <div key={event.id} className="flex items-center gap-4 px-6 py-4">
              <span className={`shrink-0 text-xs px-2 py-0.5 rounded font-medium ${
                event.type === "경사" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-600"
              }`}>
                {event.type}
              </span>
              <p className="flex-1 text-sm text-gray-800">{event.content}</p>
              <span className="shrink-0 text-xs text-gray-400">{formatDate(event.created_at)}</span>
            </div>
          ))}
          {(!events || events.length === 0) && (
            <div className="py-16 text-center text-gray-400 text-sm">등록된 경조사 알림이 없습니다.</div>
          )}
        </div>
      </div>
    </SubPageLayout>
  );
}
