"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface AdSlide {
  id: string;
  title: string;
  label: string | null;
  image_url: string | null;
  link_url: string | null;
}

interface Props {
  slides: AdSlide[];
}

const FALLBACK_GRADS = [
  "from-[#003876] to-[#0066CC]",
  "from-[#1A1A2E] to-[#003876]",
  "from-[#0277BD] to-[#003876]",
  "from-[#1A6B4A] to-[#003876]",
];

export function AdSlider({ slides }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = Math.max(slides.length, 1);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = () => setCurrent((prev) => (prev - 1 + total) % total);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [paused, next, slides.length]);

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-[#003876]/20 min-h-[320px] h-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.length === 0 ? (
        <div className="absolute inset-0 bg-gradient-to-br from-[#003876] to-[#0066CC] flex flex-col items-center justify-center gap-2">
          <p className="text-white/80 text-sm font-semibold">슬라이드 광고</p>
          <p className="text-white/40 text-xs">어드민 &gt; 슬라이드 광고에서 등록</p>
        </div>
      ) : (
        slides.map((slide, i) => (
          <a
            key={slide.id}
            href={slide.link_url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`absolute inset-0 transition-opacity duration-500 ${
              i === current ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {slide.image_url ? (
              <Image src={slide.image_url} alt={slide.title} fill className="object-cover" />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${FALLBACK_GRADS[i % FALLBACK_GRADS.length]} flex flex-col items-center justify-center gap-3 px-6`}>
                <p className="text-white font-bold text-base text-center leading-snug">{slide.title}</p>
                {slide.label && (
                  <p className="text-white/60 text-xs text-center">{slide.label}</p>
                )}
              </div>
            )}
            {slide.label && slide.image_url && (
              <span className="absolute top-2 right-2 text-[10px] bg-[#003876] text-white px-2 py-0.5 rounded font-medium z-10">
                {slide.label}
              </span>
            )}
          </a>
        ))
      )}

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center z-10 text-lg leading-none"
            aria-label="이전"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center z-10 text-lg leading-none"
            aria-label="다음"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? "bg-white w-4" : "bg-white/50 w-1.5"
                }`}
                aria-label={`슬라이드 ${i + 1}`}
              />
            ))}
          </div>
          <div className="absolute bottom-2 right-3 text-white/60 text-xs tabular-nums z-10">
            {current + 1} / {slides.length}
          </div>
        </>
      )}
    </div>
  );
}
