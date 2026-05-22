import { createAdminClient } from "@/lib/supabase/admin";
import { approveVerification, rejectVerification, deleteVerification } from "../actions";

export default async function AdminVerificationsPage() {
  const admin = createAdminClient();
  const { data: requests } = await admin
    .from("alumni_verification_requests")
    .select("id, name, department, entry_year, graduation_year, student_id, phone, file_url, status, admin_note, created_at, reviewed_at, user_id")
    .order("created_at", { ascending: false });

  const pending = requests?.filter((r) => r.status === "pending") ?? [];
  const processed = requests?.filter((r) => r.status !== "pending") ?? [];

  const statusLabel = (status: string) => {
    if (status === "approved") return { text: "승인", cls: "bg-green-50 text-green-600" };
    if (status === "rejected") return { text: "거절", cls: "bg-red-50 text-red-500" };
    return { text: "대기중", cls: "bg-yellow-50 text-yellow-600" };
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">동문인증 관리</h1>

      {/* 대기중 */}
      <section>
        <h2 className="text-base font-bold text-gray-700 mb-3">
          승인 대기 <span className="text-[#003876]">({pending.length})</span>
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">이름</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">학과</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium w-28">입학/졸업</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell">학번</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell">연락처</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">서류</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">신청일</th>
                <th className="py-3 px-4 text-center text-gray-500 font-medium w-36">처리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pending.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{req.name}</td>
                  <td className="py-3 px-4 text-gray-600">{req.department}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {req.entry_year}~{req.graduation_year}
                  </td>
                  <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{req.student_id || "-"}</td>
                  <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{req.phone || "-"}</td>
                  <td className="py-3 px-4">
                    {req.file_url ? (
                      <a
                        href={req.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#003876] hover:underline font-medium"
                      >
                        📄 보기
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">없음</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-400">
                    {new Date(req.created_at).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 justify-center">
                      <form action={approveVerification.bind(null, req.id)}>
                        <button
                          type="submit"
                          className="text-xs px-3 py-1 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
                        >
                          승인
                        </button>
                      </form>
                      <form action={rejectVerification.bind(null, req.id, undefined)}>
                        <button
                          type="submit"
                          className="text-xs px-3 py-1 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-colors"
                        >
                          거절
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {pending.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">대기 중인 인증 신청이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 처리 완료 */}
      {processed.length > 0 && (
        <section>
          <h2 className="text-base font-bold text-gray-700 mb-3">처리 완료 ({processed.length})</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-500 font-medium">이름</th>
                  <th className="py-3 px-4 text-left text-gray-500 font-medium">학과</th>
                  <th className="py-3 px-4 text-left text-gray-500 font-medium w-28">입학/졸업</th>
                  <th className="py-3 px-4 text-center text-gray-500 font-medium w-20">결과</th>
                  <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell">메모</th>
                  <th className="py-3 px-4 text-left text-gray-500 font-medium">처리일</th>
                  <th className="py-3 px-4 text-center text-gray-500 font-medium w-16">삭제</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {processed.map((req) => {
                  const { text, cls } = statusLabel(req.status);
                  return (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-800">{req.name}</td>
                      <td className="py-3 px-4 text-gray-600">{req.department}</td>
                      <td className="py-3 px-4 text-gray-500 text-xs">
                        {req.entry_year}~{req.graduation_year}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${cls}`}>{text}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-xs hidden md:table-cell">
                        {req.admin_note || "-"}
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-400">
                        {req.reviewed_at ? new Date(req.reviewed_at).toLocaleDateString("ko-KR") : "-"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <form action={deleteVerification.bind(null, req.id)}>
                          <button
                            type="submit"
                            className="text-xs text-red-400 hover:underline"
                            onClick={(e) => { if (!confirm("삭제하시겠습니까?")) e.preventDefault(); }}
                          >
                            삭제
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
