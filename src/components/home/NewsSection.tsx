import Link from "next/link";
import Image from "next/image";
import { type Post } from "@/types";

type NewsPost = Pick<Post, "id" | "type" | "title" | "summary" | "image_url" | "created_at" | "is_pinned">;
type CondolenceItem = { id: string; name: string | null; type: string; content: string; event_date: string | null };

interface Props {
  posts: NewsPost[];
  condolences: CondolenceItem[];
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" });
};

const TYPE_META: Record<string, { label: string; color: string; bg: string; grad: string }> = {
  "총동창회소식":   { label: "총동창회", color: "text-[#003876]", bg: "bg-[#E8F0FE]", grad: "from-[#003876] to-[#0066CC]" },
  "공지사항":       { label: "공지",     color: "text-red-600",   bg: "bg-red-50",    grad: "from-red-600 to-red-400" },
  "단위동문회소식": { label: "동문회",   color: "text-green-700", bg: "bg-green-50",  grad: "from-green-700 to-green-500" },
  "모교소식":       { label: "모교",     color: "text-orange-700",bg: "bg-orange-50", grad: "from-orange-500 to-orange-400" },
  "동문동정":       { label: "동문동정", color: "text-purple-700",bg: "bg-purple-50", grad: "from-purple-700 to-purple-500" },
  "인터뷰/칼럼":   { label: "칼럼",     color: "text-amber-700", bg: "bg-amber-50",  grad: "from-[#C8A951] to-[#8B6914]" },
};

function NewsCard({ post }: { post: NewsPost }) {
  const meta = TYPE_META[post.type] ?? { label: post.type, color: "text-gray-600", bg: "bg-gray-100", grad: "from-gray-500 to-gray-400" };
  return (
    <Link href={`/news/${post.id}`} className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md hover:border-[#003876]/20 transition-all">
      {/* 썸네일 */}
      <div className="relative h-44 shrink-0 overflow-hidden">
        {post.image_url ? (
          <Image src={post.image_url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className={`absolute inset-0 bg-linear-to-br ${meta.grad} flex items-center justify-center`}>
            <span className="text-white/15 text-5xl font-black tracking-tight">INHA</span>
          </div>
        )}
      </div>
      {/* 본문 */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>{meta.label}</span>
          <span className="text-[11px] text-gray-400">{formatDate(post.created_at)}</span>
        </div>
        <p className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-[#003876] transition-colors line-clamp-2 flex-1">
          {post.is_pinned && <span className="text-[#003876] mr-1">[공지]</span>}
          {post.title}
        </p>
        {post.summary && (
          <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{post.summary}</p>
        )}
      </div>
    </Link>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
        <span className="w-1 h-4 bg-[#003876] rounded-full inline-block" />
        {title}
      </h3>
      <Link href={href} className="text-xs text-gray-400 hover:text-[#003876] transition-colors">더보기 +</Link>
    </div>
  );
}

export function NewsSection({ posts, condolences }: Props) {
  const notices   = posts.filter((p) => p.type === "공지사항");
  const mainNews  = posts.filter((p) => p.type === "총동창회소식");
  const localNews = posts.filter((p) => p.type === "단위동문회소식");
  const alumniNews= posts.filter((p) => p.type === "동문동정");
  const uniNews   = posts.filter((p) => p.type === "모교소식");

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 space-y-10">

        {/* 총동창회 소식 — 피처드 카드 4장 */}
        <div>
          <SectionHeader title="총동창회 소식" href="/news/events" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mainNews.slice(0, 4).map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
            {mainNews.length === 0 && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-dashed border-gray-200 h-52 flex items-center justify-center text-gray-300 text-xs">소식 없음</div>
            ))}
          </div>
        </div>

        {/* 공지사항 + 단위동문회 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 공지사항 — 리스트 */}
          <div>
            <SectionHeader title="공지사항" href="/news/notice" />
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
              {notices.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-300">등록된 공지가 없습니다.</p>
              ) : notices.slice(0, 6).map((post) => (
                <Link key={post.id} href={`/news/${post.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 group transition-colors">
                  {post.is_pinned && <span className="shrink-0 text-[10px] bg-[#003876] text-white px-1.5 py-0.5 rounded">공지</span>}
                  <span className="flex-1 text-sm text-gray-700 group-hover:text-[#003876] truncate transition-colors">{post.title}</span>
                  <span className="shrink-0 text-xs text-gray-400">{formatDate(post.created_at)}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* 단위동문회 소식 — 카드 2장 */}
          <div>
            <SectionHeader title="단위동문회 소식" href="/community/local-news" />
            <div className="grid grid-cols-2 gap-4">
              {localNews.slice(0, 2).map((post) => (
                <NewsCard key={post.id} post={post} />
              ))}
              {localNews.length === 0 && Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-dashed border-gray-200 h-52 flex items-center justify-center text-gray-300 text-xs">소식 없음</div>
              ))}
            </div>
          </div>
        </div>

        {/* 동문동정 + 모교소식 + 경조사 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 동문동정 */}
          <div>
            <SectionHeader title="동문동정" href="/news/press" />
            <div className="flex flex-col gap-3">
              {alumniNews.slice(0, 3).map((post) => (
                <Link key={post.id} href={`/news/${post.id}`} className="flex gap-3 bg-white rounded-xl border border-gray-200 p-3 hover:shadow-sm hover:border-[#003876]/20 group transition-all">
                  <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-[#E8F0FE]">
                    {post.image_url ? (
                      <Image src={post.image_url} alt={post.title} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-linear-to-br from-purple-600 to-purple-400 flex items-center justify-center">
                        <span className="text-white/30 text-xs font-bold">INHA</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 group-hover:text-[#003876] line-clamp-2 leading-snug transition-colors">{post.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(post.created_at)}</p>
                  </div>
                </Link>
              ))}
              {alumniNews.length === 0 && <p className="py-6 text-center text-sm text-gray-300">등록된 소식이 없습니다.</p>}
            </div>
          </div>

          {/* 모교소식 */}
          <div>
            <SectionHeader title="모교소식" href="/university/news" />
            <div className="flex flex-col gap-3">
              {uniNews.slice(0, 3).map((post) => (
                <Link key={post.id} href={`/news/${post.id}`} className="flex gap-3 bg-white rounded-xl border border-gray-200 p-3 hover:shadow-sm hover:border-[#003876]/20 group transition-all">
                  <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden">
                    {post.image_url ? (
                      <Image src={post.image_url} alt={post.title} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-orange-400 flex items-center justify-center">
                        <span className="text-white/30 text-xs font-bold">INHA</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 group-hover:text-[#003876] line-clamp-2 leading-snug transition-colors">{post.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(post.created_at)}</p>
                  </div>
                </Link>
              ))}
              {uniNews.length === 0 && <p className="py-6 text-center text-sm text-gray-300">등록된 소식이 없습니다.</p>}
            </div>
          </div>

          {/* 경조사 */}
          <div>
            <SectionHeader title="경조사 알림" href="/community/condolence" />
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
              {condolences.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-300">등록된 경조사가 없습니다.</p>
              ) : condolences.slice(0, 5).map((item) => (
                <Link key={item.id} href="/community/condolence" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 group transition-colors">
                  <span className="text-sm shrink-0">{item.type === "경사" ? "🎉" : "🕯️"}</span>
                  <span className="flex-1 text-sm text-gray-700 group-hover:text-[#003876] truncate transition-colors">{item.name} · {item.content}</span>
                  {item.event_date && <span className="shrink-0 text-xs text-gray-400">{formatDate(item.event_date)}</span>}
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
