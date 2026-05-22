import { createAdminClient } from "@/lib/supabase/admin";

const FUND_LABELS: Record<string, string> = {
  "회비발전기금": "회비발전기금",
  "장학기금": "장학기금",
  "건립기금": "건립기금",
};

const STATUS_LABELS: Record<string, { text: string; cls: string }> = {
  completed: { text: "완료", cls: "bg-green-50 text-green-600" },
  pending: { text: "대기", cls: "bg-yellow-50 text-yellow-600" },
  failed: { text: "실패", cls: "bg-red-50 text-red-500" },
  cancelled: { text: "취소", cls: "bg-gray-100 text-gray-500" },
};

export default async function AdminDonationsPage() {
  const admin = createAdminClient();

  const { data: donations } = await admin
    .from("donations")
    .select("id, fund_type, amount, donor_name, user_id, is_anonymous, payment_status, message, created_at")
    .order("created_at", { ascending: false });

  const all = donations ?? [];

  const totals = all
    .filter((d) => d.payment_status === "completed")
    .reduce<Record<string, number>>((acc, d) => {
      acc[d.fund_type] = (acc[d.fund_type] ?? 0) + d.amount;
      return acc;
    }, {});

  const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);

  const { data: pledges } = await admin
    .from("pledges")
    .select("id, fund_type, amount, cycle, is_active, created_at")
    .order("created_at", { ascending: false });

  const activePledges = pledges?.filter((p) => p.is_active) ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">기부 내역</h1>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-2xl font-bold text-[#003876]">{grandTotal.toLocaleString()}원</div>
          <div className="text-sm text-gray-500 mt-1">총 기부액</div>
        </div>
        {Object.entries(FUND_LABELS).map(([key, label]) => (
          <div key={key} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-2xl font-bold text-[#0066CC]">{(totals[key] ?? 0).toLocaleString()}원</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* 약정 현황 */}
      {activePledges.length > 0 && (
        <section>
          <h2 className="text-base font-bold text-gray-700 mb-3">
            정기 약정 <span className="text-[#003876]">({activePledges.length}건 활성)</span>
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-500 font-medium">기금 유형</th>
                  <th className="py-3 px-4 text-left text-gray-500 font-medium">금액</th>
                  <th className="py-3 px-4 text-left text-gray-500 font-medium">주기</th>
                  <th className="py-3 px-4 text-left text-gray-500 font-medium">약정일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activePledges.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="text-xs bg-[#E8F0FE] text-[#003876] px-2 py-0.5 rounded">{p.fund_type}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800">{p.amount.toLocaleString()}원</td>
                    <td className="py-3 px-4 text-gray-500">
                      {{ monthly: "월간", quarterly: "분기", yearly: "연간" }[p.cycle as string] ?? p.cycle}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-400">
                      {new Date(p.created_at).toLocaleDateString("ko-KR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 전체 기부 내역 */}
      <section>
        <h2 className="text-base font-bold text-gray-700 mb-3">전체 기부 내역 ({all.length}건)</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">기금 유형</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">기부자</th>
                <th className="py-3 px-4 text-right text-gray-500 font-medium">금액</th>
                <th className="py-3 px-4 text-center text-gray-500 font-medium w-20">상태</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell">메시지</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">일시</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {all.map((d) => {
                const st = STATUS_LABELS[d.payment_status] ?? { text: d.payment_status, cls: "bg-gray-100 text-gray-500" };
                return (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="text-xs bg-[#E8F0FE] text-[#003876] px-2 py-0.5 rounded">{d.fund_type}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {d.is_anonymous ? "익명" : (d.donor_name || "-")}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-800">
                      {d.amount.toLocaleString()}원
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${st.cls}`}>{st.text}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs hidden md:table-cell max-w-40 truncate">
                      {d.message || "-"}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-400">
                      {new Date(d.created_at).toLocaleDateString("ko-KR", { year: "2-digit", month: "2-digit", day: "2-digit" })}
                    </td>
                  </tr>
                );
              })}
              {all.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-400">기부 내역이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
