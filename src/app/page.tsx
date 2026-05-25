import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { GNB } from "@/components/layout/GNB";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/components/home/HeroBanner";
import { QuickMenu } from "@/components/home/QuickMenu";
import { NewsSection } from "@/components/home/NewsSection";
import { ColorSwitcher } from "@/components/home/ColorSwitcher";
import { SideBanners } from "@/components/home/SideBanners";

function InhaShopBanner() {
  return (
    <section style={{ background: "var(--shop-bg)", transition: "background 0.4s" }}>
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-1">동문 전용 쇼핑몰</p>
          <h2 className="text-white text-xl md:text-2xl font-bold">인하상회 🏪</h2>
          <p className="text-white/80 text-sm mt-1">동문만을 위한 특별 할인 혜택을 확인하세요</p>
        </div>
        <Link
          href="/business/shop"
          className="shrink-0 px-6 py-3 bg-white font-bold rounded-full text-sm hover:bg-white/90 transition-colors shadow-sm"
          style={{ color: "var(--brand-primary)" }}
        >
          인하상회 바로가기 →
        </Link>
      </div>
    </section>
  );
}

const bizItems = [
  { label: "인하사랑카드", desc: "카드 신청 및 혜택", href: "/business/card", cssVar: "--brand-primary" },
  { label: "인하플레이스", desc: "동문 업소 찾기", href: "/business/place", cssVar: "--brand-secondary" },
  { label: "인하사랑콘서트", desc: "문화 공연 티켓", href: "/business/concert", fixedBg: "#1A1A2E" },
  { label: "창업지원", desc: "동문 창업 네트워크", href: "/business/startup", fixedBg: "#555" },
];

function DonationDashboard() {
  const funds = [
    { label: "회비발전기금", current: 68 },
    { label: "장학기금", current: 45 },
    { label: "동문회관 건립기금", current: 23 },
  ];
  return (
    <section className="py-12 md:py-16" style={{ background: "var(--donation-bg)", transition: "background 0.4s" }}>
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
              className="rounded-lg p-4 md:p-6 flex flex-col gap-1.5 md:gap-2 hover:opacity-90 transition-all duration-300"
              style={{ background: item.cssVar ? `var(${item.cssVar})` : item.fixedBg }}
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

  const admin = createAdminClient();
  const [{ data: posts }, { data: banners }, { data: condolences }, { data: adBanners }] = await Promise.all([
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
    admin
      .from("ad_banners" as never)
      .select("id, zone, title, image_url, link_url, sort_order")
      .eq("is_active", true)
      .order("sort_order")
      .then((r: { data: unknown }) => ({ data: (r.data ?? []) as Array<{ id: string; zone: string; title: string | null; image_url: string | null; link_url: string | null; sort_order: number }> })),
  ]);

  const allAdBanners = (adBanners ?? []) as Array<{ id: string; zone: string; title: string | null; image_url: string | null; link_url: string | null; sort_order: number }>;
  const leftBanners = allAdBanners.filter((b) => b.zone === "side_left");
  const rightBanners = allAdBanners.filter((b) => b.zone === "side_right");
  const slideRightBanners = allAdBanners.filter((b) => b.zone === "slide_right");

  return (
    <div className="min-h-screen flex flex-col font-[Pretendard,system-ui,sans-serif]">
      <GNB />
      <main className="flex-1">
        <HeroBanner banners={banners ?? []} />
        <QuickMenu />
        <InhaShopBanner />
        <BizSection />
        <NewsSection posts={posts ?? []} condolences={condolences ?? []} slideRightBanners={slideRightBanners} />
        <DonationDashboard />
      </main>
      <Footer />
      <SideBanners leftBanners={leftBanners} rightBanners={rightBanners} />
      <ColorSwitcher />
    </div>
  );
}
