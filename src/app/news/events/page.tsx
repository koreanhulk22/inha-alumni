import { createClient } from "@/lib/supabase/server";
import { SubPageLayout } from "@/components/layout/SubPageLayout";
import { BoardList } from "@/components/common/BoardList";
import { EventCalendar } from "@/components/home/EventCalendar";

const sideMenus = [
  { label: "공지사항", href: "/news/notice" },
  { label: "주요행사", href: "/news/events" },
  { label: "동창회보", href: "/news/newsletter" },
  { label: "동문보도", href: "/news/press" },
  { label: "영상보기", href: "/news/videos" },
  { label: "포토 갤러리", href: "/news/gallery" },
];

export default async function EventsPage() {
  const supabase = await createClient();

  const [{ data: posts }, calendarResult, settingResult] = await Promise.all([
    supabase
      .from("posts")
      .select("id, type, title, summary, created_at, is_pinned, views")
      .eq("type", "총동창회소식")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("calendar_events")
      .select("id, title, start_date, end_date, location, category, color")
      .eq("is_active", true)
      .order("start_date"),
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "calendar_enabled")
      .single(),
  ]);

  const calendarEnabled = settingResult.data?.value !== "false";
  const calendarEvents = (calendarResult.data ?? []) as {
    id: string; title: string; start_date: string;
    end_date: string | null; location: string | null;
    category: string; color: string;
  }[];

  return (
    <SubPageLayout
      breadcrumbs={[{ label: "총동창회 소식", href: "/news/notice" }, { label: "주요행사" }]}
      sideMenus={sideMenus}
      currentPath="/news/events"
    >
      <div className="space-y-5">
        {calendarEnabled && calendarEvents.length > 0 && (
          <EventCalendar events={calendarEvents} />
        )}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h1 className="text-xl font-bold text-[#003876]">주요행사</h1>
          </div>
          <BoardList posts={posts ?? []} detailBase="/news" />
        </div>
      </div>
    </SubPageLayout>
  );
}
