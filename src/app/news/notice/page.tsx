import { createClient } from "@/lib/supabase/server";
import { SubPageLayout } from "@/components/layout/SubPageLayout";
import Link from "next/link";
import { NoticeSearchBar } from "./NoticeSearchBar";

const sideMenus = [
  { label: "공지사항", href: "/news/notice" },
  { label: "주요행사", href: "/news/events" },
  { label: "동창회보", href: "/news/newsletter" },
  { label: "동문보도", href: "/news/press" },
  { label: "포토 갤러리", href: "/news/gallery" },
];

export default async function NoticePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const supabase = await createClient();

  let dbQuery = supabase
    .from("posts")
    .select("id, type, title, summary, created_at, is_pinned, views")
    .in("type", ["공지사항", "총동창회소식"])
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (query) {
    dbQuery = dbQuery.or(`title.ilike.%${query}%,summary.ilike.%${query}%`);
  }

  const { data: posts } = await dbQuery;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  return (
    <SubPageLayout
      breadcrumbs={[{ label: "총동창회 소식", href: "/news" }, { label: "공지사항" }]}
      sideMenus={sideMenus}
      currentPath="/news/notice"
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-[#003876] shrink-0">공지사항</h1>
          <NoticeSearchBar defaultValue={query} />
        </div>

        {query && (
          <div className="px-6 py-3 bg-[#E8F0FE] border-b border-gray-200 text-sm text-[#003876]">
            <span className="font-semibold">"{query}"</span> 검색 결과 {posts?.length ?? 0}건
            <Link href="/news/notice" className="ml-3 text-xs text-gray-500 hover:underline">
              초기화
            </Link>
          </div>
        )}

        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-gray-500 font-medium w-12">번호</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">제목</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-28 hidden md:table-cell">등록일</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-16 hidden md:table-cell">조회</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts?.map((post, i) => (
              <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3.5 px-4 text-gray-400 text-center">
                  {post.is_pinned ? (
                    <span className="inline-block bg-[#003876] text-white text-xs px-1.5 py-0.5 rounded">공지</span>
                  ) : (
                    (posts.length - i)
                  )}
                </td>
                <td className="py-3.5 px-4">
                  <Link href={`/news/${post.id}`} className="text-gray-800 hover:text-[#003876] transition-colors">
                    {post.title}
                  </Link>
                  {post.summary && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{post.summary}</p>
                  )}
                </td>
                <td className="py-3.5 px-4 text-center text-gray-400 hidden md:table-cell">
                  {formatDate(post.created_at)}
                </td>
                <td className="py-3.5 px-4 text-center text-gray-400 hidden md:table-cell">
                  {post.views}
                </td>
              </tr>
            ))}
            {(!posts || posts.length === 0) && (
              <tr>
                <td colSpan={4} className="py-16 text-center text-gray-400">
                  {query ? `"${query}"에 해당하는 게시글이 없습니다.` : "등록된 게시글이 없습니다."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </SubPageLayout>
  );
}
