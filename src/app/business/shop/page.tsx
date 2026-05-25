import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "인하상회", href: "/business/shop" },
  { label: "인하사랑카드", href: "/business/card" },
  { label: "인하플레이스", href: "/business/place" },
  { label: "인하사랑콘서트", href: "/business/concert" },
  { label: "창업지원", href: "/business/startup" },
];

// TODO: 총동창회로부터 실제 인하상회 URL 수령 후 교체
const SHOP_URL = process.env.NEXT_PUBLIC_SHOP_URL ?? "https://www.inhamart.com/main/index.php";

export default function ShopPage() {
  return (
    <SubPageLayout
      breadcrumbs={[{ label: "총동창회 사업" }, { label: "인하상회" }]}
      sideMenus={sideMenus}
      currentPath="/business/shop"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center text-center gap-6">
        <div className="w-16 h-16 bg-[#E8F0FE] rounded-2xl flex items-center justify-center text-4xl">
          🏪
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#003876] mb-2">인하상회</h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
            인하대학교 총동창회 공식 동문 전용 쇼핑몰입니다.<br />
            아래 버튼을 클릭하면 인하상회로 이동합니다.
          </p>
        </div>
        <a
          href={SHOP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-3 bg-[#003876] text-white text-sm font-bold rounded-full hover:bg-[#002a5c] transition-colors"
        >
          인하상회 바로가기 →
        </a>
      </div>
    </SubPageLayout>
  );
}
