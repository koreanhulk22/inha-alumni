import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "공지사항", href: "/news/notice" },
  { label: "주요행사", href: "/news/events" },
  { label: "동창회보", href: "/news/newsletter" },
  { label: "동문보도", href: "/news/press" },
  { label: "포토 갤러리", href: "/news/gallery" },
];

const newsletters = [
  { no: 259, year: 2025, month: "6월", title: "인하동창회보 제259호", sections: ["제33대 취임 특집", "2025 가족의 밤 결산", "동문기업탐방", "장학생 인터뷰"] },
  { no: 258, year: 2025, month: "3월", title: "인하동창회보 제258호", sections: ["신춘 동문 좌담회", "골프대회 결과", "단위동문회 소식", "모교 최신 소식"] },
  { no: 257, year: 2024, month: "12월", title: "인하동창회보 제257호", sections: ["2024 가족의 밤", "인하비룡대상 수상자", "연말 동문 모임", "장학회 기금 현황"] },
  { no: 256, year: 2024, month: "9월", title: "인하동창회보 제256호", sections: ["개교 70주년 특집", "동문 창업 성공사례", "ROTC 현충원 참배", "지역 동문회 소식"] },
  { no: 255, year: 2024, month: "6월", title: "인하동창회보 제255호", sections: ["비룡제 격려 방문", "2024 골프대회", "동문기업탐방", "모교 발전 기금"] },
  { no: 254, year: 2024, month: "3월", title: "인하동창회보 제254호", sections: ["신년 하례회", "정기총회 결산", "신임 임원 소개", "후진 육영 사업"] },
  { no: 253, year: 2023, month: "10월", title: "인하동창회보 제253호", sections: ["가을 체육대회", "지역별 동문회 현황", "모교 산학협력", "장학생 선발 안내"] },
  { no: 252, year: 2023, month: "6월", title: "인하동창회보 제252호", sections: ["2023 골프대회", "동문 수상 소식", "단위동문회 탐방", "인하플레이스 안내"] },
];

export default function NewsletterPage() {
  return (
    <SubPageLayout
      breadcrumbs={[{ label: "총동창회 소식", href: "/news/notice" }, { label: "동창회보" }]}
      sideMenus={sideMenus}
      currentPath="/news/newsletter"
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#003876]">동창회보</h1>
          <p className="text-sm text-gray-400 mt-1">인하대학교 총동창회 기관지 — 연 4회 발행</p>
        </div>

        <div className="divide-y divide-gray-100">
          {newsletters.map((item) => (
            <div key={item.no} className="px-6 py-5 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-16 h-20 bg-[#003876] rounded-lg flex flex-col items-center justify-center text-white">
                  <div className="text-xs opacity-70">{item.year}</div>
                  <div className="text-sm font-bold">{item.month}</div>
                  <div className="text-xs opacity-70 mt-1">제{item.no}호</div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 mb-2">{item.title}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.sections.map((section) => (
                      <span key={section} className="text-xs bg-[#E8F0FE] text-[#003876] px-2 py-0.5 rounded">
                        {section}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0 text-xs text-gray-300 border border-gray-200 px-3 py-1.5 rounded-lg">
                  PDF 준비중
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400">동창회보 구독 문의: inha@inhain.com / 032-887-2345</p>
        </div>
      </div>
    </SubPageLayout>
  );
}
