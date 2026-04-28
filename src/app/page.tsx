import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GNB } from "@/components/layout/GNB";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/components/home/HeroBanner";
import { QuickMenu } from "@/components/home/QuickMenu";
import { NewsSection } from "@/components/home/NewsSection";

function InhaShopBanner() {
  return (
    <section className="bg-[#C8A951]">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-[#7a5f1a] text-xs font-semibold tracking-widest uppercase mb-1">동문 전용 쇼핑몰</p>
          <h2 className="text-white text-xl md:text-2xl font-bold">인하상회 🏪</h2>
          <p className="text-white/80 text-sm mt-1">동문만을 위한 특별 할인 혜택을 확인하세요</p>
        </div>
        <Link
          href="/business/shop"
          className="shrink-0 px-6 py-3 bg-white text-[#7a5f1a] font-bold rounded-full text-sm hover:bg-[#FFF8E7] transition-colors shadow-sm"
        >
          인하상회 바로가기 →
        </Link>
      </div>
    </section>
  );
}

const bizItems = [
  { label: "인하사랑카드", desc: "카드 신청 및 혜택", href: "/business/card", bg: "bg-[#003876]" },
  { label: "인하플레이스", desc: "동문 업소 찾기", href: "/business/place", bg: "bg-[#0066CC]" },
  { label: "인하사랑콘서트", desc: "문화 공연 티켓", href: "/business/concert", bg: "bg-[#1A1A2E]" },
  { label: "창업지원", desc: "동문 창업 네트워크", href: "/business/startup", bg: "bg-[#555]" },
];

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
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

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: posts }, { data: banners }, { data: condolences }] = await Promise.all([
    supabase
      .from("posts")
      .select("id, type, title, summary, image_url, created_at, is_pinned")
      .in("type", ["공지사항", "총동창회소식", "단위동문회소식", "동문동정", "모교소식", "인터뷰/칼럼"])
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("banners")
      .select("id, title, subtitle, image_url, link_url, sort_order")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("condolence_events")
      .select("id, name, type, content, event_date")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  return (
    <div className="min-h-screen flex flex-col font-[Pretendard,system-ui,sans-serif]">
      <GNB />
      <main className="flex-1">
        <HeroBanner banners={banners ?? []} />
        <QuickMenu />
        <InhaShopBanner />
        <BizSection />
        <NewsSection posts={posts ?? []} condolences={condolences ?? []} />
      </main>
      <Footer />
    </div>
  );
}
