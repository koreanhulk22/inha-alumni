"use client";

import { useState, useEffect } from "react";

export interface AdBanner {
  id: string;
  zone: string;
  title: string | null;
  image_url: string | null;
  link_url: string | null;
  sort_order: number;
}

interface Props {
  leftBanners: AdBanner[];
  rightBanners: AdBanner[];
}

const DEMO_LEFT: AdBanner[] = [
  { id: "dl-1", zone: "side_left", title: "인하사랑카드\n동문 전용 혜택", image_url: null, link_url: "/business/card", sort_order: 0 },
  { id: "dl-2", zone: "side_left", title: "인하플레이스\n동문 업소 찾기", image_url: null, link_url: "/business/place", sort_order: 1 },
  { id: "dl-3", zone: "side_left", title: "동문장학회\n장학금 안내", image_url: null, link_url: "http://inhaasf.com/document/main/", sort_order: 2 },
];

const DEMO_RIGHT: AdBanner[] = [
  { id: "dr-1", zone: "side_right", title: "인하사랑콘서트\n공연 티켓 안내", image_url: null, link_url: "/business/concert", sort_order: 0 },
  { id: "dr-2", zone: "side_right", title: "기부하기\n모교 후원", image_url: null, link_url: "/donate", sort_order: 1 },
  { id: "dr-3", zone: "side_right", title: "인하상회\n동문 전용 쇼핑", image_url: null, link_url: "/business/shop", sort_order: 2 },
];

const DEMO_COLORS_L = ["#003876", "#0066CC", "#065f46"];
const DEMO_COLORS_R = ["#1A1A2E", "#6D1331", "#003876"];

function BannerItem({ banner, demoColor }: { banner: AdBanner; demoColor?: string }) {
  const isDemo = banner.id.startsWith("d");

  const inner = banner.image_url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={banner.image_url} alt={banner.title ?? ""} className="w-full block rounded-lg" />
  ) : (
    <div
      className="w-[100px] h-[80px] rounded-lg flex flex-col items-center justify-center gap-1 px-2"
      style={{ background: demoColor ?? "#003876" }}
    >
      {isDemo && (
        <span className="text-[8px] text-white/50 border border-white/20 px-1.5 rounded-full leading-tight">광고 영역</span>
      )}
      <p className="text-white text-[10px] font-bold text-center leading-tight whitespace-pre-line">
        {banner.title}
      </p>
    </div>
  );

  if (banner.link_url) {
    return (
      <a href={banner.link_url} target={banner.link_url.startsWith("http") ? "_blank" : "_self"} rel="noopener noreferrer" className="block w-[100px]">
        {inner}
      </a>
    );
  }
  return <div className="w-[100px]">{inner}</div>;
}

export function SideBanners({ leftBanners, rightBanners }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.85);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const leftItems = leftBanners.length > 0 ? leftBanners : DEMO_LEFT;
  const rightItems = rightBanners.length > 0 ? rightBanners : DEMO_RIGHT;
  const isLeftDemo = leftBanners.length === 0;
  const isRightDemo = rightBanners.length === 0;

  return (
    <>
      {/* 좌측 */}
      <div
        className={`fixed top-52 z-50 flex flex-col gap-2 transition-all duration-500 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"}`}
        style={{ left: "max(12px, calc(50% - 680px))" }}
      >
        {isLeftDemo && (
          <p className="text-[9px] text-gray-400 text-center w-[100px]">좌측 배너<br />(미리보기)</p>
        )}
        {leftItems.map((b, i) => (
          <BannerItem key={b.id} banner={b} demoColor={isLeftDemo ? DEMO_COLORS_L[i % DEMO_COLORS_L.length] : undefined} />
        ))}
      </div>

      {/* 우측 */}
      <div
        className={`fixed top-52 z-50 flex flex-col gap-2 transition-all duration-500 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"}`}
        style={{ right: "max(12px, calc(50% - 680px))" }}
      >
        {isRightDemo && (
          <p className="text-[9px] text-gray-400 text-center w-[100px]">우측 배너<br />(미리보기)</p>
        )}
        {rightItems.map((b, i) => (
          <BannerItem key={b.id} banner={b} demoColor={isRightDemo ? DEMO_COLORS_R[i % DEMO_COLORS_R.length] : undefined} />
        ))}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-[100px] py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 text-[11px] rounded-lg transition-colors"
        >
          ▲ 맨위로
        </button>
      </div>
    </>
  );
}
