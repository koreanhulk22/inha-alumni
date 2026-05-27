"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { type Post } from "@/types";

type NewsPost = Pick<Post, "id" | "type" | "title" | "summary" | "image_url" | "created_at" | "is_pinned">;
type CondolenceItem = { id: string; name: string | null; type: string; content: string; event_date: string | null };

interface Props {
  posts: NewsPost[];
  condolences: CondolenceItem[];
}

const NEWS_TABS = [
  { label: "전체", types: ["총동창회소식", "모교소식", "동문동정", "인터뷰/칼럼"] },
  { label: "본회소식", types: ["총동창회소식"] },
  { label: "모교소식", types: ["모교소식"] },
  { label: "인하동정", types: ["동문동정"] },
  { label: "인터뷰", types: ["인터뷰/칼럼"] },
  { label: "오피니언", types: ["인터뷰/칼럼"] },
];

const TYPE_LABEL: Record<string, string> = {
  "총동창회소식": "본회소식",
  "모교소식": "모교소식",
  "동문동정": "인하동정",
  "인터뷰/칼럼": "오피니언",
  "공지사항": "공지",
};

const TYPE_BADGE: Record<string, string> = {
  "총동창회소식": "bg-[#003876] text-white",
  "모교소식": "bg-[#1A6B4A] text-white",
  "동문동정": "bg-[#0277BD] text-white",
  "인터뷰/칼럼": "bg-gray-700 text-white",
  "공지사항": "bg-[#C8A951] text-[#003876]",
};

const TYPE_TEXT_COLOR: Record<string, string> = {
  "총동창회소식": "text-[#003876]",
  "모교소식": "text-[#1A6B4A]",
  "동문동정": "text-[#0277BD]",
  "인터뷰/칼럼": "text-gray-600",
  "공지사항": "text-[#C8A951]",
};

const FEATURED_GRAD: Record<string, string> = {
  "총동창회소식": "from-[#003876] to-[#0066CC]",
  "모교소식": "from-[#1A6B4A] to-[#003876]",
  "동문동정": "from-[#0277BD] to-[#003876]",
  "인터뷰/칼럼": "from-[#1A1A2E] to-[#003876]",
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" });
};

const formatDateFull = (dateStr: string | null) => {
  if (!dateStr) return "";
  const dt = new Date(dateStr);
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, "0")}.${String(dt.getDate()).padStart(2, "0")}`;
};

function PostList({ posts }: { posts: NewsPost[] }) {
  if (posts.length === 0)
    return <p className="py-6 text-center text-sm text-gray-300">등록된 글이 없습니다.</p>;
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
              <span className="text-sm text-gray-600 group-hover:text-[#003876] transition-colors truncate">{post.title}</span>
            </div>
            <span className="shrink-0 text-xs text-gray-400">{formatDate(post.created_at)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function NewsSection({ posts, condolences }: Props) {
  const [activeTab, setActiveTab] = useState(0);

  const notices = posts.filter((p) => p.type === "공지사항");
  const tabTypes = NEWS_TABS[activeTab].types;
  const filtered = posts.filter((p) => tabTypes.includes(p.type)).slice(0, 8);

  return (
    <div className="space-y-6">
      {/* 주요 소식 탭 (4열 카드) */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-0">
          <h3 className="text-lg font-bold text-gray-900">주요 소식</h3>
          <Link href="/news" className="text-sm text-gray-400 hover:text-[#003876] transition-colors mt-0.5">
            더보기 +
          </Link>
        </div>
        <div className="flex border-b border-gray-200 mt-3 mb-6">
          {NEWS_TABS.map((t, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === i
                  ? "text-[#003876] border-b-2 border-[#003876] -mb-px"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map((post) => (
            <Link key={post.id} href={`/news/${post.id}`} className="group">
              <div className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all">
                <div className="relative h-40 overflow-hidden">
                  {post.image_url ? (
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${FEATURED_GRAD[post.type] ?? "from-[#003876] to-[#0066CC]"} flex items-center justify-center`}
                    >
                      <span className="text-white/10 text-5xl font-black select-none">INHA</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 z-10">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${TYPE_BADGE[post.type] ?? "bg-gray-200 text-gray-700"}`}
                    >
                      {TYPE_LABEL[post.type]}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-[#003876] transition-colors line-clamp-2 mb-2.5 leading-snug min-h-[2.5rem]">
                    {post.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-semibold ${TYPE_TEXT_COLOR[post.type] ?? "text-gray-500"}`}>
                      {TYPE_LABEL[post.type]}
                    </span>
                    <span className="text-[11px] text-gray-400 tabular-nums">
                      {formatDateFull(post.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-4 py-12 text-center text-sm text-gray-300">해당 소식이 없습니다.</div>
          )}
        </div>
      </div>

      {/* 공지사항 + 경조사 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between border-b-2 border-[#003876] pb-3 mb-1">
            <h3 className="text-[15px] font-bold text-gray-800">공지사항</h3>
            <Link href="/news/notice" className="text-xs text-gray-400 hover:text-[#003876] transition-colors">
              더보기 +
            </Link>
          </div>
          <PostList posts={notices} />
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between border-b-2 border-[#003876] pb-3 mb-1">
            <h3 className="text-[15px] font-bold text-gray-800">경조사 알림</h3>
            <Link href="/community/condolence" className="text-xs text-gray-400 hover:text-[#003876] transition-colors">
              더보기 +
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {condolences.length === 0 ? (
              <li className="py-6 text-center text-sm text-gray-300">등록된 경조사가 없습니다.</li>
            ) : (
              condolences.slice(0, 5).map((item) => (
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
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
