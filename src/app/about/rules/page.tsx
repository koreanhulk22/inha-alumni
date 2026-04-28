import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "회장 인사말", href: "/about/greeting" },
  { label: "회칙", href: "/about/rules" },
  { label: "조직도", href: "/about/organization" },
  { label: "연혁", href: "/about/history" },
  { label: "오시는 길", href: "/about/location" },
];

const chapters = [
  {
    title: "제1장 총칙",
    articles: [
      { no: "제1조 (명칭)", text: "본회는 인하대학교총동창회(이하 본회)라 칭한다. 본회는 각 단위동문회(단과대학, 대학원, 학과(부), 지역, 직장, 직능, 기수(동기), 기타 소그룹별 동문회)를 총괄하는 기구의 명칭이며 이하 모든 모임은 동문회라 칭한다." },
      { no: "제2조 (목적)", text: "본회는 회원 상호간의 친목을 도모하며 모교의 발전과 사회봉사에 기여함을 목적으로 한다." },
      { no: "제3조 (사무소)", text: "본회는 그 업무 처리를 위하여 사무소를 둔다. 단, 사무소의 위치는 운영위원회의 결의로 변경할 수 있다." },
      { no: "제4조 (사업)", text: "본회는 목적 달성을 위하여 다음 사업을 행한다: ① 회원 상호간의 친목과 우의 증진에 필요한 사업 ② 모교의 장학사업 및 학술연구 지원 사업 ③ 회원명부와 회보발간 및 기타 간행물의 출판사업(광고포함) ④ 웹사이트 운영 및 웹진 발행사업 ⑤ 기타 모교와 본회 및 사회발전에 필요한 사업 ⑥ 각 기관, 회사 등과의 업무제휴를 통한 수익사업 또는 그에 상응하는 직접적인 사업" },
    ],
  },
  {
    title: "제2장 회원",
    articles: [
      { no: "제5조 (회원의 구성)", text: "본회는 정회원, 준회원 및 명예회원으로 구성한다. ① 정회원: 모교(대학원 포함) 졸업 및 수료자 ② 준회원: 모교의 재학생 및 모교에 재학하였던 자 ③ 명예회원: 전현직 재단 이사장 및 총장, 명예박사 학위 취득자, 교직원 재직 경력자, 지역사회 및 모교·본회 발전에 기여한 자로 운영위원회의 심의 의결을 거쳐 정한다." },
      { no: "제6조 (회원의 권리의무)", text: "회원은 회의 출석 및 의안제출권, 선거권·피선거권을 가지며, 회비 납부, 각종 회의 참석, 회칙 준수, 주소지 및 근무지 변경 시 본회에 알릴 의무를 진다. 준회원 및 명예회원은 선거권·피선거권·의결권을 가질 수 없다." },
    ],
  },
  {
    title: "제3장 임원",
    articles: [
      { no: "제7조 (임원의 구성)", text: "본회는 다음 임원을 둔다: 회장 1명, 명예회장(역대 회장 등), 자문위원(회원의 1% 이내), 부회장(수석부회장 1명·상임부회장 다수·상근부회장 1명 포함, 회원의 1% 이내), 전문위원장(각 위원회별 1명), 이사(회원의 1% 이내, 실무상임이사 다수 포함), 감사 2명." },
      { no: "제8조 (임원의 선임)", text: "회장은 회장추대위원회의 추천을 받아 총회에서 추대 선출한다. 회장추대위원회는 명예회장단과 운영위원으로 구성하고, 위원장은 前2기 역대 회장이 맡는다. 현 회장은 임기만료 90일 전에 차기 회장 후보를 추천하여야 한다." },
      { no: "제9조 (임원의 직무)", text: "회장은 본회를 대표하며 회무를 총괄한다. 수석부회장은 차기 회장 후보로 추대되며 회장 부재 시 직무를 대행한다. 감사는 재정 및 업무 집행 사항을 감사하여 총회에 보고한다." },
      { no: "제10조 (임원의 임기)", text: "임원의 임기는 2년으로 하되 연임할 수 있으며, 회장은 1회에 한하여 연임할 수 있다. 임원의 임기 개시는 신임 회장이 취임하는 해의 2월 1일부터 시작하여 2년 후의 1월 31일까지이다." },
    ],
  },
  {
    title: "제4장 회의",
    articles: [
      { no: "제12조 (회의 및 소집)", text: "본회는 총회, 임원회의, 운영위원회, 명예회장단회의, 전문위원회 등의 회의를 개최한다. 정기총회는 매년 1/4분기 내에 회장이 소집하고, 임시총회는 회장이 필요하다고 인정하거나 운영위원회의 의결이 있을 때 소집한다." },
      { no: "제13조 (회의 구성 및 임무 권한)", text: "총회는 회원들을 대표하여 본회의 임원으로 구성하며, 운영위원회는 분기별 1회 개최를 기준으로 회장이 필요에 따라 소집한다. 총회 의결은 재적위원 과반수 출석과 출석위원 과반수 찬성으로 한다." },
    ],
  },
  {
    title: "제5장 단위동문회",
    articles: [
      { no: "단위동문회 규정", text: "단위동문회는 단과대학, 대학원, 학과(부), 지역, 직장, 직능, 기수(동기), 기타 소그룹별로 구성할 수 있다. 단위동문회장은 당연직 부회장으로 위촉된다. 단위동문회는 본회의 회칙에 반하지 않는 범위 내에서 자체 규칙을 제정할 수 있다." },
    ],
  },
  {
    title: "제6장 사무국 · 회계 · 장학 · 부칙",
    articles: [
      { no: "사무국", text: "본회의 사무를 처리하기 위해 사무국을 두며, 상근부회장이 회장의 지시를 받아 총괄한다. 사무국 직원의 임면은 상근부회장의 제청으로 회장이 결정한다." },
      { no: "회계", text: "본회의 회계연도는 1월 1일부터 12월 31일까지이다. 회비는 연회비와 특별회비로 구분하며, 납부 기준은 운영위원회에서 정한다." },
      { no: "장학", text: "본회는 후진육영을 위하여 장학사업을 시행하며, 장학생 선발 및 지급에 관한 사항은 별도로 정한다. 장학 사업은 인하대동문장학회와 연계하여 운영한다." },
    ],
  },
];

export default function RulesPage() {
  return (
    <SubPageLayout
      breadcrumbs={[{ label: "총동창회", href: "/about" }, { label: "회칙" }]}
      sideMenus={sideMenus}
      currentPath="/about/rules"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-[#003876] mb-2 pb-4 border-b-2 border-[#003876]">
          인하대학교 총동창회 회칙
        </h1>
        <p className="text-xs text-gray-400 mt-3 mb-8">고유번호: 121-89-01320</p>

        <div className="space-y-8">
          {chapters.map((chapter) => (
            <div key={chapter.title}>
              <h2 className="text-base font-bold text-[#003876] mb-4 bg-[#E8F0FE] px-4 py-2 rounded-lg">
                {chapter.title}
              </h2>
              <div className="space-y-4">
                {chapter.articles.map((article) => (
                  <div key={article.no} className="pl-4 border-l-2 border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-1">{article.no}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{article.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-400 text-center">
          본 회칙은 총회의 결의로 개정할 수 있습니다. 전문은 사무국(032-887-2345)에서 열람 가능합니다.
        </div>
      </div>
    </SubPageLayout>
  );
}
