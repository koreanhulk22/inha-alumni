import { createClient } from "@/lib/supabase/server";
import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "공지사항", href: "/news/notice" },
  { label: "주요행사", href: "/news/events" },
  { label: "동창회보", href: "/news/newsletter" },
  { label: "동문보도", href: "/news/press" },
  { label: "영상보기", href: "/news/videos" },
  { label: "포토 갤러리", href: "/news/gallery" },
];

export default async function VideosPage() {
  const supabase = await createClient();

  let videos: { id: string; title: string; description: string | null; youtube_id: string; published_at: string | null }[] = [];
  try {
    const { data } = await supabase
      .from("videos")
      .select("id, title, description, youtube_id, published_at")
      .eq("is_active", true)
      .order("sort_order")
      .order("created_at", { ascending: false });
    videos = data ?? [];
  } catch {
    videos = [];
  }

  return (
    <SubPageLayout
      breadcrumbs={[{ label: "총동창회 소식", href: "/news/notice" }, { label: "영상보기" }]}
      sideMenus={sideMenus}
      currentPath="/news/videos"
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#003876]">영상보기</h1>
          <p className="text-sm text-gray-400 mt-1">인하대학교 총동창회 공식 유튜브 채널</p>
        </div>

        {videos.length > 0 ? (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((v) => (
              <div key={v.id} className="group">
                <a
                  href={`https://www.youtube.com/watch?v=${v.youtube_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-3">
                    <img
                      src={`https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 group-hover:text-[#003876] transition-colors line-clamp-2">
                    {v.title}
                  </h3>
                  {v.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{v.description}</p>
                  )}
                  {v.published_at && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(v.published_at).toLocaleDateString("ko-KR")}
                    </p>
                  )}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-4xl mb-3">🎬</p>
            <p className="text-sm text-gray-400 mb-4">등록된 영상이 없습니다.</p>
            <a
              href="https://www.youtube.com/@인하대학교총동창회"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z"/>
              </svg>
              유튜브 채널 바로가기
            </a>
          </div>
        )}

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            인하대학교 총동창회 유튜브 채널:
            <a href="https://www.youtube.com/@인하대학교총동창회" target="_blank" rel="noopener noreferrer"
              className="text-[#003876] hover:underline ml-1">
              youtube.com/@인하대학교총동창회
            </a>
          </p>
        </div>
      </div>
    </SubPageLayout>
  );
}
