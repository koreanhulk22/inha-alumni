import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "대학 주요 소식", href: "/university/news" },
  { label: "학사 안내", href: "/university/academic" },
];

export default function AcademicPage() {
  return (
    <SubPageLayout
      breadcrumbs={[{ label: "모교소식" }, { label: "학사 안내" }]}
      sideMenus={sideMenus}
      currentPath="/university/academic"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h1 className="text-xl font-bold text-[#003876] mb-6">학사 안내</h1>
        <div className="space-y-4 text-sm text-gray-700">
          <div className="p-4 bg-[#E8F0FE] rounded-xl">
            <p className="font-semibold text-[#003876] mb-1">인하대학교 학사 정보</p>
            <p className="text-gray-600">인하대학교 공식 홈페이지에서 최신 학사 정보를 확인하세요.</p>
            <a
              href="https://www.inha.ac.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 px-4 py-2 bg-[#003876] text-white text-xs rounded-lg hover:bg-[#002a5c] transition-colors"
            >
              인하대학교 홈페이지 →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "입학처", desc: "신입생 모집 및 입학 관련 안내", url: "https://admission.inha.ac.kr" },
              { title: "교무처", desc: "학사 일정, 수강신청, 성적 안내", url: "https://www.inha.ac.kr" },
              { title: "학생처", desc: "장학금, 학생 지원 프로그램 안내", url: "https://www.inha.ac.kr" },
              { title: "취업지원센터", desc: "취업·진로 상담 및 프로그램", url: "https://www.inha.ac.kr" },
            ].map((item) => (
              <a
                key={item.title}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border border-gray-200 rounded-xl hover:border-[#003876] transition-colors"
              >
                <p className="font-semibold text-gray-800 mb-1">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}
