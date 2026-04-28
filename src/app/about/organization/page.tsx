import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "회장 인사말", href: "/about/greeting" },
  { label: "회칙", href: "/about/rules" },
  { label: "조직도", href: "/about/organization" },
  { label: "연혁", href: "/about/history" },
  { label: "오시는 길", href: "/about/location" },
];

export default function OrganizationPage() {
  return (
    <SubPageLayout
      breadcrumbs={[{ label: "총동창회", href: "/about" }, { label: "조직도" }]}
      sideMenus={sideMenus}
      currentPath="/about/organization"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-[#003876] mb-8 pb-4 border-b-2 border-[#003876]">
          조직도
        </h1>

        {/* 조직도 */}
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* 총동창회장 */}
            <div className="flex justify-center mb-6">
              <div className="bg-[#003876] text-white px-8 py-3 rounded-lg text-center font-bold">
                <div className="text-xs opacity-80 mb-0.5">제33대</div>
                총동창회장
                <div className="text-sm font-normal mt-0.5 opacity-90">김종우</div>
              </div>
            </div>

            {/* 명예회장단 / 고문 */}
            <div className="flex justify-center gap-4 mb-6">
              {["명예회장단", "고문단", "감사"].map((role) => (
                <div key={role} className="bg-[#E8F0FE] text-[#003876] px-5 py-2 rounded-lg text-sm font-medium text-center">
                  {role}
                </div>
              ))}
            </div>

            {/* 수석부회장 */}
            <div className="flex justify-center mb-6">
              <div className="bg-[#0066CC] text-white px-6 py-2.5 rounded-lg text-sm font-semibold">
                수석부회장
              </div>
            </div>

            {/* 상임부회장 / 부회장 */}
            <div className="flex justify-center gap-4 mb-6">
              {["상임부회장", "부회장단", "전임부회장"].map((role) => (
                <div key={role} className="bg-[#E8F0FE] text-[#003876] px-5 py-2 rounded-lg text-sm font-medium text-center border border-[#0066CC]">
                  {role}
                </div>
              ))}
            </div>

            {/* 사무처장 */}
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-semibold border border-gray-300">
                사무처장
              </div>
            </div>

            {/* 위원회 */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-8">
              {[
                "총무위원회", "재무위원회", "사업위원회",
                "장학위원회", "홍보위원회", "윤리위원회",
                "체육위원회", "문화위원회", "네트워크위원회",
                "여성위원회",
              ].map((committee) => (
                <div key={committee} className="bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-xs text-center border border-gray-200">
                  {committee}
                </div>
              ))}
            </div>

            {/* 산하 동문회 유형 */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-base font-bold text-[#003876] mb-4 text-center">산하 단위동문회</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { type: "학과별 동창회", desc: "각 학과·학부별 동창회" },
                  { type: "지역별 동창회", desc: "전국 지역별 동문회" },
                  { type: "대학별 동창회", desc: "단과대학별 동창회" },
                  { type: "대학원별 동창회", desc: "대학원 동문회" },
                  { type: "직장동문회", desc: "직장별 인하동문회" },
                  { type: "소모임", desc: "취미·관심사별 모임" },
                ].map((item) => (
                  <div key={item.type} className="bg-[#E8F0FE] rounded-lg p-3 text-center">
                    <div className="text-sm font-semibold text-[#003876]">{item.type}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}
