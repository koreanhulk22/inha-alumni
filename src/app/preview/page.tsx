"use client";

import { useState } from "react";
import Link from "next/link";
import { GNB } from "@/components/layout/GNB";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/components/home/HeroBanner";
import { AdSlider } from "@/components/home/AdSlider";

/* ── QuickMenu items ── */
const QUICK_ITEMS = [
  { label: "동문 검색", href: "/network/search", icon: "🔍" },
  { label: "회원 우대 서비스", href: "/business", icon: "🎁" },
  { label: "후원금 기부", href: "/donate", icon: "❤️" },
  { label: "올해 행사", href: "/news/events", icon: "📅" },
  { label: "공지사항", href: "/news/notice", icon: "📢" },
];

/* ── Types & mock data ── */
type PostType = "총동창회소식" | "공지사항" | "단위동문회소식" | "동문동정" | "모교소식" | "인터뷰/칼럼";

interface MockPost {
  id: string;
  type: PostType;
  title: string;
  summary?: string;
  image_url: string | null;
  created_at: string;
  is_pinned: boolean;
}

const MOCK_POSTS: MockPost[] = [
  { id: "1", type: "총동창회소식", title: "제33대 김종우 총동창회장 취임", summary: "김종우(전자84) 회장 취임식이 인천 라마다송도호텔에서 개최", image_url: null, created_at: "2026-01-27T00:00:00Z", is_pinned: false },
  { id: "2", type: "총동창회소식", title: "2025 인하가족의 밤 개최", summary: "인천 송도컨벤시아에서 인하 가족의 밤 행사 개최", image_url: null, created_at: "2025-12-04T00:00:00Z", is_pinned: false },
  { id: "3", type: "총동창회소식", title: "2025 총동창회장배 골프대회", summary: "경기도 덕평 H1클럽에서 40팀 160명 참가", image_url: null, created_at: "2025-05-26T00:00:00Z", is_pinned: false },
  { id: "4", type: "총동창회소식", title: "비룡제 격려 방문", summary: "인하대 축제 비룡제에 총동창회장 격려 방문", image_url: null, created_at: "2025-05-16T00:00:00Z", is_pinned: false },
  { id: "5", type: "공지사항", title: "[공지] 2026년도 회비 납부 안내", image_url: null, created_at: "2026-05-20T00:00:00Z", is_pinned: true },
  { id: "6", type: "공지사항", title: "동문회관 건립기금 모금 현황", image_url: null, created_at: "2026-05-15T00:00:00Z", is_pinned: false },
  { id: "7", type: "공지사항", title: "제33대 회장 취임 인사말", image_url: null, created_at: "2026-01-27T00:00:00Z", is_pinned: false },
  { id: "8", type: "공지사항", title: "2025 인하가족의 밤 결과 보고", image_url: null, created_at: "2025-12-05T00:00:00Z", is_pinned: false },
  { id: "9", type: "단위동문회소식", title: "인맥회(기계과) 회장 이취임식", summary: "박성구(81) 신임회장 취임", image_url: null, created_at: "2025-03-07T00:00:00Z", is_pinned: false },
  { id: "10", type: "단위동문회소식", title: "ROTC동문회 현충원 참배", summary: "순직 동문 5명 묘소 참배, 78명 참석", image_url: null, created_at: "2025-06-01T00:00:00Z", is_pinned: false },
  { id: "11", type: "동문동정", title: "120ROTC산악회 안나푸르나 트래킹", summary: "베이스캠프 트래킹 완료", image_url: null, created_at: "2025-10-15T00:00:00Z", is_pinned: false },
  { id: "12", type: "동문동정", title: "동문 CEO 포럼 2026 봄 정기모임", summary: "강남 스타리움에서 동문 CEO 30여명 참석", image_url: null, created_at: "2026-04-22T00:00:00Z", is_pinned: false },
  { id: "13", type: "모교소식", title: "인하대 생명과학과 설립 50주년 기념식", summary: "50주년 기념 심포지엄 및 학술대회 성료", image_url: null, created_at: "2025-09-01T00:00:00Z", is_pinned: false },
  { id: "14", type: "모교소식", title: "2026 인하대학교 입학식 거행", summary: "신입생 3,200여명 인하의 일원으로", image_url: null, created_at: "2026-03-02T00:00:00Z", is_pinned: false },
  { id: "15", type: "인터뷰/칼럼", title: "[칼럼] 동문 네트워크의 가치", summary: "대학 동문 조직이 사회적 자본으로서 갖는 의미", image_url: null, created_at: "2026-05-10T00:00:00Z", is_pinned: false },
  { id: "16", type: "인터뷰/칼럼", title: "[인터뷰] 김종우 회장에게 듣는 인하의 미래", summary: "제33대 회장 취임 인터뷰", image_url: null, created_at: "2026-02-01T00:00:00Z", is_pinned: false },
];

const MOCK_CONDOLENCES = [
  { id: "1", name: "김○○ 동문", type: "경사", content: "득남", event_date: "2026-05-10" },
  { id: "2", name: "이○○ 동문 부친", type: "부고", content: "별세", event_date: "2026-05-08" },
  { id: "3", name: "박○○ 동문", type: "경사", content: "자녀 결혼", event_date: "2026-05-04" },
  { id: "4", name: "최○○ 동문", type: "경사", content: "교수 임용", event_date: "2026-05-01" },
  { id: "5", name: "정○○ 동문 모친", type: "부고", content: "별세", event_date: "2026-04-28" },
];

const MOCK_AD_SLIDES = [
  { id: "s1", title: "인하사랑카드 혜택 안내", label: "금융", image_url: null, link_url: "/business/card" },
  { id: "s2", title: "동문 창업 지원 프로그램", label: "창업", image_url: null, link_url: "/business/startup" },
  { id: "s3", title: "인하상회 동문 특별 할인", label: "쇼핑", image_url: null, link_url: "/business/shop" },
];

const SIDE_BANNERS_RIGHT = [
  { label: "인하상회", sub: "동문 전용 쇼핑", href: "/business/shop" },
  { label: "창업지원", sub: "동문 네트워크", href: "/business/startup" },
  { label: "총동창회장배", sub: "골프대회", href: "/news/events" },
  { label: "인하사랑콘서트", sub: "문화 공연 티켓", href: "/business/concert" },
];

/* 동문기업: 이름 + 동문 정보 */
const PARTNER_COMPANIES = [
  { name: "인하로지스틱스", person: "김○○ (기계과 85)", initial: "인" },
  { name: "(주)비젼테크", person: "이○○ (전자과 90)", initial: "비" },
  { name: "인하메디컬", person: "박○○ (의학과 95)", initial: "의" },
  { name: "스마트솔루션즈", person: "최○○ (경영학과 00)", initial: "스" },
  { name: "KH법무법인", person: "정○○ (법학과 88)", initial: "법" },
  { name: "(주)한빛건설", person: "강○○ (건축과 92)", initial: "한" },
  { name: "인하식품", person: "조○○ (식품과 87)", initial: "식" },
  { name: "알파테크", person: "윤○○ (컴퓨터 03)", initial: "알" },
];

const CARD_NEWS_ITEMS = [
  { title: "제33대 총동창회장 취임", tag: "NEWS", color: "#003876" },
  { title: "2026 장학증서 수여식", tag: "EVENT", color: "#1A6B4A" },
  { title: "인하상회 정식 오픈", tag: "BIZ", color: "#0066CC" },
  { title: "ROTC동문회 참배 행사", tag: "NEWS", color: "#1A1A2E" },
];

const bizItems = [
  { label: "인하상회", desc: "동문 전용 쇼핑몰", href: "/business/shop", bg: "bg-[#1A6B4A]" },
  { label: "인하사랑카드", desc: "카드 신청 및 혜택", href: "/business/card", bg: "bg-[#003876]" },
  { label: "인하플레이스", desc: "동문 업소 찾기", href: "/business/place", bg: "bg-[#0066CC]" },
  { label: "인하사랑콘서트", desc: "문화 공연 티켓", href: "/business/concert", bg: "bg-[#1A1A2E]" },
  { label: "창업지원", desc: "동문 창업 네트워크", href: "/business/startup", bg: "bg-[#555]" },
];

/* ── Helpers ── */
const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" });

const formatDateFull = (d: string) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, "0")}.${String(dt.getDate()).padStart(2, "0")}`;
};

const TYPE_LABEL: Record<string, string> = {
  "총동창회소식": "본회소식",
  "모교소식": "모교소식",
  "동문동정": "인하동정",
  "인터뷰/칼럼": "오피니언",
  "공지사항": "공지",
  "단위동문회소식": "단위동문회",
};

const TYPE_BADGE: Record<string, string> = {
  "총동창회소식": "bg-[#003876] text-white",
  "모교소식": "bg-[#1A6B4A] text-white",
  "동문동정": "bg-[#0277BD] text-white",
  "인터뷰/칼럼": "bg-gray-700 text-white",
  "공지사항": "bg-[#C8A951] text-[#003876]",
  "단위동문회소식": "bg-gray-200 text-gray-600",
};

const TYPE_TEXT_COLOR: Record<string, string> = {
  "총동창회소식": "text-[#003876]",
  "모교소식": "text-[#1A6B4A]",
  "동문동정": "text-[#0277BD]",
  "인터뷰/칼럼": "text-gray-600",
  "공지사항": "text-[#C8A951]",
  "단위동문회소식": "text-gray-500",
};

const FEATURED_GRAD: Record<string, string> = {
  "총동창회소식": "from-[#003876] to-[#0066CC]",
  "모교소식": "from-[#1A6B4A] to-[#003876]",
  "동문동정": "from-[#0277BD] to-[#003876]",
  "인터뷰/칼럼": "from-[#1A1A2E] to-[#003876]",
};

/* ── BizSection ── */
function BizSection() {
  return (
    <section className="bg-white py-8 md:py-10 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base md:text-lg font-bold text-gray-800">총동창회 주요 사업</h2>
          <Link href="/business" className="text-sm text-gray-400 hover:text-[#003876] transition-colors">
            전체보기 +
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {bizItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${item.bg} rounded-lg p-4 md:p-6 flex flex-col gap-1.5 md:gap-2 hover:opacity-90 transition-opacity`}
            >
              <span className="text-white font-bold text-sm md:text-base">{item.label}</span>
              <span className="text-white/70 text-xs">{item.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── DonationDashboard ── */
function DonationDashboard() {
  const funds = [
    { label: "회비발전기금", current: 68 },
    { label: "장학기금", current: 45 },
    { label: "동문회관 건립기금", current: 23 },
  ];
  return (
    <section className="bg-[#003876] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-[#C8A951] text-xs font-semibold tracking-widest uppercase mb-2">Donate &amp; Membership</p>
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
            동문 여러분의 참여가<br />인하의 미래를 만듭니다
          </h2>
          <p className="text-white/60 text-sm mb-6">회비발전기금 · 장학기금 · 동문회관 건립기금</p>
          <div className="flex gap-3">
            <Link href="/donate" className="px-6 py-3 bg-[#C8A951] text-[#003876] font-bold rounded-full text-sm hover:bg-[#d4b96a] transition-colors">
              기부하기
            </Link>
            <Link href="/donate/membership" className="px-6 py-3 border border-white/30 text-white text-sm font-semibold rounded-full hover:border-white transition-colors">
              회비 납부
            </Link>
          </div>
        </div>
        <div className="space-y-4">
          {funds.map((fund) => (
            <div key={fund.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white/80 text-sm font-medium">{fund.label}</span>
                <span className="text-[#C8A951] text-sm font-bold">{fund.current}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#C8A951] rounded-full" style={{ width: `${fund.current}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SideBannerItem ── */
function SideBannerItem({ label, sub, href }: { label: string; sub: string; href: string }) {
  return (
    <a
      href={href}
      className="relative w-[120px] h-[200px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity flex flex-col items-center justify-center text-center p-3 gap-1.5 bg-white border-2 border-[#003876]"
    >
      <span className="text-2xl">🏫</span>
      <span className="text-xs font-bold text-[#003876] leading-tight">{label}</span>
      <span className="text-[10px] text-gray-500 leading-tight">{sub}</span>
      <span className="absolute bottom-1 right-1 text-[9px] bg-[#003876] text-white px-1 rounded">AD</span>
    </a>
  );
}

/* ── PostList ── */
function PostList({ posts }: { posts: MockPost[] }) {
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

/* ── 주요소식 탭 섹션 (한국외대 스타일 4열 카드) ── */
const NEWS_TABS = [
  { label: "전체", types: ["총동창회소식", "모교소식", "동문동정", "인터뷰/칼럼"] },
  { label: "본회소식", types: ["총동창회소식"] },
  { label: "모교소식", types: ["모교소식"] },
  { label: "인하동정", types: ["동문동정"] },
  { label: "인터뷰", types: ["인터뷰/칼럼"] },
  { label: "오피니언", types: ["인터뷰/칼럼"] },
];

function TabNewsSection() {
  const [activeTab, setActiveTab] = useState(0);
  const tabTypes = NEWS_TABS[activeTab].types;
  const filtered = MOCK_POSTS.filter((p) => tabTypes.includes(p.type)).slice(0, 8);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-0">
        <h3 className="text-lg font-bold text-gray-900">주요 소식</h3>
        <Link href="/news" className="text-sm text-gray-400 hover:text-[#003876] transition-colors mt-0.5">
          더보기 +
        </Link>
      </div>

      {/* 언더라인 탭 */}
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

      {/* 4열 카드 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map((post) => (
          <Link key={post.id} href={`/news/${post.id}`} className="group">
            <div className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all">
              {/* 이미지 영역 */}
              <div className="relative h-40 overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${FEATURED_GRAD[post.type] ?? "from-[#003876] to-[#0066CC]"} flex items-center justify-center`}
                >
                  <span className="text-white/10 text-5xl font-black select-none">INHA</span>
                </div>
                {/* 카테고리 뱃지 (좌상단) */}
                <div className="absolute top-2 left-2 z-10">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${TYPE_BADGE[post.type] ?? "bg-gray-200 text-gray-700"}`}>
                    {TYPE_LABEL[post.type]}
                  </span>
                </div>
              </div>
              {/* 콘텐츠 */}
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
  );
}

/* ── 단위동문회소식 + 동문동정 ── */
function LocalAlumniSection() {
  const localNews = MOCK_POSTS.filter((p) => p.type === "단위동문회소식");
  const alumniNews = MOCK_POSTS.filter((p) => p.type === "동문동정");
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between border-b-2 border-[#003876] pb-3 mb-1">
          <h3 className="text-[15px] font-bold text-gray-800">단위동문회 소식</h3>
          <Link href="/community/local-news" className="text-xs text-gray-400 hover:text-[#003876] transition-colors">더보기 +</Link>
        </div>
        <PostList posts={localNews} />
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between border-b-2 border-[#003876] pb-3 mb-1">
          <h3 className="text-[15px] font-bold text-gray-800">동문동정</h3>
          <Link href="/news/press" className="text-xs text-gray-400 hover:text-[#003876] transition-colors">더보기 +</Link>
        </div>
        <PostList posts={alumniNews} />
      </div>
    </div>
  );
}

/* ── 공지사항 + 경조사 ── */
function NoticeCondolenceSection() {
  const notices = MOCK_POSTS.filter((p) => p.type === "공지사항");
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between border-b-2 border-[#003876] pb-3 mb-1">
          <h3 className="text-[15px] font-bold text-gray-800">공지사항</h3>
          <Link href="/news/notice" className="text-xs text-gray-400 hover:text-[#003876] transition-colors">더보기 +</Link>
        </div>
        <PostList posts={notices} />
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between border-b-2 border-[#003876] pb-3 mb-1">
          <h3 className="text-[15px] font-bold text-gray-800">경조사 알림</h3>
          <Link href="/community/condolence" className="text-xs text-gray-400 hover:text-[#003876] transition-colors">더보기 +</Link>
        </div>
        <ul className="divide-y divide-gray-100">
          {MOCK_CONDOLENCES.map((item) => (
            <li key={item.id}>
              <Link href="/community/condolence" className="flex items-center justify-between py-2.5 gap-2 group hover:bg-gray-50 px-2 -mx-2 transition-colors rounded">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm shrink-0">{item.type === "경사" ? "🎉" : "🕯️"}</span>
                  <span className="text-sm text-gray-600 group-hover:text-[#003876] truncate">{item.name} · {item.content}</span>
                </div>
                {item.event_date && <span className="shrink-0 text-xs text-gray-400">{formatDate(item.event_date)}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── 하단: 슬라이드 광고 + 동문기업 ── */
function BottomSection() {
  return (
    <section className="bg-white py-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* 슬라이드 광고 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-800">슬라이드 광고</h3>
              <span className="text-xs text-gray-400">어드민에서 관리</span>
            </div>
            <AdSlider slides={MOCK_AD_SLIDES} />
          </div>

          {/* 동문기업 (한국외대 스타일) */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">동문기업</h3>
              <Link href="/network/companies" className="text-sm text-gray-500 hover:text-[#003876] transition-colors">
                더보기 →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PARTNER_COMPANIES.map((co, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#003876] hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="h-28 bg-gray-50 flex items-center justify-center border-b border-gray-100 group-hover:bg-blue-50/30 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                      <span className="text-xl font-black text-[#003876]">{co.initial}</span>
                    </div>
                  </div>
                  <div className="px-4 py-3 text-center">
                    <p className="text-sm font-bold text-gray-800 group-hover:text-[#003876] transition-colors leading-snug">{co.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{co.person}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ── Page ── */
export default function PreviewPage() {
  return (
    <div className="min-h-screen font-[Pretendard,system-ui,sans-serif]">

      <GNB />

      {/* 히어로 + 퀵메뉴 — 히어로 배경과 자연스럽게 연결 */}
      <div className="relative">
        <HeroBanner banners={[]} />
        {/* 하단 그라디언트 페이드 (퀵메뉴 영역까지 자연스럽게) */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/65 to-transparent z-[15] pointer-events-none" />
        {/* 퀵메뉴 — bottom-14로 약간 위로, 전체 흰색 테두리 포함 */}
        <div className="absolute bottom-10 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-5 border border-white/30 divide-x divide-white/30 rounded-sm">
              {QUICK_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-2 py-4 md:py-5 hover:bg-white/10 transition-all"
                >
                  <span className="text-2xl md:text-3xl drop-shadow-lg">{item.icon}</span>
                  <span className="text-white text-[11px] md:text-sm font-medium text-center leading-tight drop-shadow-md px-1">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BizSection />

      {/* 뉴스 + 오른쪽 광고 */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex gap-5 items-start">
            <div className="flex-1 min-w-0 space-y-6">
              <TabNewsSection />
              <NoticeCondolenceSection />
            </div>
            <aside className="hidden lg:flex flex-col gap-3 shrink-0 sticky top-20 self-start">
              {SIDE_BANNERS_RIGHT.map((b, i) => (
                <SideBannerItem key={i} {...b} />
              ))}
            </aside>
          </div>
        </div>
      </section>

      <DonationDashboard />
      <BottomSection />
      <Footer />
    </div>
  );
}
