import { createClient } from "@/lib/supabase/server";
import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "장학회 소개", href: "/scholarship/about" },
  { label: "기금 현황", href: "/scholarship/fund" },
  { label: "기부내역", href: "/scholarship/donors" },
  { label: "공지사항", href: "/scholarship/notice" },
];

export default async function ScholarshipFundPage() {
  const supabase = await createClient();
  const { data: funds } = await supabase.from("scholarship_fund").select("*").eq("is_active", true).order("name");

  return (
    <SubPageLayout
      breadcrumbs={[{ label: "동문장학회", href: "/scholarship/about" }, { label: "기금 현황" }]}
      sideMenus={sideMenus}
      currentPath="/scholarship/fund"
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#003876]">기금 현황</h1>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">장학금명</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-24">구분</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {funds?.map((fund) => (
              <tr key={fund.id} className="hover:bg-gray-50">
                <td className="py-3.5 px-4 text-gray-800">{fund.name}</td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    fund.fund_type === "지정위탁" ? "bg-blue-50 text-blue-600" :
                    fund.fund_type === "단체" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600"
                  }`}>
                    {fund.fund_type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SubPageLayout>
  );
}
