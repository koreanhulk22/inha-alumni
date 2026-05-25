"use client";

import { useState, useEffect } from "react";

export interface SliderBanner {
  id: string;
  title: string | null;
  image_url: string | null;
  link_url: string | null;
}

const DEMO_BANNERS: SliderBanner[] = [
  { id: "demo-1", title: "인하사랑카드\n동문 전용 혜택", image_url: null, link_url: "/business/card" },
  { id: "demo-2", title: "인하플레이스\n동문 업소 찾기", image_url: null, link_url: "/business/place" },
  { id: "demo-3", title: "인하사랑콘서트\n문화 공연 티켓", image_url: null, link_url: "/business/concert" },
];

const DEMO_COLORS = ["from-[#003876] to-[#0055aa]", "from-[#0066CC] to-[#004999]", "from-[#1A1A2E] to-[#003876]"];

interface Props {
  banners: SliderBanner[];
}

export function ContentSlider({ banners }: Props) {
  const items = banners.length > 0 ? banners : DEMO_BANNERS;
  const isDemo = banners.length === 0;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [items.length]);

  const banner = items[current];

  const inner = banner.image_url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={banner.image_url} alt={banner.title ?? ""} className="w-full h-full object-cover" />
  ) : (
    <div className={`w-full h-full bg-linear-to-b ${DEMO_COLORS[current % DEMO_COLORS.length]} flex flex-col items-center justify-center gap-2 p-3`}>
      {isDemo && (
        <span className="text-[9px] text-white/50 uppercase tracking-widest border border-white/20 px-2 py-0.5 rounded-full">광고 영역</span>
      )}
      <p className="text-white text-xs font-bold text-center leading-snug whitespace-pre-line">
        {banner.title}
      </p>
    </div>
  );

  const content = (
    <div className="w-full h-full relative">
      {inner}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-2">
      {isDemo && (
        <p className="text-[10px] text-gray-400 font-medium w-full text-center mb-0.5">
          우측 슬라이드 배너 <span className="text-orange-400">(미리보기)</span>
        </p>
      )}

      <div className="w-[150px] h-[200px] rounded-xl overflow-hidden shadow-md border border-gray-200">
        {banner.link_url ? (
          <a href={banner.link_url} className="block w-full h-full">
            {content}
          </a>
        ) : (
          content
        )}
      </div>

      {items.length > 1 && (
        <div className="flex gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${i === current ? "w-4 h-1.5 bg-[#003876]" : "w-1.5 h-1.5 bg-gray-300"}`}
            />
          ))}
        </div>
      )}

      {isDemo && (
        <p className="text-[9px] text-gray-300 text-center leading-tight">
          어드민에서 등록 시<br />실제 배너로 교체됩니다
        </p>
      )}
    </div>
  );
}
