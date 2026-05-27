"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const navItems = [
  { label: "대시보드", tab: "dashboard", icon: "📊" },
  { label: "게시글 관리", tab: "posts", icon: "📝" },
  { label: "자유게시판 승인", tab: "board", icon: "✅" },
  { label: "경조사 관리", tab: "condolences", icon: "🎊" },
  { label: "회원 관리", tab: "users", icon: "👥" },
  { label: "동문인증 관리", tab: "verifications", icon: "🎓" },
  { label: "업체 관리", tab: "businesses", icon: "🏢" },
  { label: "기부 내역", tab: "donations", icon: "💰" },
  { label: "배너 관리", tab: "banners", icon: "🖼️" },
  { label: "슬라이드 광고", tab: "ad_slides", icon: "📺" },
  { label: "사이드 배너", tab: "side_banners", icon: "📌" },
  { label: "갤러리 관리", tab: "gallery", icon: "📷" },
  { label: "동창회보 관리", tab: "newsletter", icon: "📰" },
  { label: "문자 발송", tab: "sms", icon: "📱" },
  { label: "사이트 설정", tab: "settings", icon: "⚙️" },
];

export function SidebarNav() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "dashboard";

  return (
    <nav className="flex-1 py-4">
      {navItems.map((item) => {
        const isActive = item.tab === activeTab;
        return (
          <Link
            key={item.tab}
            href={`/admin?tab=${item.tab}`}
            className={`flex items-center gap-2.5 px-5 py-2.5 text-sm transition-colors ${
              isActive
                ? "bg-white/15 text-white font-semibold border-r-2 border-white"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <span className="text-base leading-none">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
