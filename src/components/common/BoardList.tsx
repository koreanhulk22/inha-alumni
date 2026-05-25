import Link from "next/link";

interface Post {
  id: string;
  type: string;
  title: string;
  summary?: string | null;
  created_at: string;
  is_pinned: boolean;
  views: number;
}

interface Props {
  posts: Post[];
  detailBase?: string;
}

export function BoardList({ posts, detailBase = "/news" }: Props) {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });

  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="py-3 px-4 text-center text-gray-500 font-medium w-14 whitespace-nowrap">번호</th>
          <th className="py-3 px-4 text-left text-gray-500 font-medium">제목</th>
          <th className="py-3 px-4 text-center text-gray-500 font-medium w-32 whitespace-nowrap hidden md:table-cell">등록일</th>
          <th className="py-3 px-4 text-center text-gray-500 font-medium w-16 whitespace-nowrap hidden md:table-cell">조회</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {posts.map((post, i) => (
          <tr key={post.id} className="hover:bg-gray-50 transition-colors">
            <td className="py-3.5 px-4 text-gray-400 text-center">
              {post.is_pinned ? (
                <span className="inline-block bg-[#003876] text-white text-xs px-1.5 py-0.5 rounded">공지</span>
              ) : (
                posts.length - i
              )}
            </td>
            <td className="py-3.5 px-4">
              <Link href={`${detailBase}/${post.id}`} className="text-gray-800 hover:text-[#003876] transition-colors">
                {post.title}
              </Link>
              {post.summary && <p className="text-xs text-gray-400 mt-0.5 truncate">{post.summary}</p>}
            </td>
            <td className="py-3.5 px-4 text-center text-gray-400 whitespace-nowrap hidden md:table-cell">{formatDate(post.created_at)}</td>
            <td className="py-3.5 px-4 text-center text-gray-400 hidden md:table-cell">{post.views}</td>
          </tr>
        ))}
        {posts.length === 0 && (
          <tr>
            <td colSpan={4} className="py-16 text-center text-gray-400">등록된 게시글이 없습니다.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
