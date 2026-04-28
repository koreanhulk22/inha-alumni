import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "인하상회", href: "/business/shop" },
  { label: "인하사랑카드", href: "/business/card" },
  { label: "인하플레이스", href: "/business/place" },
  { label: "인하사랑콘서트", href: "/business/concert" },
  { label: "창업지원", href: "/business/startup" },
];

const benefits = [
  { category: "의료", partner: "인하대학교병원", benefit: "외래 진료비 할인, 건강검진 우대" },
  { category: "의료", partner: "아인병원", benefit: "비급여 진료비 20% 할인, 입원비 20% 할인" },
  { category: "의료", partner: "구로참튼튼병원", benefit: "진료비 우대 혜택" },
  { category: "쇼핑", partner: "인하상회", benefit: "전 상품 10% 할인" },
  { category: "문화", partner: "인하사랑콘서트", benefit: "우선 예매 및 할인" },
];

export default function CardPage() {
  return (
    <SubPageLayout
      breadcrumbs={[{ label: "총동창회 사업" }, { label: "인하사랑카드" }]}
      sideMenus={sideMenus}
      currentPath="/business/card"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h1 className="text-xl font-bold text-[#003876] mb-4 pb-4 border-b-2 border-[#003876]">인하사랑카드</h1>
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1">
              <p className="text-sm text-gray-700 leading-relaxed">
                국내 카드사와 제휴하여 동문들에게는 다양한 할인 혜택을, 총동창회에는 발전기금을 적립하는 동문 전용 신용카드입니다.
                동문의 일상적인 소비가 자연스럽게 모교 후원과 후배 사랑으로 이어지는 <strong>선순환 구조</strong>를 실현합니다.
              </p>
              <p className="text-xs text-gray-500 mt-2">회비 납부 완료 회원에 한해 발급됩니다.</p>
            </div>
            <div className="shrink-0 md:w-48">
              <div className="bg-linear-to-br from-[#003876] to-[#0066CC] rounded-2xl p-5 text-white aspect-video flex flex-col justify-between">
                <div className="text-xs opacity-70">INHA UNIVERSITY</div>
                <div>
                  <div className="text-sm font-bold">인하사랑카드</div>
                  <div className="text-xs opacity-70 mt-0.5">ALUMNI MEMBER</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-base font-bold text-[#003876] mb-4">제휴 혜택</h2>
          <div className="divide-y divide-gray-100">
            {benefits.map((b, i) => (
              <div key={i} className="py-4 flex items-start gap-4">
                <span className="shrink-0 text-xs bg-[#E8F0FE] text-[#003876] px-2 py-0.5 rounded font-medium">{b.category}</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{b.partner}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{b.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}
