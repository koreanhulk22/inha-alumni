"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const sections = [
  {
    title: null,
    items: [
      { label: "대시보드", tab: "dashboard", icon: "📊" },
    ],
  },
  {
    title: "소식 관리",
    items: [
      { label: "공지사항", tab: "notice", icon: "📣" },
      { label: "총동창회 소식", tab: "news", icon: "📢" },
      { label: "단위동문회소식", tab: "local", icon: "🏛️" },
      { label: "모교소식", tab: "university", icon: "🎓" },
      { label: "동문동정", tab: "alumni-news", icon: "✍️" },
      { label: "인터뷰/칼럼", tab: "column", icon: "📝" },
    ],
  },
  {
    title: "커뮤니티",
    items: [
      { label: "자유게시판 승인", tab: "board", icon: "✅" },
      { label: "경조사 관리", tab: "condolences", icon: "🎊" },
      { label: "구인구직", tab: "jobs", icon: "💼" },
    ],
  },
  {
    title: "미디어",
    items: [
      { label: "갤러리 관리", tab: "gallery", icon: "📷" },
      { label: "동창회보 관리", tab: "newsletter", icon: "📰" },
      { label: "히어로 배너 관리", tab: "banners", icon: "🖼️" },
      { label: "광고 배너 관리", tab: "ad-banners", icon: "📢" },
    ],
  },
  {
    title: "운영",
    items: [
      { label: "회원 관리", tab: "users", icon: "👥" },
      { label: "동문인증 관리", tab: "verifications", icon: "🪪" },
      { label: "업체 관리", tab: "businesses", icon: "🏢" },
      { label: "기부 내역", tab: "donations", icon: "💰" },
      { label: "문자 발송", tab: "sms", icon: "📱" },
      { label: "사이트 설정", tab: "settings", icon: "⚙️" },
    ],
  },
];

export function SidebarNav() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "dashboard";

  return (
    <nav className="flex-1 py-3 overflow-y-auto">
      {sections.map((section, si) => (
        <div key={si} className={si > 0 ? "mt-1" : ""}>
          {section.title && (
            <p className="px-5 pt-3 pb-1 text-[10px] font-bold text-white/30 uppercase tracking-wider">
              {section.title}
            </p>
          )}
          {section.items.map((item) => {
            const isActive = item.tab === activeTab;
            return (
              <Link
                key={item.tab}
                href={`/admin?tab=${item.tab}`}
                className={`flex items-center gap-2.5 px-5 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-white/15 text-white font-semibold border-r-2 border-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="text-base leading-none w-5 shrink-0 text-center">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
