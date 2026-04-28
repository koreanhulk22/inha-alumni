import { createAdminClient } from "@/lib/supabase/admin";
import { approveBoardPost, deletePost } from "../actions";

export default async function AdminBoardPage() {
  const admin = createAdminClient();
  const { data: posts } = await admin
    .from("posts")
    .select("id, title, author_name, is_board_approved, created_at, views")
    .eq("type", "자유게시판")
    .order("created_at", { ascending: false });

  const pending = posts?.filter((p) => !p.is_board_approved) ?? [];
  const approved = posts?.filter((p) => p.is_board_approved) ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">자유게시판 승인 관리</h1>

      {/* 승인 대기 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-base font-bold text-gray-700">승인 대기</h2>
          {pending.length > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{pending.length}</span>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">제목</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell">작성자</th>
                <th className="py-3 px-4 text-center text-gray-500 font-medium hidden md:table-cell w-28">작성일</th>
                <th className="py-3 px-4 text-center text-gray-500 font-medium w-32">처리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pending.length === 0 ? (
                <tr><td colSpan={4} className="py-12 text-center text-gray-400">대기 중인 게시글이 없습니다.</td></tr>
              ) : pending.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-700 max-w-xs truncate">{post.title}</td>
                  <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{post.author_name || "-"}</td>
                  <td className="py-3 px-4 text-center text-gray-400 hidden md:table-cell">
                    {new Date(post.created_at).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <form action={approveBoardPost.bind(null, post.id, true)}>
                        <button type="submit" className="text-xs px-3 py-1 bg-green-50 text-green-600 rounded-full hover:bg-green-100 font-medium transition-colors">
                          승인
                        </button>
                      </form>
                      <form action={deletePost.bind(null, post.id)}>
                        <button
                          type="submit"
                          className="text-xs px-3 py-1 bg-red-50 text-red-500 rounded-full hover:bg-red-100 font-medium transition-colors"
                          onClick={(e) => { if (!confirm("삭제하시겠습니까?")) e.preventDefault(); }}
                        >
                          삭제
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 승인 완료 */}
      <div>
        <h2 className="text-base font-bold text-gray-700 mb-3">승인 완료 ({approved.length})</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">제목</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell">작성자</th>
                <th className="py-3 px-4 text-center text-gray-500 font-medium hidden md:table-cell w-16">조회</th>
                <th className="py-3 px-4 text-center text-gray-500 font-medium hidden md:table-cell w-28">작성일</th>
                <th className="py-3 px-4 text-center text-gray-500 font-medium w-32">처리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {approved.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-gray-400">승인된 게시글이 없습니다.</td></tr>
              ) : approved.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-700 max-w-xs truncate">{post.title}</td>
                  <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{post.author_name || "-"}</td>
                  <td className="py-3 px-4 text-center text-gray-400 hidden md:table-cell">{post.views}</td>
                  <td className="py-3 px-4 text-center text-gray-400 hidden md:table-cell">
                    {new Date(post.created_at).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <form action={approveBoardPost.bind(null, post.id, false)}>
                        <button type="submit" className="text-xs text-gray-400 hover:text-gray-600 hover:underline transition-colors">
                          승인취소
                        </button>
                      </form>
                      <form action={deletePost.bind(null, post.id)}>
                        <button
                          type="submit"
                          className="text-xs text-red-500 hover:underline"
                          onClick={(e) => { if (!confirm("삭제하시겠습니까?")) e.preventDefault(); }}
                        >
                          삭제
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
