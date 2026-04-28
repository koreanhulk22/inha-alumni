import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "인하상회", href: "/business/shop" },
  { label: "인하사랑카드", href: "/business/card" },
  { label: "인하플레이스", href: "/business/place" },
  { label: "인하사랑콘서트", href: "/business/concert" },
  { label: "창업지원", href: "/business/startup" },
];

const categories = [
  { name: "식품/농수산", emoji: "🥩", desc: "국내산 한우, 해산물, 김치 등 신선 식품" },
  { name: "건강식품", emoji: "💊", desc: "프로바이오틱스, 건강기능식품" },
  { name: "뷰티/헤어", emoji: "💆", desc: "스킨케어, 샴푸, 트리트먼트" },
  { name: "주방/가전", emoji: "🍳", desc: "프라이팬, 두유메이커 등 주방용품" },
];

const featured = [
  {
    name: "농협안심한우 1등급 선물세트 900g",
    category: "식품/농수산",
    desc: "등심 300g × 3팩 / 산지직송 1등급 한우",
    badge: "숏폼특가",
    emoji: "🥩",
  },
  {
    name: "완도사랑 왕전복 8~9미 1kg",
    category: "식품/농수산",
    desc: "산지직송 신선도 보장 / 당일 출고",
    badge: "숏폼특가",
    emoji: "🦪",
  },
  {
    name: "테팔 인덕션 프라이팬 세트",
    category: "주방/가전",
    desc: "24cm + 28cm + 스펀지 2개 + 보관용기 5개",
    badge: "타임딜",
    emoji: "🍳",
  },
  {
    name: "휴그린바이오 유산균 90포",
    category: "건강식품",
    desc: "3개월분 / 장건강 프로바이오틱스",
    badge: "타임딜",
    emoji: "💊",
  },
  {
    name: "카포네 바이어스 샴푸 500ml",
    category: "뷰티/헤어",
    desc: "두피 케어 전문 샴푸",
    badge: "타임딜",
    emoji: "🧴",
  },
  {
    name: "대통령상 국내산 오이소박이 2kg",
    category: "식품/농수산",
    desc: "수상 김치 브랜드 / 국내산 재료",
    badge: "인기",
    emoji: "🥒",
  },
  {
    name: "온더온 두유메이커 OTO-24016SN",
    category: "주방/가전",
    desc: "홈쇼핑 완판 제품 / 민트 컬러",
    badge: "인기",
    emoji: "🫙",
  },
  {
    name: "메이레브 영양두피케어 트리트먼트 200ml",
    category: "뷰티/헤어",
    desc: "영양 공급 & 두피 케어 동시",
    badge: "인기",
    emoji: "💆",
  },
];

const badgeStyle: Record<string, string> = {
  타임딜: "bg-red-50 text-red-500",
  숏폼특가: "bg-orange-50 text-orange-500",
  인기: "bg-[#E8F0FE] text-[#003876]",
};

export default function ShopPage() {
  return (
    <SubPageLayout
      breadcrumbs={[{ label: "총동창회 사업" }, { label: "인하상회" }]}
      sideMenus={sideMenus}
      currentPath="/business/shop"
    >
      <div className="space-y-6">
        {/* 소개 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h1 className="text-xl font-bold text-[#003876] mb-2 pb-4 border-b-2 border-[#003876]">인하상회</h1>
          <p className="text-sm text-gray-600 mt-4 leading-relaxed">
            2026년 4월 공식 오픈한 동문 전용 온라인 폐쇄몰입니다. 연내 입점기업을 100개사 이상으로 확대하여 동문 기업의 제품 판로를 지원하고,
            판매 수수료 수익으로 총동창회 재정 자립을 이끄는 비즈니스 모델입니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="bg-[#E8F0FE] text-[#003876] px-3 py-1 rounded-full font-medium">동문회원 전용 폐쇄몰</span>
            <span className="bg-[#E8F0FE] text-[#003876] px-3 py-1 rounded-full font-medium">연내 100개사+ 입점 목표</span>
            <span className="bg-[#E8F0FE] text-[#003876] px-3 py-1 rounded-full font-medium">타임딜 / 숏폼특가</span>
          </div>
        </div>

        {/* 카테고리 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <div key={cat.name} className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-[#003876] transition-colors">
              <div className="text-3xl mb-2">{cat.emoji}</div>
              <p className="text-sm font-semibold text-gray-800">{cat.name}</p>
              <p className="text-xs text-gray-400 mt-1 leading-tight">{cat.desc}</p>
            </div>
          ))}
        </div>

        {/* 상품 목록 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-700">추천 상품</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-y divide-gray-100">
            {featured.map((product) => (
              <div key={product.name} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-full aspect-square bg-[#E8F0FE] rounded-lg mb-3 flex items-center justify-center text-4xl">
                  {product.emoji}
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${badgeStyle[product.badge]}`}>
                    {product.badge}
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-800 leading-tight mb-1">{product.name}</p>
                <p className="text-xs text-gray-400 leading-tight">{product.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 이동 링크 */}
        <div className="bg-[#003876] rounded-xl p-6 text-center text-white">
          <p className="text-sm font-semibold mb-1">상품 가격 및 구매는 인하상회 공식 사이트에서</p>
          <p className="text-xs text-white/60 mb-4">동문회원 로그인 후 회원가 및 구매 가능</p>
          <a
            href="https://www.inhamart.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 bg-white text-[#003876] text-sm font-bold rounded-full hover:bg-gray-100 transition-colors"
          >
            인하상회 바로가기 →
          </a>
        </div>
      </div>
    </SubPageLayout>
  );
}
