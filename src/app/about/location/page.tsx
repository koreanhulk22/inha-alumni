import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "회장 인사말", href: "/about/greeting" },
  { label: "회칙", href: "/about/rules" },
  { label: "조직도", href: "/about/organization" },
  { label: "연혁", href: "/about/history" },
  { label: "오시는 길", href: "/about/location" },
];

export default function LocationPage() {
  return (
    <SubPageLayout
      breadcrumbs={[{ label: "총동창회", href: "/about" }, { label: "오시는 길" }]}
      sideMenus={sideMenus}
      currentPath="/about/location"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-[#003876] mb-8 pb-4 border-b-2 border-[#003876]">
          오시는 길
        </h1>

        {/* 지도 자리 (추후 Kakao Map 연동) */}
        <div className="w-full h-72 bg-[#E8F0FE] rounded-xl mb-8 flex items-center justify-center text-[#003876]">
          <div className="text-center">
            <div className="text-3xl mb-2">🗺️</div>
            <p className="text-sm font-medium">Kakao Map 연동 예정</p>
            <p className="text-xs text-gray-500 mt-1">인천광역시 미추홀구 독배로 311, 비젼프라자 901호</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 주소 및 연락처 */}
          <div>
            <h2 className="text-base font-bold text-[#003876] mb-4">사무국 안내</h2>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                {[
                  { label: "주소", value: "(22188) 인천광역시 미추홀구 독배로 311, 비젼프라자 901호" },
                  { label: "전화", value: "032-887-2345" },
                  { label: "팩스", value: "032-887-2211" },
                  { label: "이메일", value: "inha@inhain.com" },
                  { label: "홈페이지", value: "www.inhain.com" },
                  { label: "운영시간", value: "평일 09:00 ~ 18:00 (점심 12:00~13:00)" },
                ].map((row) => (
                  <tr key={row.label}>
                    <td className="py-3 pr-4 font-medium text-gray-500 w-24 shrink-0">{row.label}</td>
                    <td className="py-3 text-gray-700">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 교통 안내 */}
          <div>
            <h2 className="text-base font-bold text-[#003876] mb-4">교통 안내</h2>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold text-gray-800 mb-1.5">🚇 지하철</p>
                <ul className="space-y-1 text-gray-600">
                  <li>· 인천 1호선 <strong>숭의역</strong> 2번 출구 도보 10분</li>
                  <li>· 인천 1호선 <strong>인하대역</strong> 1번 출구 도보 15분</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1.5">🚌 버스</p>
                <ul className="space-y-1 text-gray-600">
                  <li>· 독배로 정류장 하차</li>
                  <li>· 16번, 24번, 36번, 511번 이용</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1.5">🚗 자가용</p>
                <ul className="space-y-1 text-gray-600">
                  <li>· 내비게이션: '비젼프라자' 검색</li>
                  <li>· 건물 내 주차 가능</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}
