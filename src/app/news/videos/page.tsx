import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "공지사항", href: "/news/notice" },
  { label: "주요행사", href: "/news/events" },
  { label: "동창회보", href: "/news/newsletter" },
  { label: "동문보도", href: "/news/press" },
  { label: "영상보기", href: "/news/videos" },
  { label: "포토 갤러리", href: "/news/gallery" },
];

const YOUTUBE_CHANNEL = "https://www.youtube.com/@인하대학교총동창회";
const CHANNEL_ID = "UCinhaalumni"; // 실제 채널 ID로 변경 필요

export default function VideosPage() {
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

        {/* 채널 안내 */}
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z"/>
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">인하대학교 총동창회</h2>
          <p className="text-sm text-gray-500 mb-6">
            취임식, 행사, 동문 인터뷰 등 총동창회 주요 영상을<br />
            공식 유튜브 채널에서 확인하세요.
          </p>
          <a
            href={YOUTUBE_CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 bg-red-600 text-white text-sm font-bold rounded-full hover:bg-red-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z"/>
            </svg>
            유튜브 채널 바로가기
          </a>

          {/* 채널 미리보기 iframe */}
          <div className="w-full max-w-2xl mt-8 rounded-xl overflow-hidden border border-gray-200">
            <iframe
              src={`https://www.youtube.com/embed?listType=user_uploads&list=${CHANNEL_ID}&layout=default`}
              className="w-full aspect-video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="인하대학교 총동창회 유튜브"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            공식 채널:
            <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer" className="text-[#003876] hover:underline ml-1">
              youtube.com/@인하대학교총동창회
            </a>
          </p>
        </div>
      </div>
    </SubPageLayout>
  );
}
