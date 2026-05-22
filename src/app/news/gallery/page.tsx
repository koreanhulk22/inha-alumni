import { createClient } from "@/lib/supabase/server";
import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "공지사항", href: "/news/notice" },
  { label: "주요행사", href: "/news/events" },
  { label: "동창회보", href: "/news/newsletter" },
  { label: "동문보도", href: "/news/press" },
  { label: "포토 갤러리", href: "/news/gallery" },
];

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("gallery_items")
    .select("id, title, image_url, taken_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const galleries = items ?? [];

  return (
    <SubPageLayout
      breadcrumbs={[{ label: "총동창회 소식", href: "/news/notice" }, { label: "포토 갤러리" }]}
      sideMenus={sideMenus}
      currentPath="/news/gallery"
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#003876]">포토 갤러리</h1>
          <p className="text-sm text-gray-400 mt-1">총동창회 주요 행사 사진</p>
        </div>

        {galleries.length > 0 ? (
          <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleries.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="aspect-video rounded-xl overflow-hidden mb-2 bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-xs font-medium text-gray-700 truncate">{item.title}</p>
                {item.taken_at && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(item.taken_at).toLocaleDateString("ko-KR")}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-400">
            <p className="text-4xl mb-3">🖼️</p>
            <p className="text-sm">등록된 사진이 없습니다.</p>
          </div>
        )}

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">사진 문의: inha@inhain.com</p>
        </div>
      </div>
    </SubPageLayout>
  );
}
