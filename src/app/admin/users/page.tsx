import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAlumni, setAdmin } from "../actions";

export default async function AdminUsersPage() {
  const admin = createAdminClient();
  const { data: users } = await admin
    .from("users")
    .select("id, name, email, department, graduation_year, phone, is_alumni_verified, is_admin, created_at")
    .order("is_alumni_verified", { ascending: true })
    .order("created_at", { ascending: false });

  const pendingCount = users?.filter(u => !u.is_alumni_verified && !u.is_admin).length ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">회원 가입 승인 관리</h1>
        {pendingCount > 0 && (
          <span className="text-sm bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full font-semibold">
            승인 대기 {pendingCount}명
          </span>
        )}
      </div>

      <div className="bg-[#E8F0FE] rounded-xl p-4 text-sm text-[#003876]">
        <p className="font-semibold mb-1">승인 안내</p>
        <ul className="text-xs text-gray-600 space-y-0.5 list-disc list-inside">
          <li><strong>승인 전</strong>: 로그인은 가능하나 동문 검색·동창회보 등 회원 전용 기능 이용 불가</li>
          <li><strong>승인 후</strong>: 모든 회원 전용 기능 이용 가능</li>
          <li>승인 버튼 클릭 시 즉시 적용됩니다</li>
        </ul>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">이름</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell">이메일</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium hidden lg:table-cell">학과 / 입학년도</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-28">가입 승인</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-24">관리자</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-28 hidden md:table-cell">가입일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users?.map((user) => (
              <tr key={user.id} className={`hover:bg-gray-50 ${!user.is_alumni_verified && !user.is_admin ? "bg-amber-50/40" : ""}`}>
                <td className="py-3 px-4 font-medium text-gray-800">
                  {user.name || "(이름 없음)"}
                  {!user.is_alumni_verified && !user.is_admin && (
                    <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold">대기</span>
                  )}
                </td>
                <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{user.email}</td>
                <td className="py-3 px-4 text-gray-500 hidden lg:table-cell">
                  {[user.department, user.graduation_year ? `${user.graduation_year}학번` : null].filter(Boolean).join(" · ") || "-"}
                </td>
                <td className="py-3 px-4 text-center">
                  <form action={verifyAlumni.bind(null, user.id, !user.is_alumni_verified)}>
                    <button type="submit" className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
                      user.is_alumni_verified
                        ? "bg-green-100 text-green-700 hover:bg-red-50 hover:text-red-500"
                        : "bg-amber-100 text-amber-700 hover:bg-green-100 hover:text-green-700"
                    }`}>
                      {user.is_alumni_verified ? "✓ 승인완료" : "승인하기"}
                    </button>
                  </form>
                </td>
                <td className="py-3 px-4 text-center">
                  <form action={setAdmin.bind(null, user.id, !user.is_admin)}>
                    <button type="submit" className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                      user.is_admin
                        ? "bg-[#003876] text-white hover:bg-red-500"
                        : "bg-gray-100 text-gray-500 hover:bg-[#E8F0FE] hover:text-[#003876]"
                    }`}>
                      {user.is_admin ? "관리자" : "일반"}
                    </button>
                  </form>
                </td>
                <td className="py-3 px-4 text-center text-gray-400 hidden md:table-cell">
                  {new Date(user.created_at).toLocaleDateString("ko-KR")}
                </td>
              </tr>
            ))}
            {(!users || users.length === 0) && (
              <tr><td colSpan={6} className="py-16 text-center text-gray-400">가입한 회원이 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
