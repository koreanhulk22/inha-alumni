"use client";

import { useState } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/* Theme definitions                                                   */
/* ------------------------------------------------------------------ */

interface Theme {
  name: string;
  navy: string;
  navyHover: string;
  gold: string;
  goldText: string;
  goldHover: string;
  blue: string;
  dark: string;
}

const themes: Theme[] = [
  { name: "인하 기본", navy: "#003876", navyHover: "#002a5c", gold: "#C8A951", goldText: "#7a5f1a", goldHover: "#d4b96a", blue: "#0066CC", dark: "#1A1A2E" },
  { name: "미드나잇 네이비", navy: "#0A2342", navyHover: "#071929", gold: "#C8A951", goldText: "#7a5f1a", goldHover: "#d4b96a", blue: "#1565C0", dark: "#071929" },
  { name: "인디고 + 골드", navy: "#1A237E", navyHover: "#121760", gold: "#D4AF37", goldText: "#8B7000", goldHover: "#e0c04a", blue: "#283593", dark: "#0D0D3E" },
  { name: "딥 블루", navy: "#0D47A1", navyHover: "#09337a", gold: "#C8A951", goldText: "#7a5f1a", goldHover: "#d4b96a", blue: "#1565C0", dark: "#071929" },
  { name: "오션 블루", navy: "#0277BD", navyHover: "#015c90", gold: "#C8A951", goldText: "#7a5f1a", goldHover: "#d4b96a", blue: "#0288D1", dark: "#01338c" },
  { name: "스틸 블루", navy: "#01579B", navyHover: "#014175", gold: "#C8A951", goldText: "#7a5f1a", goldHover: "#d4b96a", blue: "#0277BD", dark: "#012f60" },
  { name: "다크 틸", navy: "#0C3547", navyHover: "#081f2b", gold: "#C8A951", goldText: "#7a5f1a", goldHover: "#d4b96a", blue: "#0E5073", dark: "#061520" },
  { name: "챠콜 네이비", navy: "#1C2938", navyHover: "#111b25", gold: "#C8A951", goldText: "#7a5f1a", goldHover: "#d4b96a", blue: "#2C4A6E", dark: "#0D1117" },
];

/* ------------------------------------------------------------------ */
/* Demo banner data                                                    */
/* ------------------------------------------------------------------ */

const SIDE_BANNERS_LEFT = [
  { label: "인하사랑카드", sub: "동문 혜택 카드", color: "#003876" },
  { label: "인하플레이스", sub: "동문 업소 찾기", color: "#0066CC" },
  { label: "동문장학회", sub: "장학금 신청", color: "#1A1A2E" },
  { label: "모교후원", sub: "발전기금 기부", color: "#2C4A6E" },
];

const SIDE_BANNERS_RIGHT = [
  { label: "인하상회", sub: "동문 전용 쇼핑", color: "#C8A951", textColor: "#7a5f1a" },
  { label: "창업지원", sub: "동문 네트워크", color: "#1B4332", textColor: "#fff" },
  { label: "골프대회", sub: "총동창회장배", color: "#6B1E3A", textColor: "#fff" },
  { label: "동문콘서트", sub: "인하사랑콘서트", color: "#4A0E8F", textColor: "#fff" },
];

const CARD_NEWS = [
  { label: "제33대 총동창회장 취임", tag: "NEWS", color: "#003876" },
  { label: "2026 장학증서 수여식", tag: "EVENT", color: "#0066CC" },
  { label: "인하상회 정식 오픈", tag: "BIZ", color: "#C8A951", textColor: "#7a5f1a" },
  { label: "ROTC동문회 참배 행사", tag: "NEWS", color: "#1A1A2E" },
  { label: "동문 골프 대회 신청", tag: "EVENT", color: "#1B4332" },
  { label: "동문회관 건립기금", tag: "FUND", color: "#6B1E3A" },
];

/* ------------------------------------------------------------------ */
/* Color Switcher                                                      */
/* ------------------------------------------------------------------ */

function ColorSwitcher({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 w-52">
      <p className="text-xs font-bold text-gray-600 mb-3 tracking-wide uppercase">컬러 시안</p>
      <div className="space-y-1">
        {themes.map((t, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
              active === i ? "bg-gray-100 ring-1 ring-gray-300" : "hover:bg-gray-50"
            }`}
          >
            <span className="w-5 h-5 rounded-full shrink-0 border border-white shadow-sm"
              style={{ background: `linear-gradient(135deg, ${t.navy} 50%, ${t.gold} 50%)` }} />
            <span className="text-xs text-gray-700 leading-tight">{t.name}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 text-center text-[10px] text-gray-400">
        컨펌 후 실제 적용
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* GNB                                                                 */
/* ------------------------------------------------------------------ */

function PreviewGNB({ t }: { t: Theme }) {
  return (
    <header className="h-16 border-b border-gray-100 bg-white flex items-center sticky top-0 z-40">
      <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black"
            style={{ background: t.navy }}>仁</div>
          <div>
            <div className="text-sm font-bold text-gray-800">인하대학교 총동창회</div>
            <div className="text-[10px] font-semibold" style={{ color: t.gold }}>INHA UNIVERSITY</div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-5 text-sm text-gray-600">
          {["총동창회", "소식", "사업", "커뮤니티", "네트워크", "장학회", "모교소식", "기부"].map((m) => (
            <span key={m} className="hover:text-gray-900 cursor-pointer">{m}</span>
          ))}
        </nav>
        <button className="text-xs px-3 py-1.5 rounded-full font-medium text-white"
          style={{ background: t.navy }}>로그인</button>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero (full screen)                                                  */
/* ------------------------------------------------------------------ */

function PreviewHero({ t }: { t: Theme }) {
  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${t.dark} 0%, ${t.navy} 60%, ${t.blue} 100%)` }}>
      <div className="text-center text-white z-10">
        <div className="text-xs font-semibold tracking-widest mb-3 uppercase" style={{ color: t.gold }}>
          Inha University Alumni Association
        </div>
        <h1 className="text-4xl font-black mb-3">인하대학교 총동창회</h1>
        <p className="text-white/70 text-base mb-8">친목공영 | 모교후원 | 후진육영</p>
        <div className="flex gap-3 justify-center">
          <button className="px-6 py-3 rounded-full text-sm font-bold shadow"
            style={{ background: t.gold, color: t.goldText }}>자세히 보기</button>
          <button className="px-6 py-3 rounded-full text-sm font-semibold border border-white/40 text-white hover:border-white transition-colors">
            회비 납부
          </button>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {[0,1,2].map(i => <div key={i} className={`h-1.5 rounded-full ${i===0?"w-6 bg-white":"w-2 bg-white/40"}`} />)}
      </div>
      <div className="absolute inset-0 opacity-5 flex items-end justify-end p-8 select-none">
        <span className="text-[180px] font-black text-white leading-none">仁</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* QuickMenu strip                                                     */
/* ------------------------------------------------------------------ */

function PreviewQuickMenu({ t }: { t: Theme }) {
  const menus = [
    { label: "인하상회", icon: "🏪" }, { label: "인하사랑카드", icon: "💳" },
    { label: "인하플레이스", icon: "📍" }, { label: "동문 검색", icon: "🔍" },
    { label: "기부하기", icon: "❤️" },
  ];
  return (
    <div style={{ background: t.navy }}>
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-5 divide-x divide-white/15">
          {menus.map((m) => (
            <div key={m.label}
              className="flex flex-col items-center gap-2 py-6 cursor-pointer transition-all hover:brightness-90"
              style={{ borderColor: "rgba(255,255,255,0.15)" }}>
              <span className="text-2xl">{m.icon}</span>
              <span className="text-white text-xs font-medium">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Side Banner (single item)                                           */
/* ------------------------------------------------------------------ */

function SideBanner({ label, sub, color, textColor = "#fff" }: {
  label: string; sub: string; color: string; textColor?: string;
}) {
  return (
    <div className="w-[120px] h-[200px] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity flex flex-col items-center justify-center text-center p-3 gap-1.5"
      style={{ background: color }}>
      <span className="text-2xl">🏫</span>
      <span className="text-xs font-bold leading-tight" style={{ color: textColor }}>{label}</span>
      <span className="text-[10px] leading-tight opacity-80" style={{ color: textColor }}>{sub}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Layout with side banners                                            */
/* ------------------------------------------------------------------ */

function WithSideBanners({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1400px] mx-auto px-4">
      <div className="flex gap-4">
        {/* Left side banners */}
        <aside className="hidden xl:flex flex-col gap-3 pt-6 shrink-0">
          {SIDE_BANNERS_LEFT.map((b, i) => (
            <SideBanner key={i} {...b} />
          ))}
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>

        {/* Right side banners */}
        <aside className="hidden xl:flex flex-col gap-3 pt-6 shrink-0">
          {SIDE_BANNERS_RIGHT.map((b, i) => (
            <SideBanner key={i} {...b} />
          ))}
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* BizSection                                                          */
/* ------------------------------------------------------------------ */

function PreviewBizSection({ t }: { t: Theme }) {
  const items = [
    { label: "인하사랑카드", desc: "카드 신청 및 혜택", bg: t.navy },
    { label: "인하플레이스", desc: "동문 업소 찾기", bg: t.blue },
    { label: "인하사랑콘서트", desc: "문화 공연 티켓", bg: t.dark },
    { label: "창업지원", desc: "동문 창업 네트워크", bg: "#6B7280" },
  ];
  return (
    <div className="bg-white py-8 border-b border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-gray-800">총동창회 주요 사업</h2>
        <span className="text-sm text-gray-400 cursor-pointer">전체보기 +</span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg p-5 flex flex-col gap-2 cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: item.bg }}>
            <span className="text-white font-bold text-sm">{item.label}</span>
            <span className="text-white/70 text-xs">{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* News section (simplified)                                           */
/* ------------------------------------------------------------------ */

function PreviewNewsSection({ t }: { t: Theme }) {
  const news = [
    "제33대 김종우 총동창회장 취임식 개최",
    "2026 총동창회장배 골프대회 안내",
    "인하대학교 개교 72주년 기념행사",
    "동문 장학증서 수여식 개최 안내",
  ];
  const notices = [
    { title: "[공지] 2026년도 회비 납부 안내", date: "05.20" },
    { title: "동문회관 건립기금 모금 현황", date: "05.15" },
    { title: "제33대 회장 취임 인사말", date: "01.27" },
    { title: "2025 인하가족의 밤 결과 보고", date: "12.05" },
    { title: "총동창회 정기 이사회 개최", date: "11.20" },
  ];
  return (
    <div className="py-10 bg-gray-50">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between border-b-2 pb-3 mb-4" style={{ borderColor: t.navy }}>
            <h3 className="text-[15px] font-bold text-gray-800">총동창회 소식</h3>
            <span className="text-xs text-gray-400 cursor-pointer">더보기 +</span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {news.map((title, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="h-32 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${t.navy}, ${t.blue})` }}>
                  <span className="text-white/15 text-3xl font-black">INHA</span>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-gray-700 leading-snug line-clamp-2">{title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded border border-gray-200 p-6">
          <div className="flex items-center justify-between border-b-2 pb-3 mb-1" style={{ borderColor: t.navy }}>
            <h3 className="text-[15px] font-bold text-gray-800">공지사항</h3>
            <span className="text-xs text-gray-400 cursor-pointer">더보기 +</span>
          </div>
          <ul className="divide-y divide-gray-100">
            {notices.map((n, i) => (
              <li key={i} className="flex items-center justify-between py-2.5 hover:bg-gray-50 px-2 -mx-2 rounded cursor-pointer">
                {i === 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded mr-2 font-medium text-white shrink-0"
                    style={{ background: t.navy }}>공지</span>
                )}
                <span className="text-sm text-gray-600 truncate flex-1">{n.title}</span>
                <span className="text-xs text-gray-400 shrink-0 ml-3">{n.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Donation                                                            */
/* ------------------------------------------------------------------ */

function PreviewDonation({ t }: { t: Theme }) {
  const funds = [
    { label: "회비발전기금", current: 68 },
    { label: "장학기금", current: 45 },
    { label: "동문회관 건립기금", current: 23 },
  ];
  return (
    <div className="py-12" style={{ background: t.navy }}>
      <div className="grid grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: t.gold }}>
            Donate &amp; Membership
          </p>
          <h2 className="text-white text-2xl font-bold mb-2">동문 여러분의 참여가<br />인하의 미래를 만듭니다</h2>
          <p className="text-white/60 text-sm mb-6">회비발전기금 · 장학기금 · 동문회관 건립기금</p>
          <div className="flex gap-3">
            <button className="px-6 py-3 rounded-full text-sm font-bold"
              style={{ background: t.gold, color: t.goldText }}>기부하기</button>
            <button className="px-6 py-3 border border-white/30 text-white text-sm font-semibold rounded-full">회비 납부</button>
          </div>
        </div>
        <div className="space-y-4">
          {funds.map((f) => (
            <div key={f.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white/80 text-sm">{f.label}</span>
                <span className="text-sm font-bold" style={{ color: t.gold }}>{f.current}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="h-full rounded-full" style={{ width: `${f.current}%`, background: t.gold }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card News Banner strip                                              */
/* ------------------------------------------------------------------ */

function CardNewsBannerStrip({ t }: { t: Theme }) {
  return (
    <div className="bg-white py-8 border-t border-gray-100">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-700">카드뉴스 / 배너 광고</h3>
        <span className="text-xs text-gray-400">* 광고 배너 영역 (실제 운영 시 입점 업체 배너로 교체)</span>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {CARD_NEWS.map((item, i) => (
          <div key={i}
            className="rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity aspect-[4/3] flex flex-col items-center justify-center text-center p-4 gap-2"
            style={{ background: item.color }}>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20"
              style={{ color: item.textColor ?? "#fff" }}>{item.tag}</span>
            <span className="text-xs font-semibold leading-tight"
              style={{ color: item.textColor ?? "#fff" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function PreviewFooter({ t }: { t: Theme }) {
  return (
    <footer className="py-10" style={{ background: t.dark }}>
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-3 gap-8 mb-8 text-gray-400 text-sm">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-lg"
                style={{ border: `2px solid ${t.gold}` }}>仁</div>
              <div>
                <div className="text-white font-bold text-sm">인하대학교 총동창회</div>
                <div className="text-xs" style={{ color: t.gold }}>INHA UNIVERSITY</div>
              </div>
            </div>
            <p className="text-sm font-medium" style={{ color: t.gold }}>친목공영 | 모교후원 | 후진육영</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">사무국</h4>
            <address className="not-italic text-sm space-y-1">
              <p>(22188) 인천광역시 미추홀구 독배로 311</p>
              <p>비젼프라자 901호</p>
              <p>TEL 032-887-2345 | FAX 032-887-2211</p>
              <p>inha@inhain.com</p>
            </address>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">회비 계좌</h4>
            <div className="text-sm space-y-1.5">
              <p>우리은행 256-454416-13-001</p>
              <p className="text-xs text-gray-500">(예금주: 인하대학교 총동창회)</p>
            </div>
          </div>
        </div>
        <div className="border-t pt-6 flex items-center justify-between text-xs text-gray-500"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <p>Copyright © 2026 인하대학교 총동창회. All Rights Reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer">개인정보처리방침</span>
            <span className="hover:text-white cursor-pointer">이용약관</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function PreviewPage() {
  const [activeTheme, setActiveTheme] = useState(0);
  const t = themes[activeTheme];

  return (
    <div className="min-h-screen font-[Pretendard,system-ui,sans-serif]">
      <ColorSwitcher active={activeTheme} onSelect={setActiveTheme} />

      <div className="bg-amber-50 border-b border-amber-200 py-2 px-4 text-center text-xs text-amber-700 font-medium">
        🎨 컬러 시안 미리보기 — 실제 사이트에 반영되지 않습니다. 우측 패널에서 테마를 선택하세요.
      </div>

      <PreviewGNB t={t} />
      <PreviewHero t={t} />

      {/* 히어로 아래부터: 사이드 배너 + 메인 콘텐츠 */}
      <WithSideBanners>
        <PreviewQuickMenu t={t} />
        <PreviewBizSection t={t} />
        <PreviewNewsSection t={t} />
        <PreviewDonation t={t} />
        <CardNewsBannerStrip t={t} />
      </WithSideBanners>

      <PreviewFooter t={t} />
    </div>
  );
}
