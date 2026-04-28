import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "동문 검색", href: "/network/search" },
  { label: "동문회 안내", href: "/network/guide" },
  { label: "동문기업탐방", href: "/network/companies" },
  { label: "업종별 현황", href: "/network/industry" },
];

const industries = [
  { name: "제조/기술", count: 320 },
  { name: "IT/소프트웨어", count: 285 },
  { name: "금융/보험", count: 198 },
  { name: "의료/제약", count: 156 },
  { name: "건설/건축", count: 143 },
  { name: "교육/연구", count: 212 },
  { name: "공공/정부", count: 178 },
  { name: "유통/서비스", count: 134 },
  { name: "법률/회계", count: 89 },
  { name: "언론/미디어", count: 67 },
];

export default function IndustryPage() {
  const total = industries.reduce((s, i) => s + i.count, 0);
  return (
    <SubPageLayout
      breadcrumbs={[{ label: "동문 네트워크" }, { label: "업종별 현황" }]}
      sideMenus={sideMenus}
      currentPath="/network/industry"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h1 className="text-xl font-bold text-[#003876] mb-2">업종별 현황</h1>
        <p className="text-sm text-gray-400 mb-6">총 {total.toLocaleString()}명 동문 현황 (참고용)</p>
        <div className="space-y-3">
          {industries.map((ind) => (
            <div key={ind.name} className="flex items-center gap-4">
              <span className="text-sm text-gray-700 w-32 shrink-0">{ind.name}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                <div
                  className="h-5 bg-[#003876] rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${(ind.count / total) * 100}%` }}
                >
                  <span className="text-xs text-white font-medium">{ind.count}</span>
                </div>
              </div>
              <span className="text-xs text-gray-400 w-12 text-right">{((ind.count / total) * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </SubPageLayout>
  );
}
