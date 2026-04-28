import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "동문 검색", href: "/network/search" },
  { label: "동문회 안내", href: "/network/guide" },
  { label: "동문기업탐방", href: "/network/companies" },
  { label: "업종별 현황", href: "/network/industry" },
];

const networkGroups = [
  {
    category: "단과대학 동문회",
    items: ["경영대학원", "경영석사(MBA)", "공과대학", "공학대학원", "교육대학원", "문과대학", "법학전문대학원", "사범대학", "사민대학원", "아태물류전문대학원", "의과대학", "자연과학대학", "정책대학원"],
  },
  {
    category: "학과 동문회",
    items: ["건축공학(건축학)", "경영학", "국어국문", "금속공학(신소재)", "기계공학", "무기재료학", "물리학", "법학", "사학", "사회인프라공학(토목)", "산업공학", "상업교육", "생명공학(생물공학)", "생물", "식품영양학", "에너지자원공학(자원·광산)", "영어교육", "영어영문", "응용물리학", "일어일문", "전기공학", "전자계산학(컴퓨터)", "전자공학", "정치외교", "조선(선박해양)공학", "지리정보공학", "체육교육", "항공(항공·자동화공학)", "행정학", "화학", "화학공학(원자력)", "환경공학"],
  },
  {
    category: "직능 동문회",
    items: ["교지편찬위원회", "IND(인경회북서)", "ROTC", "국인회(국민은행)", "기인회(기업은행)", "반도체", "변리사", "삼목회(테헤란로)", "인경회(인하경영자회)", "인룡회(인하비룡대상육영회)", "인무회(무역인)", "인송회(송도고)", "인수회(인하교수회)", "인수회(토목·환경·건축 물모임)", "인장회(장학금수혜자)", "인중회(중국)", "인천공우회(인천공무원)", "인하대직원동문회", "인하체육인회", "총학생회", "토목과인건회(대기업임원)", "하정료회(회계사)", "한국공항"],
  },
  {
    category: "지부 동문회",
    items: ["경남", "김포", "부산", "수원", "상해", "울산", "원미구청(부천)", "인당회(당진)", "인화회(인천경영자)", "재부산인하", "전북", "충남", "충북", "평택", "해외 남가주", "해외 뉴욕", "해외 북가주", "해외 하노이", "해외 호치민"],
  },
  {
    category: "동아리 동문회",
    items: ["봉사인하장학회", "사랑나눔장학회", "아쎄쓰", "아카데미", "알파카이", "인하역우회", "인하유도회", "인하OB합창단", "인하극예술연구회", "조정부", "태권도동문회"],
  },
  {
    category: "동호회 / 기수 동문회",
    items: ["82골프회", "82산악회", "ROTC골프회", "ROTC산악회", "금속과골프회", "금속과산악회", "인하건축골프회", "인하골프회", "인영골프회", "일문과골프회", "전자과골프회", "충남골프회", "하정료회골프회", "63·65·66·67·68·69·70·71·72·73·74·75·76·77·78·79·80·82·85·86·87·88동기회 및 장학회"],
  },
];

export default function NetworkGuidePage() {
  return (
    <SubPageLayout
      breadcrumbs={[{ label: "동문 네트워크" }, { label: "동문회 안내" }]}
      sideMenus={sideMenus}
      currentPath="/network/guide"
    >
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h1 className="text-xl font-bold text-[#003876] mb-2">단위동문회 현황</h1>
          <p className="text-sm text-gray-400">인하대학교 총동창회 산하 단위동문회 안내입니다.</p>
        </div>

        {networkGroups.map((group) => (
          <div key={group.category} className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-base font-bold text-[#003876] mb-3 pb-2 border-b border-gray-100">
              {group.category}
              <span className="ml-2 text-xs font-normal text-gray-400">{group.items.length}개</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span key={item} className="px-3 py-1.5 bg-[#E8F0FE] text-[#003876] text-xs rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-gray-50 rounded-xl p-4 text-center text-sm text-gray-500">
          단위동문회 등록 및 현황 문의: inha@inhain.com / 032-887-2345
        </div>
      </div>
    </SubPageLayout>
  );
}
