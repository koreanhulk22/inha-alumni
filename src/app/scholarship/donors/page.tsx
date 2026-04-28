import { createClient } from "@/lib/supabase/server";
import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "장학회 소개", href: "/scholarship/about" },
  { label: "기금 현황", href: "/scholarship/fund" },
  { label: "기부내역", href: "/scholarship/donors" },
  { label: "공지사항", href: "/scholarship/notice" },
];

export default async function DonorsPage() {
  const supabase = await createClient();
  const { data: donations } = await supabase
    .from("donations")
    .select("id, fund_type, amount, donor_name, is_anonymous, created_at")
    .eq("payment_status", "completed")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <SubPageLayout
      breadcrumbs={[{ label: "동문장학회", href: "/scholarship/about" }, { label: "기부내역" }]}
      sideMenus={sideMenus}
      currentPath="/scholarship/donors"
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#003876]">기부내역</h1>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">기부자</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell">기금</th>
              <th className="py-3 px-4 text-right text-gray-500 font-medium">금액</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium hidden md:table-cell">일자</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {donations?.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="py-3.5 px-4 text-gray-800">{d.is_anonymous ? "익명" : d.donor_name}</td>
                <td className="py-3.5 px-4 text-gray-500 hidden md:table-cell">{d.fund_type}</td>
                <td className="py-3.5 px-4 text-right font-medium text-[#003876]">{d.amount.toLocaleString()}원</td>
                <td className="py-3.5 px-4 text-center text-gray-400 hidden md:table-cell">
                  {new Date(d.created_at).toLocaleDateString("ko-KR")}
                </td>
              </tr>
            ))}
            {(!donations || donations.length === 0) && (
              <tr><td colSpan={4} className="py-16 text-center text-gray-400">기부내역이 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </SubPageLayout>
  );
}
