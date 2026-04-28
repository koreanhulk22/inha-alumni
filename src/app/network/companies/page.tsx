import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "동문 검색", href: "/network/search" },
  { label: "동문회 안내", href: "/network/guide" },
  { label: "동문기업탐방", href: "/network/companies" },
  { label: "업종별 현황", href: "/network/industry" },
];

const companies = [
  { name: "(주)하모닉스", alumni: "김종우 (전자공학과 84학번)", role: "회장", sector: "전기/전자", desc: "전자부품 및 시스템 제조 전문기업. 국무총리 표창 수상 기업.", location: "인천 송도", url: null },
  { name: "(주)네오드림스", alumni: "김종우 (전자공학과 84학번)", role: "대표이사", sector: "IT/소프트웨어", desc: "소프트웨어 솔루션 및 ICT 전문기업.", location: "인천 연수구", url: null },
  { name: "인하테크", alumni: "이수진 (경영학과 91학번)", role: "대표이사", sector: "반도체 소재", desc: "코스피 상장 반도체 소재 전문기업. 기업가치 3,000억원.", location: "경기 화성", url: null },
  { name: "에코프로이노베이션", alumni: "인하 동문", role: "임원", sector: "배터리/소재", desc: "이차전지 소재 전문 코스닥 상장기업.", location: "충북 청주", url: "https://www.ecopro.co.kr/" },
  { name: "(주)코반", alumni: "인하 동문", role: "대표", sector: "제조", desc: "기계부품 제조 전문기업.", location: "인천", url: "http://korvan.net/" },
  { name: "(주)비트컴퓨터", alumni: "인하 동문", role: "임원", sector: "IT/의료", desc: "의료정보시스템 전문 코스닥 상장기업.", location: "서울", url: "https://www.bit.kr/" },
  { name: "(주)에몬스가구", alumni: "인하 동문", role: "임원", sector: "가구/인테리어", desc: "국내 주요 가구 전문 브랜드.", location: "경기", url: "https://www.emonshome.co.kr/" },
  { name: "AJ네트웍스", alumni: "인하 동문", role: "임원", sector: "물류/렌탈", desc: "종합 렌탈·물류 코스피 상장기업.", location: "서울", url: "http://www.ajnet.co.kr" },
  { name: "SE네트웍스(주)", alumni: "인하 동문", role: "대표", sector: "IT/네트워크", desc: "네트워크 인프라 구축 전문기업.", location: "서울", url: "http://www.se-networks.com/" },
  { name: "(주)통인익스프레스", alumni: "인하 동문", role: "대표", sector: "물류", desc: "화물운송 및 물류 전문기업.", location: "서울", url: "https://www.tonginexp.com/" },
  { name: "삼정가스공업(주)", alumni: "인하 동문", role: "대표", sector: "에너지", desc: "산업용 가스 전문기업.", location: "인천", url: "http://www.sjgas.co.kr/" },
  { name: "동해동인병원·강릉동인병원", alumni: "인하 동문", role: "원장", sector: "의료", desc: "강원 지역 동문 운영 종합병원.", location: "강원", url: "http://dhdongin.or.kr/" },
  { name: "한국화학연구원", alumni: "김민준 (화학과 87학번)", role: "원장", sector: "연구/공공", desc: "국가 화학연구 기관. 친환경 화학소재 개발 선도.", location: "대전 유성구", url: null },
  { name: "이재현 법률사무소", alumni: "이재현 (법학과)", role: "대표변호사", sector: "법률", desc: "민사·형사·상사 전문. 동문 초기 상담 무료.", location: "인천 남동구", url: null },
];

export default function CompaniesPage() {
  return (
    <SubPageLayout
      breadcrumbs={[{ label: "동문 네트워크" }, { label: "동문기업탐방" }]}
      sideMenus={sideMenus}
      currentPath="/network/companies"
    >
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h1 className="text-xl font-bold text-[#003876] mb-1">동문기업탐방</h1>
          <p className="text-sm text-gray-400">인하 동문이 이끄는 기업을 소개합니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companies.map((co) => (
            <div key={co.name} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-[#003876] hover:shadow-sm transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">{co.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">📍 {co.location}</p>
                </div>
                <span className="shrink-0 text-xs bg-[#E8F0FE] text-[#003876] px-2 py-0.5 rounded font-medium">{co.sector}</span>
              </div>
              <p className="text-xs text-gray-600 mb-3">{co.desc}</p>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-medium text-[#003876]">{co.alumni}</span>
                  <span>·</span>
                  <span>{co.role}</span>
                </div>
                {co.url && (
                  <a href={co.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#003876] hover:underline shrink-0">
                    홈페이지 →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl p-4 text-center text-sm text-gray-500">
          동문기업 등록 문의: inha@inhain.com / 032-887-2345
        </div>
      </div>
    </SubPageLayout>
  );
}
