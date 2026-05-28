export default function FontPreviewPage() {
  const fonts = [
    {
      id: "pretendard",
      name: "Pretendard",
      desc: "현재 사용 중 · 모던하고 깔끔한 산세리프 · 가독성 최상",
      googleUrl: null,
      cssFamily: "var(--font-pretendard), sans-serif",
      tag: "현재",
    },
    {
      id: "noto",
      name: "Noto Sans KR",
      desc: "Google 공식 한국어 폰트 · 가장 안정적 · 어느 기기에서도 동일하게 표시",
      googleUrl: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap",
      cssFamily: "'Noto Sans KR', sans-serif",
      tag: "추천",
    },
    {
      id: "ibm",
      name: "IBM Plex Sans KR",
      desc: "IBM 공개 · 전문적이고 기업적인 인상 · 기관 사이트에 잘 어울림",
      googleUrl: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;700&display=swap",
      cssFamily: "'IBM Plex Sans KR', sans-serif",
      tag: "기업적",
    },
    {
      id: "nanum-gothic",
      name: "나눔고딕",
      desc: "네이버 공개 · 친근하고 보편적 · 중장년층 가독성 우수",
      googleUrl: "https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap",
      cssFamily: "'Nanum Gothic', sans-serif",
      tag: "친근",
    },
    {
      id: "nanum-myeongjo",
      name: "나눔명조",
      desc: "네이버 공개 · 격조 있는 명조체 · 전통적이고 권위 있는 느낌",
      googleUrl: "https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap",
      cssFamily: "'Nanum Myeongjo', serif",
      tag: "격조",
    },
  ];

  const googleFontUrls = fonts
    .filter((f) => f.googleUrl)
    .map((f) => f.googleUrl as string);

  return (
    <>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {googleFontUrls.map((url) => (
          <link key={url} rel="stylesheet" href={url} />
        ))}
      </head>

      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">폰트 시안 비교</h1>
            <p className="text-sm text-gray-500">인하대학교 총동창회 · 저작권 무료 폰트 5종</p>
          </div>

          <div className="space-y-6">
            {fonts.map((font) => (
              <div
                key={font.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200"
                style={{ fontFamily: font.cssFamily }}
              >
                {/* 폰트 정보 바 */}
                <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 border-b border-gray-200">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    font.tag === "현재" ? "bg-gray-200 text-gray-700" :
                    font.tag === "추천" ? "bg-[#003876] text-white" :
                    "bg-[#E8F0FE] text-[#003876]"
                  }`}>
                    {font.tag}
                  </span>
                  <span className="font-bold text-gray-800">{font.name}</span>
                  <span className="text-xs text-gray-400">{font.desc}</span>
                </div>

                {/* GNB 미리보기 */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-white">
                  <div className="w-10 h-10 rounded-full bg-[#003876]/10 flex items-center justify-center shrink-0">
                    <span className="text-[#003876] font-black text-sm">인</span>
                  </div>
                  <div>
                    <div className="text-[#003876] font-bold text-xl leading-tight">인하대학교 총동창회</div>
                    <div className="text-[#003876] text-xs tracking-wide">Inha University Alumni Association</div>
                  </div>
                  <div className="ml-auto flex gap-6 text-sm font-medium text-gray-700">
                    {["총동창회", "총동창회 소식", "동문 커뮤니티", "회비/기부"].map((m) => (
                      <span key={m}>{m}</span>
                    ))}
                  </div>
                </div>

                {/* 히어로 텍스트 미리보기 */}
                <div className="px-6 py-6 bg-[#003876]">
                  <p className="text-[#C8A951] text-xs font-medium mb-2 tracking-widest uppercase">인하대학교 총동창회</p>
                  <h2 className="text-white text-3xl font-bold leading-tight mb-2">
                    인하 영광 구현을 위해<br />함께 나아갑니다
                  </h2>
                  <p className="text-white/70 text-sm">친목공영 | 모교후원 | 후진육영</p>
                </div>

                {/* 본문 텍스트 미리보기 */}
                <div className="px-6 py-5 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">뉴스 제목</p>
                    <p className="text-base font-bold text-gray-900 leading-snug mb-1">제33대 김종우 총동창회장 취임식 성료</p>
                    <p className="text-sm text-gray-500 leading-relaxed">1954년 민족대학으로 출범한 인하대학교가 개교 71주년을 맞이하여 새로운 도약을 준비하고 있습니다.</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">버튼 / 라벨</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-2 bg-[#003876] text-white text-sm font-semibold rounded-full">기부하기</span>
                      <span className="px-4 py-2 border border-[#003876] text-[#003876] text-sm font-medium rounded-full">회원가입</span>
                      <span className="px-3 py-1 bg-[#E8F0FE] text-[#003876] text-xs font-medium rounded">총동창회소식</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">가나다라마바사 · ABCDEFG · 1234567890</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">모든 폰트는 SIL OFL / Apache 2.0 등 상업적 이용 가능 라이선스입니다.</p>
        </div>
      </div>
    </>
  );
}
