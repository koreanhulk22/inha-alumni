"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const menus = [
  {
    label: "총동창회",
    href: "/about",
    children: [
      { label: "회장 인사말", href: "/about/greeting" },
      { label: "회칙", href: "/about/rules" },
      { label: "조직도", href: "/about/organization" },
      { label: "연혁", href: "/about/history" },
      { label: "오시는 길", href: "/about/location" },
    ],
  },
  {
    label: "총동창회 소식",
    href: "/news",
    children: [
      { label: "공지사항", href: "/news/notice" },
      { label: "주요행사", href: "/news/events" },
      { label: "동창회보", href: "/news/newsletter" },
      { label: "동문보도", href: "/news/press" },
      { label: "포토 갤러리", href: "/news/gallery" },
    ],
  },
  {
    label: "총동창회 사업",
    href: "/business",
    children: [
      { label: "인하상회", href: "/business/shop" },
      { label: "인하사랑카드", href: "/business/card" },
      { label: "인하플레이스", href: "/business/place" },
      { label: "인하사랑콘서트", href: "/business/concert" },
      { label: "창업지원", href: "/business/startup" },
    ],
  },
  {
    label: "동문 커뮤니티",
    href: "/community",
    children: [
      { label: "단위동문회 소식", href: "/community/local-news" },
      { label: "자유게시판", href: "/community/board" },
      { label: "경조사 알림", href: "/community/condolence" },
      { label: "구인구직", href: "/community/jobs" },
    ],
  },
  {
    label: "동문 네트워크",
    href: "/network",
    children: [
      { label: "동문 검색", href: "/network/search" },
      { label: "동문회 안내", href: "/network/guide" },
      { label: "동문기업탐방", href: "/network/companies" },
      { label: "업종별 현황", href: "/network/industry" },
    ],
  },
  {
    label: "동문장학회",
    href: "https://inhaasf.com",
    external: true,
    children: [
      { label: "장학회 소개", href: "https://inhaasf.com" },
      { label: "기금 현황", href: "https://inhaasf.com" },
      { label: "기부내역", href: "https://inhaasf.com" },
      { label: "공지사항", href: "https://inhaasf.com" },
    ],
  },
  {
    label: "모교소식",
    href: "/university",
    children: [
      { label: "대학 주요 소식", href: "/university/news" },
      { label: "학사 안내", href: "/university/academic" },
    ],
  },
  {
    label: "회비/기부",
    href: "/donate",
    children: [
      { label: "회비발전기금", href: "/donate" },
      { label: "장학기금", href: "/donate" },
      { label: "동문회관 건립기금", href: "/donate" },
    ],
  },
];

export function GNB() {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === "/";

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/news/notice?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // 홈: 투명→스크롤시 white / 서브페이지: 항상 white
  const transparent = isHome && !scrolled && !mobileOpen;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      transparent
        ? "bg-transparent border-transparent shadow-none"
        : "bg-white border-b border-gray-200 shadow-sm"
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-3 mr-8 shrink-0">
            <Image
              src={transparent ? "/images/inha-emblem-white.png" : "/images/inha-emblem.png"}
              alt="인하대학교 엠블럼"
              width={40}
              height={40}
              priority
            />
            <div className="hidden sm:block">
              <div className={`font-bold text-sm leading-tight whitespace-nowrap transition-colors ${transparent ? "text-white" : "text-[#003876]"}`}>
                인하대학교 총동창회
              </div>
              <div className={`text-[10px] leading-tight tracking-wide whitespace-nowrap transition-colors ${transparent ? "text-white/70" : "text-[#003876]"}`}>
                Inha University Alumni Association
              </div>
            </div>
          </Link>

          {/* 데스크탑 메뉴 */}
          <nav className="hidden lg:flex items-center flex-1">
            {menus.map((menu, i) => (
              <div
                key={menu.href}
                className="relative"
                onMouseEnter={() => setActiveMenu(i)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                {"external" in menu && menu.external ? (
                  <a href={menu.href} className={`px-3 py-5 text-sm font-medium whitespace-nowrap block transition-colors ${transparent ? "text-white/90 hover:text-white" : "text-gray-700 hover:text-[#003876]"}`}>
                    {menu.label}
                  </a>
                ) : (
                  <Link href={menu.href} className={`px-3 py-5 text-sm font-medium whitespace-nowrap block transition-colors ${transparent ? "text-white/90 hover:text-white" : "text-gray-700 hover:text-[#003876]"}`}>
                    {menu.label}
                  </Link>
                )}

                {activeMenu === i && (
                  <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-b-lg shadow-lg min-w-36 py-2 z-50">
                    {menu.children.map((child) => (
                      "external" in menu && menu.external ? (
                        <a key={child.href} href={child.href} className="block px-4 py-2 text-sm text-gray-600 hover:bg-[#E8F0FE] hover:text-[#003876]">
                          {child.label}
                        </a>
                      ) : (
                        <Link key={child.href} href={child.href} className="block px-4 py-2 text-sm text-gray-600 hover:bg-[#E8F0FE] hover:text-[#003876]">
                          {child.label}
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {/* 검색 */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-1">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="검색어를 입력하세요"
                  className="w-44 px-3 py-1.5 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-[#003876] bg-white"
                />
                <button type="submit" className="p-1.5 text-[#003876]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className={`hidden sm:flex p-2 transition-colors ${transparent ? "text-white/80 hover:text-white" : "text-gray-500 hover:text-[#003876]"}`}
                aria-label="검색"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>
            )}

            {user ? (
              <>
                <Link href="/mypage" className={`hidden sm:block px-4 py-1.5 text-sm rounded-full border transition-colors ${transparent ? "border-white/60 text-white hover:bg-white/20" : "border-[#003876] text-[#003876] hover:bg-[#003876] hover:text-white"}`}>
                  마이페이지
                </Link>
                <button onClick={handleLogout} className={`hidden sm:block px-4 py-1.5 text-sm rounded-full transition-colors ${transparent ? "bg-white/20 text-white hover:bg-white/30" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className={`hidden sm:block px-4 py-1.5 text-sm rounded-full border transition-colors ${transparent ? "border-white/60 text-white hover:bg-white/20" : "border-[#003876] text-[#003876] hover:bg-[#003876] hover:text-white"}`}>
                  로그인
                </Link>
                <Link href="/auth/signup" className={`hidden sm:block px-4 py-1.5 text-sm rounded-full transition-colors ${transparent ? "bg-white text-[#003876] hover:bg-white/90" : "bg-[#003876] text-white hover:bg-[#002a5c]"}`}>
                  회원가입
                </Link>
              </>
            )}

            {/* 모바일 햄버거 */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="메뉴"
            >
              <div className={`w-5 h-0.5 mb-1 transition-colors ${transparent ? "bg-white" : "bg-gray-700"}`} />
              <div className={`w-5 h-0.5 mb-1 transition-colors ${transparent ? "bg-white" : "bg-gray-700"}`} />
              <div className={`w-5 h-0.5 transition-colors ${transparent ? "bg-white" : "bg-gray-700"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          {menus.map((menu) => (
            <div key={menu.href}>
              <div className="px-4 py-2 text-sm font-semibold text-[#003876] bg-gray-50">
                {menu.label}
              </div>
              {menu.children.map((child) => (
                "external" in menu && menu.external ? (
                  <a
                    key={child.href}
                    href={child.href}
                    className="block px-6 py-2 text-sm text-gray-600 border-b border-gray-100"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </a>
                ) : (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block px-6 py-2 text-sm text-gray-600 border-b border-gray-100"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                )
              ))}
            </div>
          ))}
          <div className="p-4 flex gap-2">
            {user ? (
              <>
                <Link href="/mypage" className="flex-1 text-center py-2 text-sm border border-[#003876] text-[#003876] rounded-full" onClick={() => setMobileOpen(false)}>마이페이지</Link>
                <button onClick={handleLogout} className="flex-1 text-center py-2 text-sm bg-gray-100 text-gray-600 rounded-full">로그아웃</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="flex-1 text-center py-2 text-sm border border-[#003876] text-[#003876] rounded-full" onClick={() => setMobileOpen(false)}>로그인</Link>
                <Link href="/auth/signup" className="flex-1 text-center py-2 text-sm bg-[#003876] text-white rounded-full" onClick={() => setMobileOpen(false)}>회원가입</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
