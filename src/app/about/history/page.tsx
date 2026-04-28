import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "회장 인사말", href: "/about/greeting" },
  { label: "회칙", href: "/about/rules" },
  { label: "조직도", href: "/about/organization" },
  { label: "연혁", href: "/about/history" },
  { label: "오시는 길", href: "/about/location" },
];

const history = [
  {
    year: "2026",
    events: [
      { month: "01", text: "제33대 김종우 총동창회장 취임 (인천 라마다송도호텔, 2026.01.27)" },
    ],
  },
  {
    year: "2025",
    events: [
      { month: "12", text: "2025 인하 가족의 밤 개최 (인천 송도컨벤시아)" },
      { month: "11", text: "총동창회 창립 66주년 기념식" },
      { month: "08", text: "김종우 동문 수석부회장 선임" },
      { month: "05", text: "비룡제 격려 방문" },
      { month: "05", text: "2025 총동창회장배 골프대회 (경기도 덕평 H1클럽, 40팀 160명)" },
      { month: "04", text: "명예회장단 월례회 — 동문장학회관 건립 추진 논의" },
    ],
  },
  {
    year: "2024",
    events: [
      { month: "12", text: "2024 인하 가족의 밤 개최 (인천 송도컨벤시아)" },
      { month: "05", text: "2024 총동창회장배 골프대회" },
      { month: "04", text: "인하대 개교 70주년 기념행사" },
    ],
  },
  {
    year: "2024",
    events: [
      { month: "01", text: "제32대 김두한 총동창회장 취임 (영어영문학과 82학번)" },
    ],
  },
  {
    year: "2022",
    events: [
      { month: "01", text: "제31대 신한용 총동창회장 취임 (상업교육과 81학번)" },
    ],
  },
  {
    year: "2020",
    events: [
      { month: "01", text: "제30대 이용기 총동창회장 취임 (금속공학과 73학번)" },
    ],
  },
  {
    year: "2018",
    events: [
      { month: "01", text: "제29대 한진우 총동창회장 취임 (건축공학과 78학번)" },
    ],
  },
  {
    year: "2016",
    events: [
      { month: "01", text: "제28대 강일형 총동창회장 취임 (토목공학과 73학번)" },
    ],
  },
  {
    year: "2014",
    events: [
      { month: "01", text: "제27대 장석철 총동창회장 취임 (금속공학과 71학번)" },
    ],
  },
  {
    year: "2010",
    events: [
      { month: "11", text: "총동창회 창립 51주년 기념" },
      { month: "03", text: "인하대학교 총동창회 홈페이지(inhain.com) 개편" },
    ],
  },
  {
    year: "2004",
    events: [
      { month: "04", text: "인하대학교 개교 50주년 기념행사" },
    ],
  },
  {
    year: "1994",
    events: [
      { month: "04", text: "인하대학교 개교 40주년 기념" },
    ],
  },
  {
    year: "1984",
    events: [
      { month: "04", text: "인하대학교 개교 30주년 기념" },
    ],
  },
  {
    year: "1974",
    events: [
      { month: "04", text: "인하대학교 개교 20주년 기념" },
    ],
  },
  {
    year: "1959",
    events: [
      { month: "11", text: "인하대학교 총동창회 창립 (초대 회장: 김우경, 전기공학과 1회)" },
    ],
  },
  {
    year: "1954",
    events: [
      { month: "04", text: "인하대학교 개교 (인하공과대학으로 출범, 개교일 4월 24일)" },
      { month: "04", text: "하와이 교민 및 이승만 초대 대통령 성금으로 설립" },
    ],
  },
];

// 역대 회장단
const presidents = [
  { gen: 33, name: "김종우", dept: "전자공학과", year: 1984 },
  { gen: 32, name: "김두한", dept: "영어영문학과", year: 1982 },
  { gen: 31, name: "신한용", dept: "상업교육과", year: 1981 },
  { gen: 30, name: "이용기", dept: "금속공학과", year: 1973 },
  { gen: 29, name: "한진우", dept: "건축공학과", year: 1978 },
  { gen: 28, name: "강일형", dept: "토목공학과", year: 1973 },
  { gen: 27, name: "장석철", dept: "금속공학과", year: 1971 },
  { gen: 26, name: "이응칠", dept: "전자공학과", year: 1967 },
  { gen: 25, name: "이응칠", dept: "전자공학과", year: 1967 },
  { gen: 24, name: "주광남", dept: "조선공학과", year: 1963 },
  { gen: 23, name: "김정웅", dept: "토목공학과", year: 1963 },
  { gen: 22, name: "김정웅", dept: "토목공학과", year: 1963 },
  { gen: 21, name: "안길원", dept: "건축공학과", year: 1963 },
  { gen: 20, name: "안길원", dept: "건축공학과", year: 1963 },
  { gen: 19, name: "정호선", dept: "전기공학과", year: 1965 },
  { gen: 18, name: "정구복", dept: "광산공학과", year: 1955 },
  { gen: 17, name: "정구복", dept: "광산공학과", year: 1955 },
  { gen: 16, name: "정한진", dept: "화학공학과", year: 1957 },
  { gen: 15, name: "진수웅", dept: "광산공학과", year: 1955 },
  { gen: 14, name: "진수웅", dept: "광산공학과", year: 1955 },
  { gen: 13, name: "안병준", dept: "화학공학과", year: 1955 },
  { gen: 12, name: "안병준", dept: "화학공학과", year: 1955 },
  { gen: 11, name: "이종우", dept: "기계공학과", year: 1954 },
  { gen: 10, name: "이종우", dept: "기계공학과", year: 1954 },
  { gen: 9, name: "문정연", dept: "화공공학과", year: 1954 },
  { gen: 8, name: "문정연", dept: "화공공학과", year: 1954 },
  { gen: 7, name: "오수철", dept: "기계공학과", year: 1954 },
  { gen: 6, name: "오수철", dept: "기계공학과", year: 1954 },
  { gen: 5, name: "인관석", dept: "화학공학과", year: 1954 },
  { gen: 4, name: "김성보", dept: "조선공학과", year: 1954 },
  { gen: 3, name: "김성보", dept: "조선공학과", year: 1954 },
  { gen: 2, name: "최대식", dept: "광산공학과", year: 1954 },
  { gen: 1, name: "김우경", dept: "전기공학과", year: 1954 },
];

export default function HistoryPage() {
  return (
    <SubPageLayout
      breadcrumbs={[{ label: "총동창회", href: "/about" }, { label: "연혁" }]}
      sideMenus={sideMenus}
      currentPath="/about/history"
    >
      <div className="space-y-6">
        {/* 연혁 타임라인 */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-[#003876] mb-8 pb-4 border-b-2 border-[#003876]">연혁</h1>
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-[#E8F0FE]" />
            <div className="space-y-8">
              {history.map((item, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="w-14 shrink-0 text-right">
                    <span className="text-lg font-bold text-[#003876]">{item.year}</span>
                  </div>
                  <div className="relative shrink-0">
                    <div className="w-4 h-4 bg-[#003876] rounded-full mt-1.5 relative z-10" />
                  </div>
                  <div className="flex-1 pb-2">
                    {item.events.map((event, i) => (
                      <div key={i} className="flex gap-3 mb-3 last:mb-0">
                        <span className="text-sm text-[#C8A951] font-semibold shrink-0 w-6">{event.month}</span>
                        <p className="text-sm text-gray-700">{event.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 역대 회장단 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-bold text-[#003876]">역대 회장단</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 text-center text-gray-500 font-medium w-16">대수</th>
                  <th className="py-3 px-4 text-left text-gray-500 font-medium">성명</th>
                  <th className="py-3 px-4 text-left text-gray-500 font-medium">학과</th>
                  <th className="py-3 px-4 text-center text-gray-500 font-medium">입학년도</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {presidents.map((p) => (
                  <tr key={`${p.gen}-${p.name}`} className={`hover:bg-gray-50 ${p.gen === 33 ? "bg-[#E8F0FE]/50" : ""}`}>
                    <td className="py-3 px-4 text-center font-medium text-[#003876]">제{p.gen}대</td>
                    <td className="py-3 px-4 text-gray-800 font-medium">{p.name}</td>
                    <td className="py-3 px-4 text-gray-600">{p.dept}</td>
                    <td className="py-3 px-4 text-center text-gray-500">{p.year}학번</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}
