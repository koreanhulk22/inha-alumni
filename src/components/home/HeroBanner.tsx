"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string | null;
  link_url: string | null;
  sort_order: number;
}

interface Props {
  banners: Banner[];
}

const bgGradients = [
  "from-[#003876] to-[#0066CC]",
  "from-[#1A1A2E] to-[#003876]",
  "from-[#003876] to-[#C8A951]",
];

export function HeroBanner({ banners }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides = banners.length > 0 ? banners : [
    {
      id: "default",
      title: "인하대학교 총동창회",
      subtitle: "친목공영 | 모교후원 | 후진육영",
      image_url: null,
      link_url: "/about/greeting",
      sort_order: 0,
    },
  ];

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next, slides.length]);

  return (
    <section
      className="relative h-100 md:h-125 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* 배경: 이미지 or 그라디언트 */}
          {slide.image_url ? (
            <>
              <Image
                src={slide.image_url}
                alt={slide.title ?? ""}
                fill
                className="object-cover"
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-[#003876]/60" />
            </>
          ) : (
            <div className={`absolute inset-0 bg-linear-to-r ${bgGradients[i % bgGradients.length]}`} />
          )}

          {/* 콘텐츠 */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="text-white max-w-2xl">
              <p className="text-[#C8A951] text-sm font-medium mb-3 tracking-widest uppercase">
                인하대학교 총동창회
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="text-white/80 text-lg mb-8">{slide.subtitle}</p>
              )}
              {slide.link_url && (
                <Link
                  href={slide.link_url}
                  className="inline-block px-6 py-3 bg-white text-[#003876] font-semibold rounded-full hover:bg-[#E8F0FE] transition-colors text-sm"
                >
                  자세히 보기
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* 컨트롤 */}
      {slides.length > 1 && (
        <>
          {/* 인디케이터 */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? "bg-white w-6" : "bg-white/50 w-2"
                }`}
                aria-label={`슬라이드 ${i + 1}`}
              />
            ))}
          </div>

          {/* 좌우 화살표 */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/35 rounded-full flex items-center justify-center text-white text-xl transition-colors z-10"
            aria-label="이전"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/35 rounded-full flex items-center justify-center text-white text-xl transition-colors z-10"
            aria-label="다음"
          >
            ›
          </button>

          {/* 슬라이드 번호 */}
          <div className="absolute bottom-6 right-6 z-10 text-white/60 text-xs tabular-nums">
            {current + 1} / {slides.length}
          </div>
        </>
      )}
    </section>
  );
}
