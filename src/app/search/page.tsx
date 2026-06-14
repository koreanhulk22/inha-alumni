import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { GNB } from "@/components/layout/GNB";
import { Footer } from "@/components/layout/Footer";

type PostResult = {
  id: string;
  type: string;
  title: string;
  summary: string | null;
  created_at: string;
};

type BusinessResult = {
  id: string;
  name: string;
  category: string;
  address: string;
  benefit: string | null;
};

const POST_TYPE_LABELS: Record<string, string> = {
  "공지사항": "공지사항",
  "총동창회소식": "총동창회소식",
  "동문보도": "동문보도",
  "단위동문회소식": "단위동문회소식",
  "모교소식": "모교소식",
  "동문동정": "동문동정",
  "자유게시판": "자유게시판",
};

const POST_TYPE_COLORS: Record<string, string> = {
  "공지사항": "bg-[#003876] text-white",
  "총동창회소식": "bg-[#0066CC] text-white",
  "동문보도": "bg-[#C8A951] text-[#003876]",
  "모교소식": "bg-green-600 text-white",
  "자유게시판": "bg-gray-200 text-gray-700",
};

function postHref(post: PostResult): string {
  if (post.type === "자유게시판") return `/community/board/${post.id}`;
  return `/news/${post.id}`;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  let postResults: PostResult[] = [];
  let businessResults: BusinessResult[] = [];
  let totalCount = 0;

  if (query) {
    const supabase = await createClient();

    const [postsRes, bizRes] = await Promise.all([
      supabase
        .from("posts")
        .select("id, type, title, summary, created_at")
        .or(`title.ilike.%${query}%,summary.ilike.%${query}%,content.ilike.%${query}%`)
        .not("type", "eq", "자유게시판")
        .order("created_at", { ascending: false })
        .limit(30),
      supabase
        .from("alumni_businesses")
        .select("id, name, category, address, benefit")
        .eq("is_approved", true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,benefit.ilike.%${query}%`)
        .limit(10),
    ]);

    postResults = postsRes.data ?? [];
    businessResults = bizRes.data ?? [];
    totalCount = postResults.length + businessResults.length;
  }

  return (
    <>
      <GNB />
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">통합 검색</h1>
          {query ? (
            <p className="text-sm text-gray-500 mb-6">
              <span className="font-semibold text-[#003876]">"{query}"</span> 검색 결과 총{" "}
              <span className="font-semibold text-gray-800">{totalCount}건</span>
            </p>
          ) : (
            <p className="text-sm text-gray-400 mb-6">검색어를 입력하면 공지사항, 동문소식, 인하플레이스를 한번에 찾을 수 있습니다.</p>
          )}

          {query && totalCount === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 py-20 text-center">
              <p className="text-gray-400 text-sm">
                <span className="font-medium text-gray-600">"{query}"</span>에 대한 검색 결과가 없습니다.
              </p>
              <p className="text-xs text-gray-400 mt-1">다른 검색어로 다시 시도해 보세요.</p>
            </div>
          )}

          {postResults.length > 0 && (
            <section className="mb-8">
              <h2 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
                게시글
                <span className="text-xs font-normal text-gray-400">{postResults.length}건</span>
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
                {postResults.map((post) => {
                  const colorCls = POST_TYPE_COLORS[post.type] ?? "bg-gray-200 text-gray-700";
                  return (
                    <Link
                      key={post.id}
                      href={postHref(post)}
                      className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded mt-0.5 ${colorCls}`}>
                        {POST_TYPE_LABELS[post.type] ?? post.type}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800 truncate">{post.title}</p>
                        {post.summary && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{post.summary}</p>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 shrink-0 mt-0.5">
                        {new Date(post.created_at).toLocaleDateString("ko-KR", { year: "2-digit", month: "2-digit", day: "2-digit" })}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {businessResults.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
                인하플레이스
                <span className="text-xs font-normal text-gray-400">{businessResults.length}건</span>
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
                {businessResults.map((biz) => (
                  <Link
                    key={biz.id}
                    href={`/business/place?id=${biz.id}`}
                    className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-9 h-9 bg-[#E8F0FE] rounded-lg flex items-center justify-center text-[#003876] font-bold text-sm shrink-0">
                      {biz.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800">{biz.name}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {biz.category} · {biz.address}
                      </p>
                      {biz.benefit && (
                        <p className="text-xs text-[#0066CC] mt-0.5 truncate">혜택: {biz.benefit}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

