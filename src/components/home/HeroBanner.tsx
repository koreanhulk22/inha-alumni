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

  const defaultSlides = [
    {
      id: "default-1",
      title: "인하대학교 총동창회",
      subtitle: "친목공영 | 모교후원 | 후진육영",
      image_url: "/images/hero-1.png",
      link_url: "/about/greeting",
      sort_order: -3,
    },
    {
      id: "default-2",
      title: "인하인의 자랑스러운 모교",
      subtitle: "개교 71주년, 함께 만들어가는 인하의 미래",
      image_url: "/images/hero-2.jpg",
      link_url: "/about/greeting",
      sort_order: -2,
    },
    {
      id: "default-3",
      title: "인하대학교 캠퍼스",
      subtitle: "동문 여러분의 자랑스러운 모교",
      image_url: "/images/hero-3.jpg",
      link_url: "/about/greeting",
      sort_order: -1,
    },
  ];

  const slides = [...defaultSlides, ...banners];

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
      className="relative h-[calc(100vh-64px)] overflow-hidden"
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
          {slide.image_url ? (
            <>
              <Image
                src={slide.image_url}
                alt={slide.title ?? ""}
                fill
                className="object-cover"
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-[#003876]/55" />
            </>
          ) : (
            <div className={`absolute inset-0 bg-linear-to-r ${bgGradients[i % bgGradients.length]}`} />
          )}

          <div className="relative z-10 max-w-7xl mx-auto px-5 h-full flex items-center">
            <div className="text-white max-w-2xl">
              <p className="text-[#C8A951] text-xs sm:text-sm font-medium mb-2 sm:mb-3 tracking-widest uppercase">
                인하대학교 총동창회
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="text-white/80 text-sm sm:text-lg mb-6 sm:mb-8">{slide.subtitle}</p>
              )}
              {slide.link_url && (
                <Link
                  href={slide.link_url}
                  className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-[#003876] font-semibold rounded-full hover:bg-[#E8F0FE] transition-colors text-sm"
                >
                  자세히 보기
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 sm:h-2 rounded-full transition-all ${
                  i === current ? "bg-white w-5 sm:w-6" : "bg-white/50 w-1.5 sm:w-2"
                }`}
                aria-label={`슬라이드 ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={prev}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/35 rounded-full flex items-center justify-center text-white text-lg sm:text-xl transition-colors z-10"
            aria-label="이전"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/35 rounded-full flex items-center justify-center text-white text-lg sm:text-xl transition-colors z-10"
            aria-label="다음"
          >
            ›
          </button>

          <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-10 text-white/60 text-xs tabular-nums">
            {current + 1} / {slides.length}
          </div>
        </>
      )}
    </section>
  );
}
