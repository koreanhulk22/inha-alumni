import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "인하상회", href: "/business/shop" },
  { label: "인하사랑카드", href: "/business/card" },
  { label: "인하플레이스", href: "/business/place" },
  { label: "인하사랑콘서트", href: "/business/concert" },
  { label: "창업지원", href: "/business/startup" },
];

export default function StartupPage() {
  return (
    <SubPageLayout
      breadcrumbs={[{ label: "총동창회 사업" }, { label: "창업지원" }]}
      sideMenus={sideMenus}
      currentPath="/business/startup"
    >
      <div className="space-y-6">
        <div className="bg-linear-to-r from-[#003876] to-[#0066CC] rounded-2xl p-8 text-white">
          <p className="text-[#C8A951] text-xs font-semibold tracking-widest uppercase mb-3">STARTUP PITCHING DAY</p>
          <h1 className="text-2xl font-bold mb-2">벤처 창업지원</h1>
          <p className="text-white/80 text-sm leading-relaxed">
            자금이 필요한 우수 재학생 벤처 동아리와 선배 동문 투자자(엔젤투자)를 직접 연결하는<br />
            '스타트업 피칭 데이' 기획 사업입니다.
          </p>
          <div className="mt-6 flex gap-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold">2027</div>
              <div className="text-white/60 text-xs">시행 예정</div>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold">1억+</div>
              <div className="text-white/60 text-xs">지원기금</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-[#003876] mb-4">스타트업 피칭 데이란?</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            인하대 재학생 벤처 동아리가 사업 아이디어를 발표하고, 선배 동문 엔젤투자자들이 직접 투자 여부를 결정하는 오픈 피칭 이벤트입니다.
            전문가 동문들의 재능기부 경영 컨설팅도 함께 제공됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "🎤", title: "스타트업 피칭", desc: "재학생 벤처 동아리가 직접 사업 아이디어를 발표하고 투자자 앞에서 피칭" },
            { icon: "👼", title: "동문 엔젤투자", desc: "선배 동문 투자자 네트워크와 직접 연결하여 초기 투자 유치 기회 제공" },
            { icon: "📋", title: "경영 컨설팅", desc: "각 분야 전문가 동문들의 재능기부 컨설팅으로 사업계획 고도화 지원" },
          ].map((item) => (
            <div key={item.title} className="bg-[#E8F0FE] rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-sm font-bold text-[#003876] mb-2">{item.title}</h3>
              <p className="text-xs text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-[#003876] mb-3">추진 일정</h2>
          <div className="space-y-3">
            {[
              { period: "2026년", title: "사업 기획 및 준비", desc: "참가팀 모집 기준 수립, 투자자 네트워크 구성, 운영 방안 확정" },
              { period: "2027년", title: "스타트업 피칭 데이 시행", desc: "1억여원의 지원기금 투입, 제1회 스타트업 피칭 데이 개최" },
            ].map((item) => (
              <div key={item.period} className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl">
                <div className="shrink-0 bg-[#003876] text-white text-xs font-bold px-3 py-1.5 rounded-lg">{item.period}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center text-sm text-gray-500">
          창업지원 사업 문의: inha@inhain.com / 032-887-2345
        </div>
      </div>
    </SubPageLayout>
  );
}
