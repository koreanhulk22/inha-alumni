import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { GNB } from "@/components/layout/GNB";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/components/home/HeroBanner";
import { QuickMenu } from "@/components/home/QuickMenu";
import { NewsSection } from "@/components/home/NewsSection";
import { AdSlider } from "@/components/home/AdSlider";

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

const bizItems = [
  { label: "인하상회", desc: "동문 전용 쇼핑몰", href: "/business/shop", bg: "bg-[#1A6B4A]" },
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

function SideBannerAdItem({ banner }: { banner: { id: string; image_url: string | null; link_url: string | null; alt_text: string | null } }) {
  return (
    <a
      href={banner.link_url ?? "#"}
      target={banner.link_url ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="block relative w-[120px] h-[200px] rounded-lg overflow-hidden border border-gray-200 bg-white hover:border-[#003876] hover:shadow-sm transition-all"
    >
      {banner.image_url ? (
        <Image src={banner.image_url} alt={banner.alt_text ?? "AD"} fill className="object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-[#003876]/10 flex items-center justify-center">
            <span className="text-[#003876] text-[10px] font-bold">AD</span>
          </div>
          <span className="text-gray-400 text-[9px] text-center leading-relaxed px-2 whitespace-pre-line">{"광고 문의\n032-887-2345"}</span>
        </div>
      )}
    </a>
  );
}

export default async function HomePage() {
  const supabase = await createClient();

  const [
    { data: posts },
    { data: banners },
    { data: condolences },
    { data: adSlides },
    { data: sideBanners },
  ] = await Promise.all([
    supabase
      .from("posts")
      .select("id, type, title, summary, image_url, created_at, is_pinned")
      .in("type", ["공지사항", "총동창회소식", "모교소식", "동문동정", "인터뷰/칼럼"])
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
    supabase
      .from("ad_slides")
      .select("id, title, label, image_url, link_url, sort_order")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("side_banners")
      .select("id, image_url, link_url, alt_text, position, sort_order")
      .eq("is_active", true)
      .order("sort_order"),
  ]);

  const sideBannersRight = (sideBanners ?? []).filter((b) => b.position === "right");

  return (
    <div className="min-h-screen flex flex-col font-[Pretendard,system-ui,sans-serif]">
      <GNB />
      <main className="flex-1">

        {/* 히어로 + 퀵메뉴 오버레이 */}
        <div className="relative">
          <HeroBanner banners={banners ?? []} />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/65 to-transparent z-[15] pointer-events-none" />
          <div className="absolute bottom-10 left-0 right-0 z-20">
            <div className="max-w-7xl mx-auto px-4">
              <QuickMenu />
            </div>
          </div>
        </div>

        <BizSection />

        {/* 관련기관 링크 바 */}
        <div className="bg-[#F5F7FA] border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-xs text-gray-400 font-medium shrink-0">관련기관</span>
            {[
              { label: "인하대학교", href: "https://www.inha.ac.kr" },
              { label: "인하대학교병원", href: "https://www.inhauh.com" },
              { label: "학생진로설계포털", href: "https://career.inha.ac.kr" },
              { label: "졸업증명서 발급", href: "https://www.inha.ac.kr/kr/1083/subview.do" },
              { label: "동문장학회", href: "https://inhaasf.com" },
            ].map((link) => (
              <a key={link.href} href={link.href} className="text-xs text-gray-500 hover:text-[#003876] transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* 뉴스 섹션: 왼쪽 여백 + 콘텐츠 + 오른쪽 사이드 배너 */}
        <section className="py-10 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex gap-5 items-start">
              {/* 왼쪽 여백 (시각적 센터링) */}
              <div className="hidden xl:block w-[148px] shrink-0" />
              <div className="flex-1 min-w-0">
                <NewsSection posts={posts ?? []} condolences={condolences ?? []} />
              </div>
              {/* 오른쪽 광고 사이드 */}
              <aside className="hidden xl:flex flex-col gap-3 w-[148px] shrink-0 sticky top-20 self-start">
                {sideBannersRight.map((b) => (
                  <SideBannerAdItem key={b.id} banner={b} />
                ))}
                {sideBannersRight.length === 0 && (
                  <div className="w-[120px] h-[200px] rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                    <span className="text-[10px] text-gray-300 text-center">광고</span>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>

        {/* 슬라이드 광고 + 동문기업 */}
        <section className="bg-white py-12 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-gray-800">슬라이드 광고</h3>
                </div>
                <AdSlider slides={adSlides ?? []} />
              </div>
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
                        <p className="text-sm font-bold text-gray-800 group-hover:text-[#003876] transition-colors leading-snug">
                          {co.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{co.person}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <DonationDashboard />
      </main>
      <Footer />
    </div>
  );
}
