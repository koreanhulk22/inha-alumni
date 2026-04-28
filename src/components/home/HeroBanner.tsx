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
  notices: { id: string; title: string }[];
}

const bgGradients = [
  "from-[#003876] to-[#0066CC]",
  "from-[#1A1A2E] to-[#003876]",
  "from-[#003876] to-[#C8A951]",
];

const quickMenus = [
  { label: "인하상회", href: "/business/shop", icon: "🏪" },
  { label: "인하사랑카드", href: "/business/card", icon: "💳" },
  { label: "인하플레이스", href: "/business/place", icon: "📍" },
  { label: "동문 검색", href: "/network/search", icon: "🔍" },
  { label: "기부하기", href: "/donate", icon: "❤️" },
];

export function HeroBanner({ banners, notices }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [noticeIndex, setNoticeIndex] = useState(0);

  const slides = banners.length > 0 ? banners : [
    {
      id: "default-1",
      title: "인하대학교 총동창회",
      subtitle: "친목공영 | 모교후원 | 후진육영",
      image_url: "/images/hero-1.png",
      link_url: "/about/greeting",
      sort_order: 0,
    },
    {
      id: "default-2",
      title: "인하인의 자랑스러운 모교",
      subtitle: "개교 71주년, 함께 만들어가는 인하의 미래",
      image_url: "/images/hero-2.jpg",
      link_url: "/about/greeting",
      sort_order: 1,
    },
    {
      id: "default-3",
      title: "인하 용현벌 캠퍼스",
      subtitle: "동문 여러분의 모교를 소개합니다",
      image_url: "/images/hero-3.jpg",
      link_url: "/about/greeting",
      sort_order: 2,
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

  // 공지 롤링
  useEffect(() => {
    if (notices.length <= 1) return;
    const timer = setInterval(() => {
      setNoticeIndex((prev) => (prev + 1) % notices.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [notices.length]);

  return (
    <section
      className="relative h-screen min-h-[500px] max-h-[900px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 슬라이드 */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
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
              <div className="absolute inset-0 bg-[#003876]/40" />
            </>
          ) : (
            <div className={`absolute inset-0 bg-linear-to-r ${bgGradients[i % bgGradients.length]}`} />
          )}

          {/* 텍스트 */}
          <div className="relative z-10 h-full flex items-center pb-40 md:pb-48">
            <div className="max-w-7xl mx-auto px-5 w-full">
              <div className={`text-white max-w-2xl transition-all duration-700 ${i === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <p className="text-[#C8A951] text-xs sm:text-sm font-semibold mb-3 tracking-widest uppercase">
                  인하대학교 총동창회
                </p>
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-sm">
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <p className="text-white/85 text-base sm:text-xl mb-8">{slide.subtitle}</p>
                )}
                {slide.link_url && (
                  <Link
                    href={slide.link_url}
                    className="inline-block px-6 py-3 bg-white text-[#003876] font-semibold rounded-full hover:bg-[#E8F0FE] transition-colors text-sm shadow"
                  >
                    자세히 보기
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* 슬라이드 컨트롤 */}
      {slides.length > 1 && (
        <>
          <div className="absolute bottom-44 md:bottom-52 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? "bg-white w-6" : "bg-white/40 w-1.5"
                }`}
                aria-label={`슬라이드 ${i + 1}`}
              />
            ))}
          </div>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/35 rounded-full flex items-center justify-center text-white text-xl transition z-20" aria-label="이전">‹</button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/35 rounded-full flex items-center justify-center text-white text-xl transition z-20" aria-label="다음">›</button>
        </>
      )}

      {/* 하단 다크 퀵메뉴 바 */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-[#1A2A4A]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 md:grid-cols-5 divide-x divide-white/10">
            {/* 모바일: 퀵메뉴 3개 + 공지 */}
            {quickMenus.slice(0, 3).map((menu) => (
              <Link
                key={menu.href}
                href={menu.href}
                className="flex flex-col items-center gap-1.5 py-4 md:py-5 hover:bg-white/10 transition-colors md:hidden"
              >
                <span className="text-xl">{menu.icon}</span>
                <span className="text-white text-xs font-medium">{menu.label}</span>
              </Link>
            ))}

            {/* 데스크탑: 퀵메뉴 2개 */}
            {quickMenus.slice(0, 2).map((menu) => (
              <Link
                key={menu.href}
                href={menu.href}
                className="hidden md:flex flex-col items-center gap-1.5 py-5 hover:bg-white/10 transition-colors"
              >
                <span className="text-2xl">{menu.icon}</span>
                <span className="text-white text-xs font-medium">{menu.label}</span>
              </Link>
            ))}

            {/* 공지사항 인라인 (데스크탑) */}
            <div className="hidden md:flex flex-col justify-center px-5 py-4 col-span-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[#C8A951] text-xs font-semibold tracking-wide">공지사항</span>
                <Link href="/news/notice" className="text-white/40 text-xs hover:text-white/70 transition-colors">+ 더보기</Link>
              </div>
              <div className="overflow-hidden h-5">
                {notices.length > 0 ? (
                  <Link
                    href={`/news/${notices[noticeIndex]?.id}`}
                    className="block text-white/85 text-sm truncate hover:text-white transition-colors"
                  >
                    {notices[noticeIndex]?.title}
                  </Link>
                ) : (
                  <span className="text-white/40 text-sm">등록된 공지가 없습니다</span>
                )}
              </div>
            </div>

            {/* 데스크탑: 나머지 퀵메뉴 */}
            {quickMenus.slice(2).map((menu) => (
              <Link
                key={menu.href}
                href={menu.href}
                className="hidden md:flex flex-col items-center gap-1.5 py-5 hover:bg-white/10 transition-colors"
              >
                <span className="text-2xl">{menu.icon}</span>
                <span className="text-white text-xs font-medium">{menu.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
