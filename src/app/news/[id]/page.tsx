import { createClient } from "@/lib/supabase/server";
import { SubPageLayout } from "@/components/layout/SubPageLayout";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov|avi)(\?|$)/i.test(url);
}

function AttachmentsSection({ attachments }: { attachments: string[] }) {
  if (attachments.length === 0) return null;
  return (
    <div className="px-6 py-4 border-t border-gray-100 space-y-3">
      <p className="text-sm font-semibold text-gray-600">첨부 파일</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {attachments.map((url, i) => (
          isVideoUrl(url) ? (
            <video key={i} src={url} controls className="w-full rounded-lg border border-gray-200" />
          ) : (
            <div key={i} className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200">
              <Image src={url} alt={`첨부 ${i + 1}`} fill className="object-contain bg-gray-50" />
            </div>
          )
        ))}
      </div>
    </div>
  );
}

const TYPE_CONFIG: Record<string, {
  sideMenus: { label: string; href: string }[];
  breadcrumbParent: { label: string; href: string };
  listHref: string;
}> = {
  공지사항: {
    breadcrumbParent: { label: "총동창회 소식", href: "/news/notice" },
    listHref: "/news/notice",
    sideMenus: [
      { label: "공지사항", href: "/news/notice" },
      { label: "주요행사", href: "/news/events" },
      { label: "동창회보", href: "/news/newsletter" },
      { label: "동문보도", href: "/news/press" },
      { label: "포토 갤러리", href: "/news/gallery" },
    ],
  },
  총동창회소식: {
    breadcrumbParent: { label: "총동창회 소식", href: "/news/events" },
    listHref: "/news/events",
    sideMenus: [
      { label: "공지사항", href: "/news/notice" },
      { label: "주요행사", href: "/news/events" },
      { label: "동창회보", href: "/news/newsletter" },
      { label: "동문보도", href: "/news/press" },
      { label: "포토 갤러리", href: "/news/gallery" },
    ],
  },
  동문동정: {
    breadcrumbParent: { label: "동문보도", href: "/news/press" },
    listHref: "/news/press",
    sideMenus: [
      { label: "공지사항", href: "/news/notice" },
      { label: "주요행사", href: "/news/events" },
      { label: "동창회보", href: "/news/newsletter" },
      { label: "동문보도", href: "/news/press" },
      { label: "포토 갤러리", href: "/news/gallery" },
    ],
  },
  단위동문회소식: {
    breadcrumbParent: { label: "단위동문회 소식", href: "/community/local-news" },
    listHref: "/community/local-news",
    sideMenus: [
      { label: "단위동문회 소식", href: "/community/local-news" },
      { label: "자유게시판", href: "/community/board" },
      { label: "경조사 알림", href: "/community/condolence" },
      { label: "구인구직", href: "/community/jobs" },
    ],
  },
  자유게시판: {
    breadcrumbParent: { label: "자유게시판", href: "/community/board" },
    listHref: "/community/board",
    sideMenus: [
      { label: "단위동문회 소식", href: "/community/local-news" },
      { label: "자유게시판", href: "/community/board" },
      { label: "경조사 알림", href: "/community/condolence" },
      { label: "구인구직", href: "/community/jobs" },
    ],
  },
  구인구직: {
    breadcrumbParent: { label: "구인구직", href: "/community/jobs" },
    listHref: "/community/jobs",
    sideMenus: [
      { label: "단위동문회 소식", href: "/community/local-news" },
      { label: "자유게시판", href: "/community/board" },
      { label: "경조사 알림", href: "/community/condolence" },
      { label: "구인구직", href: "/community/jobs" },
    ],
  },
  모교소식: {
    breadcrumbParent: { label: "대학 주요 소식", href: "/university/news" },
    listHref: "/university/news",
    sideMenus: [
      { label: "대학 주요 소식", href: "/university/news" },
      { label: "학사 안내", href: "/university/academic" },
    ],
  },
  "인터뷰/칼럼": {
    breadcrumbParent: { label: "동문보도", href: "/news/press" },
    listHref: "/news/press",
    sideMenus: [
      { label: "공지사항", href: "/news/notice" },
      { label: "주요행사", href: "/news/events" },
      { label: "동창회보", href: "/news/newsletter" },
      { label: "동문보도", href: "/news/press" },
      { label: "포토 갤러리", href: "/news/gallery" },
    ],
  },
};

const DEFAULT_CONFIG = TYPE_CONFIG["공지사항"];

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) notFound();

  await supabase.from("posts").update({ views: post.views + 1 }).eq("id", id);

  const config = TYPE_CONFIG[post.type] ?? DEFAULT_CONFIG;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });

  return (
    <SubPageLayout
      breadcrumbs={[config.breadcrumbParent, { label: post.title }]}
      sideMenus={config.sideMenus}
      currentPath={config.listHref}
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs bg-[#E8F0FE] text-[#003876] px-2 py-0.5 rounded font-medium">
              {post.type}
            </span>
            {post.is_pinned && (
              <span className="text-xs bg-[#003876] text-white px-2 py-0.5 rounded">공지</span>
            )}
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            {post.author_name && <span>{post.author_name}</span>}
            <span>{formatDate(post.created_at)}</span>
            <span>조회 {post.views + 1}</span>
          </div>
        </div>

        <div className="px-6 py-8 min-h-48 prose prose-sm max-w-none prose-img:w-full prose-img:rounded-lg prose-img:my-4 prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.attachments && post.attachments.length > 0 && (
          <AttachmentsSection attachments={post.attachments} />
        )}

        <div className="px-6 py-4 border-t border-gray-100">
          <Link href={config.listHref} className="text-sm text-gray-500 hover:text-[#003876] transition-colors">
            ← 목록으로
          </Link>
        </div>
      </div>
    </SubPageLayout>
  );
}
