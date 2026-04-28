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

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between border-b-2 border-[#003876] pb-3 mb-1">
      <h3 className="text-[15px] font-bold text-gray-800">{title}</h3>
      <Link href={href} className="text-xs text-gray-400 hover:text-[#003876] transition-colors">
        더보기 +
      </Link>
    </div>
  );
}

function PostList({ posts }: { posts: NewsPost[] }) {
  if (posts.length === 0) {
    return <p className="py-6 text-center text-sm text-gray-300">등록된 글이 없습니다.</p>;
  }
  return (
    <ul className="divide-y divide-gray-100">
      {posts.slice(0, 6).map((post) => (
        <li key={post.id}>
          <Link
            href={`/news/${post.id}`}
            className="flex items-center justify-between py-2.5 gap-3 group hover:bg-gray-50 px-2 -mx-2 transition-colors rounded"
          >
            <div className="flex items-center gap-2 min-w-0">
              {post.is_pinned && (
                <span className="shrink-0 text-[10px] bg-[#003876] text-white px-1.5 py-0.5 rounded">공지</span>
              )}
              <span className="text-sm text-gray-600 group-hover:text-[#003876] transition-colors truncate">
                {post.title}
              </span>
            </div>
            <span className="shrink-0 text-xs text-gray-400">{formatDate(post.created_at)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FeaturedNewsList({ posts }: { posts: NewsPost[] }) {
  const [featured, ...rest] = posts;
  if (!featured) {
    return <p className="py-6 text-center text-sm text-gray-300">등록된 소식이 없습니다.</p>;
  }
  return (
    <div>
      <Link href={`/news/${featured.id}`} className="block group mb-3">
        <div className="relative h-44 w-full rounded overflow-hidden bg-[#003876]">
          {featured.image_url ? (
            <Image
              src={featured.image_url}
              alt={featured.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-[#003876] to-[#0066CC]">
              <span className="text-white/20 text-5xl font-black">INHA</span>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 p-3">
            <p className="text-white text-sm font-semibold leading-snug line-clamp-2">{featured.title}</p>
            <p className="text-white/60 text-xs mt-1">{formatDate(featured.created_at)}</p>
          </div>
        </div>
      </Link>
      <ul className="divide-y divide-gray-100">
        {rest.slice(0, 4).map((post) => (
          <li key={post.id}>
            <Link
              href={`/news/${post.id}`}
              className="flex items-center justify-between py-2.5 gap-3 group hover:bg-gray-50 px-2 -mx-2 transition-colors rounded"
            >
              <span className="text-sm text-gray-600 group-hover:text-[#003876] transition-colors truncate">
                {post.title}
              </span>
              <span className="shrink-0 text-xs text-gray-400">{formatDate(post.created_at)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CondolenceList({ condolences }: { condolences: CondolenceItem[] }) {
  if (condolences.length === 0) {
    return <p className="py-6 text-center text-sm text-gray-300">등록된 경조사가 없습니다.</p>;
  }
  return (
    <ul className="divide-y divide-gray-100">
      {condolences.slice(0, 5).map((item) => (
        <li key={item.id}>
          <Link
            href="/community/condolence"
            className="flex items-center justify-between py-2.5 gap-2 group hover:bg-gray-50 px-2 -mx-2 transition-colors rounded"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm shrink-0">{item.type === "경사" ? "🎉" : "🕯️"}</span>
              <span className="text-sm text-gray-600 group-hover:text-[#003876] truncate">
                {item.name} · {item.content}
              </span>
            </div>
            {item.event_date && (
              <span className="shrink-0 text-xs text-gray-400">{formatDate(item.event_date)}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function NewsSection({ posts, condolences }: Props) {
  const notices = posts.filter((p) => p.type === "공지사항");
  const mainNews = posts.filter((p) => p.type === "총동창회소식");
  const localNews = posts.filter((p) => p.type === "단위동문회소식");
  const alumniNews = posts.filter((p) => p.type === "동문동정");

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 space-y-6">

        {/* 상단 2열: 공지사항 + 총동창회소식 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded border border-gray-200 p-6">
            <SectionHeader title="공지사항" href="/news/notice" />
            <PostList posts={notices} />
          </div>
          <div className="bg-white rounded border border-gray-200 p-6">
            <SectionHeader title="총동창회 소식" href="/news/events" />
            <FeaturedNewsList posts={mainNews} />
          </div>
        </div>

        {/* 하단 3열: 단위동문회소식 + 동문동정 + 경조사 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded border border-gray-200 p-5">
            <SectionHeader title="단위동문회 소식" href="/community/local-news" />
            <PostList posts={localNews} />
          </div>
          <div className="bg-white rounded border border-gray-200 p-5">
            <SectionHeader title="동문동정" href="/news/press" />
            <PostList posts={alumniNews} />
          </div>
          <div className="bg-white rounded border border-gray-200 p-5">
            <SectionHeader title="경조사 알림" href="/community/condolence" />
            <CondolenceList condolences={condolences} />
          </div>
        </div>

      </div>
    </section>
  );
}
