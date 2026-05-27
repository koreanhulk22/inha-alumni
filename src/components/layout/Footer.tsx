import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#1A1A2E] text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-[54px] h-[54px] rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden">
              <Image
                src="/images/inha-emblem.png"
                alt="인하대학교 총동창회"
                width={50}
                height={50}
              />
            </div>
              <div>
                <div className="text-white font-bold text-sm">인하대학교 총동창회</div>
                <div className="text-[#C8A951] text-xs">INHA UNIVERSITY</div>
              </div>
            </div>
            <p className="text-sm text-[#C8A951] font-medium">친목공영 | 모교후원 | 후진육영</p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">사무국</h4>
            <address className="not-italic text-sm space-y-1.5">
              <p>(22188) 인천광역시 미추홀구 독배로 311</p>
              <p>비젼프라자 901호</p>
              <p>TEL 032-887-2345 | FAX 032-887-2211</p>
              <p>
                <a href="mailto:inha@inhain.com" className="hover:text-white transition-colors">
                  inha@inhain.com
                </a>
              </p>
            </address>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">회비 계좌</h4>
            <div className="text-sm space-y-1.5">
              <p>우리은행 256-454416-13-001</p>
              <p className="text-xs text-gray-500">(예금주: 인하대학교 총동창회)</p>
              <p className="mt-3">하나은행 748-910003-42904</p>
              <p className="text-xs text-gray-500">(협찬금 계좌)</p>
            </div>
          </div>
        </div>

        {/* 관련기관 링크 */}
        <div className="border-t border-gray-700 pt-6 mb-6">
          <p className="text-xs text-gray-500 mb-3">관련기관 바로가기</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            {[
              { label: "인하대학교", href: "https://www.inha.ac.kr" },
              { label: "인하대학교병원", href: "https://www.inhauh.com" },
              { label: "학생진로설계포털", href: "https://career.inha.ac.kr" },
              { label: "졸업증명서 발급", href: "https://www.inha.ac.kr/kr/1083/subview.do" },
              { label: "동문장학회", href: "https://inhaasf.com" },
              { label: "인하상회", href: "https://inhamart.com" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            Copyright © 2026 인하대학교 총동창회. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-xs">
            {/* 카카오 채널 */}
            <a
              href="https://pf.kakao.com"
              className="flex items-center gap-1.5 text-gray-400 hover:text-yellow-400 transition-colors"
              aria-label="카카오 채널"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3C6.477 3 2 6.477 2 10.923c0 2.868 1.616 5.389 4.057 6.913-.164.595-.59 2.154-.677 2.49-.107.416.152.41.32.299.132-.087 2.1-1.43 2.95-2.01.432.06.874.09 1.35.09 5.523 0 10-3.477 10-7.782C22 6.477 17.523 3 12 3z"/>
              </svg>
              <span>카카오 채널</span>
            </a>
            <Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link>
            <Link href="/terms" className="hover:text-white transition-colors">이용약관</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
