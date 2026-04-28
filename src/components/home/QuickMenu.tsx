import Link from "next/link";

const quickMenus = [
  { label: "인하상회", href: "/business/shop", icon: "🏪" },
  { label: "인하사랑카드", href: "/business/card", icon: "💳" },
  { label: "인하플레이스", href: "/business/place", icon: "📍" },
  { label: "동문 검색", href: "/network/search", icon: "🔍" },
  { label: "기부하기", href: "/donate", icon: "❤️" },
];

const relatedLinks = [
  { label: "인하대학교", href: "https://www.inha.ac.kr" },
  { label: "인하대학교병원", href: "https://www.inhauh.com" },
  { label: "학생진로설계포털", href: "https://career.inha.ac.kr" },
  { label: "졸업증명서 발급", href: "https://www.inha.ac.kr/kr/1083/subview.do" },
  { label: "동문장학회", href: "https://inhaasf.com" },
];

export function QuickMenu() {
  return (
    <section>
      <div className="bg-[#003876]">
        <div className="max-w-7xl mx-auto px-4">
          {/* 모바일: 3+2 그리드, 데스크탑: 5열 */}
          <div className="grid grid-cols-3 md:grid-cols-5 divide-x divide-white/15">
            {quickMenus.map((menu) => (
              <Link
                key={menu.href}
                href={menu.href}
                className="flex flex-col items-center gap-2 py-5 md:py-7 hover:bg-[#002a5c] transition-colors"
              >
                <span className="text-2xl md:text-3xl">{menu.icon}</span>
                <span className="text-white text-xs md:text-sm font-medium text-center leading-tight">{menu.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#F5F7FA] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-xs text-gray-400 font-medium shrink-0">관련기관</span>
          {relatedLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs text-gray-500 hover:text-[#003876] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
