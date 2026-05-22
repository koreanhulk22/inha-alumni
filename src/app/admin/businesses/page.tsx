import { createAdminClient } from "@/lib/supabase/admin";
import { approveBusiness, deleteBusiness } from "../actions";

export default async function AdminBusinessesPage() {
  const admin = createAdminClient();
  const { data: businesses } = await admin
    .from("alumni_businesses")
    .select("id, name, category, address, phone, benefit, owner_id, owner_name, is_approved, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">업체 관리 (인하플레이스)</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">업체명</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium w-20">분류</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell">주소</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium hidden lg:table-cell">혜택</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-24">상태</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-20">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {businesses?.map((biz) => (
              <tr key={biz.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <p className="font-medium text-gray-800">{biz.name}</p>
                  {biz.owner_name && <p className="text-xs text-gray-400">{biz.owner_name}</p>}
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs bg-[#E8F0FE] text-[#003876] px-2 py-0.5 rounded">{biz.category}</span>
                </td>
                <td className="py-3 px-4 text-gray-500 hidden md:table-cell truncate max-w-40">{biz.address}</td>
                <td className="py-3 px-4 text-gray-500 hidden lg:table-cell truncate max-w-40">{biz.benefit || "-"}</td>
                <td className="py-3 px-4 text-center">
                  <form action={approveBusiness.bind(null, biz.id, !biz.is_approved)}>
                    <button type="submit" className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                      biz.is_approved
                        ? "bg-green-50 text-green-600 hover:bg-yellow-50 hover:text-yellow-600"
                        : "bg-yellow-50 text-yellow-600 hover:bg-green-50 hover:text-green-600"
                    }`}>
                      {biz.is_approved ? "승인됨" : "대기중"}
                    </button>
                  </form>
                </td>
                <td className="py-3 px-4 text-center">
                  <form action={deleteBusiness.bind(null, biz.id)}>
                    <button type="submit" className="text-xs text-red-500 hover:underline"
                      onClick={(e) => { if (!confirm("삭제하시겠습니까?")) e.preventDefault(); }}>
                      삭제
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {(!businesses || businesses.length === 0) && (
              <tr><td colSpan={6} className="py-16 text-center text-gray-400">등록된 업체가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
