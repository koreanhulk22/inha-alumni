import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "장학회 소개", href: "/scholarship/about" },
  { label: "기금 현황", href: "/scholarship/fund" },
  { label: "기부내역", href: "/scholarship/donors" },
  { label: "공지사항", href: "/scholarship/notice" },
];

const designatedFunds = [
  "우남이승만박사장학금", "김창만장학금", "ROTC동문회장학금",
  "전기공학과동문회장학금", "기계공학과동문회장학금", "화학공학과동문회장학금",
  "컴퓨터정보공학과동문회장학금", "수학과동문회장학금", "물리학과동문회장학금",
  "화학과동문회장학금", "생명과학과동문회장학금", "경제학과동문회장학금",
  "경영학과동문회장학금", "법학과동문회장학금", "사회과학부동문회장학금",
];

const groupFunds = [
  "본회 신입장학금", "총동창회 재학생장학금", "성적우수장학금",
  "사회봉사장학금", "가계곤란장학금",
];

export default function ScholarshipAboutPage() {
  return (
    <SubPageLayout
      breadcrumbs={[{ label: "동문장학회", href: "/scholarship" }, { label: "장학회 소개" }]}
      sideMenus={sideMenus}
      currentPath="/scholarship/about"
    >
      <div className="space-y-6">
        {/* 소개 */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-[#003876] mb-8 pb-4 border-b-2 border-[#003876]">
            장학회 소개
          </h1>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4 text-sm text-gray-700 leading-relaxed">
              <p>
                <strong className="text-[#003876]">(재)인하대동문장학회</strong>는 인하대학교 총동창회가 설립한 장학재단으로, 경제적 어려움에도 불구하고 학업에 정진하는 인하대학교 재학생들에게 장학금을 지원합니다.
              </p>
              <p>
                장학회는 동문 및 각계 인사들의 기부와 헌신을 바탕으로 운영되며, 매 학기 장학증서 수여식을 통해 장학생들을 격려하고 있습니다.
              </p>
              <p>
                지정위탁장학금 <strong>27여 곳</strong>, 단체·개인장학기금 <strong>44여 곳</strong>을 운영하며, 매년 수백 명의 인하 후배들에게 꿈을 향한 발판을 마련해주고 있습니다.
              </p>
            </div>

            <div className="shrink-0 md:w-56">
              <div className="bg-[#003876] rounded-xl p-5 text-white text-center">
                <p className="text-xs opacity-80 mb-3">장학회 현황</p>
                <div className="space-y-3">
                  <div>
                    <div className="text-3xl font-bold">27<span className="text-lg">여 곳</span></div>
                    <div className="text-xs opacity-80 mt-0.5">지정위탁장학금</div>
                  </div>
                  <div className="border-t border-white/20 pt-3">
                    <div className="text-3xl font-bold">44<span className="text-lg">여 곳</span></div>
                    <div className="text-xs opacity-80 mt-0.5">단체·개인장학기금</div>
                  </div>
                  <div className="border-t border-white/20 pt-3">
                    <div className="text-sm font-semibold">연 2회</div>
                    <div className="text-xs opacity-80 mt-0.5">장학증서 수여식</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 포상 제도 */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-[#003876] mb-5">포상 제도</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: "자랑스러운 인하인상", desc: "최고 영예상" },
              { name: "인하비룡대상", desc: "5개 부문 시상" },
              { name: "공로상", desc: "총동창회 발전 기여" },
              { name: "표창", desc: "공로자 표창" },
              { name: "감사패", desc: "후원자 감사" },
              { name: "인하참스승상", desc: "교수 대상" },
            ].map((award) => (
              <div key={award.name} className="bg-[#E8F0FE] rounded-lg p-4">
                <div className="text-sm font-semibold text-[#003876]">{award.name}</div>
                <div className="text-xs text-gray-500 mt-1">{award.desc}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">※ 매년 12월 '인하 가족의 밤' 시상</p>
        </div>

        {/* 장학금 목록 */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-[#003876] mb-5">지정위탁장학금 (27여 곳)</h2>
          <div className="flex flex-wrap gap-2">
            {designatedFunds.map((fund) => (
              <span key={fund} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-full">
                {fund}
              </span>
            ))}
            <span className="px-3 py-1.5 bg-gray-100 text-gray-400 text-sm rounded-full">외 다수</span>
          </div>

          <h2 className="text-lg font-bold text-[#003876] mb-4 mt-8">단체·개인 장학기금 (44여 곳)</h2>
          <div className="flex flex-wrap gap-2">
            {groupFunds.map((fund) => (
              <span key={fund} className="px-3 py-1.5 bg-[#E8F0FE] text-[#003876] text-sm rounded-full">
                {fund}
              </span>
            ))}
            <span className="px-3 py-1.5 bg-[#E8F0FE] text-[#003876]/50 text-sm rounded-full">외 다수</span>
          </div>
        </div>

        {/* 장학회 연락처 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-[#003876] mb-4">장학회 안내</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2 text-gray-700">
              <p><span className="text-gray-500 w-20 inline-block">명칭</span>(재)인하대동문장학회</p>
              <p><span className="text-gray-500 w-20 inline-block">홈페이지</span>inhaasf.com</p>
            </div>
            <div className="space-y-2 text-gray-700">
              <p><span className="text-gray-500 w-20 inline-block">수여식</span>연 2회 (1학기, 2학기)</p>
              <p><span className="text-gray-500 w-20 inline-block">문의</span>032-887-2345</p>
            </div>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}
