import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAlumni, setAdmin } from "../actions";

export default async function AdminUsersPage() {
  const admin = createAdminClient();
  const { data: users } = await admin
    .from("users")
    .select("id, name, email, department, graduation_year, phone, is_alumni_verified, is_admin, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">회원 관리</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">이름</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell">이메일</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium hidden lg:table-cell">학과/학번</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-24">동문인증</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-24">관리자</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-28 hidden md:table-cell">가입일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-800">{user.name || "(이름 없음)"}</td>
                <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{user.email}</td>
                <td className="py-3 px-4 text-gray-500 hidden lg:table-cell">
                  {[user.department, user.graduation_year ? `${user.graduation_year}학번` : null].filter(Boolean).join(" · ") || "-"}
                </td>
                <td className="py-3 px-4 text-center">
                  <form action={verifyAlumni.bind(null, user.id, !user.is_alumni_verified)}>
                    <button type="submit" className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                      user.is_alumni_verified
                        ? "bg-green-50 text-green-600 hover:bg-red-50 hover:text-red-500"
                        : "bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600"
                    }`}>
                      {user.is_alumni_verified ? "인증완료" : "미인증"}
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
