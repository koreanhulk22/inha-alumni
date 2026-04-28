import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "인하상회", href: "/business/shop" },
  { label: "인하사랑카드", href: "/business/card" },
  { label: "인하플레이스", href: "/business/place" },
  { label: "인하사랑콘서트", href: "/business/concert" },
  { label: "창업지원", href: "/business/startup" },
];

const programItems = [
  { time: "12:00", title: "오픈 & 푸드 페스티벌", desc: "캠퍼스 잔디광장 야외 행사 오픈" },
  { time: "14:00", title: "동문 네트워킹 & 부스 행사", desc: "인하플레이스 동문기업 홍보 부스, 동문 만남의 광장" },
  { time: "16:00", title: "장학금 수여식 & 기부 세리머니", desc: "현장 QR 스마트 기부, 장학금 전달식" },
  { time: "18:00", title: "메인 콘서트 공연", desc: "인하 출신 아티스트 및 초청 가수 공연" },
  { time: "20:30", title: "피날레 & 클로징", desc: "총동창회장 인사 및 불꽃쇼" },
];

export default function ConcertPage() {
  return (
    <SubPageLayout
      breadcrumbs={[{ label: "총동창회 사업" }, { label: "인하사랑콘서트" }]}
      sideMenus={sideMenus}
      currentPath="/business/concert"
    >
      <div className="space-y-6">
        <div className="bg-linear-to-r from-[#003876] to-[#0066CC] rounded-2xl p-8 text-white">
          <p className="text-[#C8A951] text-xs font-semibold tracking-widest uppercase mb-3">INHA LOVE CONCERT 2026</p>
          <h1 className="text-2xl font-bold mb-2">인하사랑콘서트</h1>
          <p className="text-white/80 text-sm leading-relaxed">
            모교 교정 용현벌에서 펼쳐지는 초대형 올데이(All-Day) 복합 문화 축제.<br />
            동문, 재학생, 가족이 함께하는 인하 최대의 문화 행사입니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold">2026.9.12</div>
              <div className="text-white/60 text-xs">개최일</div>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold">2만명</div>
              <div className="text-white/60 text-xs">목표 관객</div>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold">인하대 교정</div>
              <div className="text-white/60 text-xs">용현벌 캠퍼스</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-[#003876] mb-1">2026 인하사랑콘서트</h2>
          <p className="text-xs text-gray-500 mb-4">2026년 9월 12일(토) · 인하대학교 용현벌 캠퍼스</p>
          <div className="space-y-3">
            {programItems.map((item) => (
              <div key={item.time} className="flex gap-4 items-start">
                <div className="shrink-0 w-14 text-right">
                  <span className="text-xs font-bold text-[#003876] bg-[#E8F0FE] px-2 py-1 rounded">{item.time}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "🎫", title: "티켓 판매", desc: "사전 예매 / 현장 판매\n인하사랑카드 회원 우선 예매" },
            { icon: "🤝", title: "스폰서십", desc: "동문기업 후원 패키지\n현장 부스 운영 기회 제공" },
            { icon: "📱", title: "현장 QR 기부", desc: "스마트폰 QR 스캔으로\n간편 현장 기부 참여" },
          ].map((item) => (
            <div key={item.title} className="bg-[#E8F0FE] rounded-xl p-5 text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <h3 className="text-sm font-bold text-[#003876] mb-1">{item.title}</h3>
              <p className="text-xs text-gray-600 whitespace-pre-line">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#003876] rounded-xl p-5 text-white text-sm">
          <p className="font-semibold mb-1">수익금 사용처</p>
          <p className="text-white/70 text-xs leading-relaxed">
            콘서트 수익금은 모교 발전기금, 동문장학회관 건립기금, 총동창회 발전기금으로 활용됩니다.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center text-sm text-gray-500">
          콘서트 관련 문의: inha@inhain.com / 032-887-2345
        </div>
      </div>
    </SubPageLayout>
  );
}
