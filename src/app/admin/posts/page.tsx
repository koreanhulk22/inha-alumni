import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { deletePost } from "../actions";

export default async function AdminPostsPage() {
  const admin = createAdminClient();
  const { data: posts } = await admin
    .from("posts")
    .select("id, type, title, author_name, is_pinned, views, created_at, image_url")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">게시글 관리</h1>
        <Link href="/admin/posts/new" className="px-4 py-2 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] transition-colors">
          + 새 게시글
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-gray-500 font-medium w-28">분류</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">제목</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-20 hidden md:table-cell">조회</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-28 hidden md:table-cell">작성일</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-24">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts?.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <span className="text-xs bg-[#E8F0FE] text-[#003876] px-2 py-0.5 rounded">{post.type}</span>
                  {post.is_pinned && <span className="ml-1 text-xs bg-red-50 text-red-500 px-1.5 py-0.5 rounded">공지</span>}
                </td>
                <td className="py-3 px-4 text-gray-700 max-w-xs truncate">{post.title}</td>
                <td className="py-3 px-4 text-center text-gray-400 hidden md:table-cell">{post.views}</td>
                <td className="py-3 px-4 text-center text-gray-400 hidden md:table-cell">
                  {new Date(post.created_at).toLocaleDateString("ko-KR")}
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Link href={`/admin/posts/${post.id}/edit`} className="text-xs text-[#003876] hover:underline">수정</Link>
                    <form action={deletePost.bind(null, post.id)}>
                      <button type="submit" className="text-xs text-red-500 hover:underline"
                        onClick={(e) => { if (!confirm("삭제하시겠습니까?")) e.preventDefault(); }}>
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
  );
}
