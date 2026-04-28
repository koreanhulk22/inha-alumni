import { SubPageLayout } from "@/components/layout/SubPageLayout";
import { DonateForm } from "@/components/donate/DonateForm";

const sideMenus = [
  { label: "회비발전기금", href: "/donate" },
  { label: "장학기금", href: "/donate?fund=장학기금" },
  { label: "동문회관 건립기금", href: "/donate?fund=건립기금" },
];

export default function DonatePage() {
  return (
    <SubPageLayout
      breadcrumbs={[{ label: "회비/기부" }, { label: "기부하기" }]}
      sideMenus={sideMenus}
      currentPath="/donate"
    >
      <div className="space-y-6">
        {/* 기금 현황 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "회비발전기금", account: "우리은행\n256-454416-13-001", color: "#003876", goal: 500000000, current: 120000000 },
            { name: "장학기금", account: "하나은행\n748-910003-42904", color: "#0066CC", goal: 300000000, current: 85000000 },
            { name: "동문회관 건립기금", account: "우리은행\n256-454416-13-001", color: "#C8A951", goal: 2000000000, current: 350000000 },
          ].map((fund) => (
            <div key={fund.name} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-sm font-bold mb-1" style={{ color: fund.color }}>{fund.name}</div>
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {(fund.current / 100000000).toFixed(1)}억
              </div>
              <div className="text-xs text-gray-400 mb-3">
                목표 {(fund.goal / 100000000).toFixed(0)}억원
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${Math.min((fund.current / fund.goal) * 100, 100)}%`,
                    backgroundColor: fund.color,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 whitespace-pre-line">{fund.account}</p>
            </div>
          ))}
        </div>

        {/* 기부 폼 */}
        <DonateForm />

        {/* 계좌이체 안내 */}
        <div className="bg-[#E8F0FE] rounded-xl p-6">
          <h3 className="text-sm font-bold text-[#003876] mb-3">계좌이체 안내</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>· <strong>회비발전기금</strong>: 우리은행 256-454416-13-001 (예금주: 인하대학교 총동창회)</p>
            <p>· <strong>협찬금</strong>: 하나은행 748-910003-42904 (인하대학교총동창회)</p>
          </div>
          <p className="text-xs text-gray-500 mt-3">입금 후 사무국(032-887-2345)으로 연락주시면 영수증을 발급해드립니다.</p>
        </div>
      </div>
    </SubPageLayout>
  );
}
