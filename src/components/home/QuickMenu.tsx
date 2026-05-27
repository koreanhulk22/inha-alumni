import Link from "next/link";

const QUICK_ITEMS = [
  { label: "동문 검색", href: "/network/search", icon: "🔍" },
  { label: "회원 우대 서비스", href: "/business", icon: "🎁" },
  { label: "후원금 기부", href: "/donate", icon: "❤️" },
  { label: "올해 행사", href: "/news/events", icon: "📅" },
  { label: "공지사항", href: "/news/notice", icon: "📢" },
];

export function QuickMenu() {
  return (
    <div className="grid grid-cols-5 border border-white/30 divide-x divide-white/30 rounded-sm">
      {QUICK_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex flex-col items-center gap-2 py-4 md:py-5 hover:bg-white/10 transition-all"
        >
          <span className="text-2xl md:text-3xl drop-shadow-lg">{item.icon}</span>
          <span className="text-white text-[11px] md:text-sm font-medium text-center leading-tight drop-shadow-md px-1">
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
