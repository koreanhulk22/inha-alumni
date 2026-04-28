import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "회장 인사말", href: "/about/greeting" },
  { label: "회칙", href: "/about/rules" },
  { label: "조직도", href: "/about/organization" },
  { label: "연혁", href: "/about/history" },
  { label: "오시는 길", href: "/about/location" },
];

export default function GreetingPage() {
  return (
    <SubPageLayout
      breadcrumbs={[{ label: "총동창회", href: "/about" }, { label: "회장 인사말" }]}
      sideMenus={sideMenus}
      currentPath="/about/greeting"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-[#003876] mb-8 pb-4 border-b-2 border-[#003876]">
          회장 인사말
        </h1>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="shrink-0">
            <div className="w-48 h-60 bg-[#E8F0FE] rounded-xl flex flex-col items-center justify-center text-[#003876]">
              <div className="text-4xl mb-2">👤</div>
              <div className="text-sm font-medium">제33대 총동창회장</div>
              <div className="text-lg font-bold mt-1">김종우</div>
            </div>
            <div className="mt-3 text-center text-sm text-gray-500">
              <p className="font-semibold text-[#003876]">김종우 회장</p>
              <p>전자공학과 84학번</p>
              <p>2026.01.27 취임</p>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-4 font-medium">제33대 총동창회장 김종우</p>
            <div className="space-y-4 text-[15px] text-gray-700 leading-relaxed">
              <p>
                인하대학교는 국가와 지역사회의 염원을 담은 명실상부한 민족대학입니다. 1954년 하와이 교민과 이승만 초대 대통령의 조국부흥에 대한 숭고한 염원과 의지로 개교했습니다. 이후 대한민국 산업과 사회 곳곳에서 인재를 길러왔습니다. 인하대학교는 창학 100년을 향해 나아가고 있습니다.
              </p>
              <p>
                인하대학교의 모든 성과는 각자의 자리에서 묵묵히 인하의 이름을 빛내 온 동문 여러분과 인천시민, 인하를 사랑하는 여러분들의 노력 덕분입니다. 그간 총동창회는 친목공영, 모교후원, 후진육영의 뜻과 보람을 이어 왔습니다.
              </p>
              <p>
                앞으로 제33대 총동창회는 <strong className="text-[#003876]">'상생과 신뢰의 인하, 미래로!'</strong>라는 구호 아래 총동창회의 역할을 한 단계 더 확장하고자 합니다.
              </p>
              <p>
                우선 동문을 연결하고, 동문 간 협업으로 상생의 가치를 실현하겠습니다. 그 힘으로 사회에 기여하고 실천하는 총동창회를 만들겠습니다. 또한 동문 참여를 확대하고, 동문 기업과 동문을 잇는 상생 플랫폼을 구축하겠습니다. 무엇보다 투명하고 책임 있는 운영으로 신뢰받는 총동창회가 되도록 노력하겠습니다.
              </p>
              <p>
                총동창회는 회장 한 사람의 조직이 아닙니다. 동문 모두의 공동체입니다. 회장은 앞에서 이끄는 사람이 아니라 동문 여러분과 함께 걷는 파트너입니다. 동문 여러분과 함께 상생과 신뢰의 가치를 실천하며 인하의 미래를 향해 나아가겠습니다.
              </p>
              <p>감사합니다.</p>
              <p className="text-right text-sm text-gray-500">
                2026년 2월 10일<br />
                <strong className="text-[#003876] text-base">인하대학교 제33대 총동창회장 김 종 우</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-bold text-[#003876] mb-5">총동창회장 주요 약력</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">학력</h3>
              <ul className="space-y-1.5 text-gray-700">
                <li>· 1991년 인하대학교 전자공학과 학사</li>
                <li>· 인하대학교 제조혁신전문대학원 제조AI융합 전공 재학중</li>
                <li>· 인하대 연태대 글로벌비지니스리더아카데미(GBLA) 초대 원우회장 (2025)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">병역</h3>
              <ul className="space-y-1.5 text-gray-700">
                <li>· ROTC 20기</li>
                <li>· 1982.02 ~ 1984.06 육군 공병 중위 전역</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">주요 경력</h3>
              <ul className="space-y-1.5 text-gray-700">
                <li>· 삼성SDI 근무 (1991~1997)</li>
                <li>· 한별미디어 창업 (1997)</li>
                <li>· (주)네오드림스 창업 및 대표이사 (2000~)</li>
                <li>· (주)하모닉스 회장</li>
                <li>· 중소기업중앙회 정보산업협동조합 이사 (2010~)</li>
                <li>· (사)연수송도경영자협의회 바이오헬스케어 사업단장 (2025~)</li>
                <li>· 현 김포 충청 향우연합회 회장</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">총동창회 활동</h3>
              <ul className="space-y-1.5 text-gray-700">
                <li>· 인하대학교 전자공학과 총동문회장 (2018~2025)</li>
                <li>· 인하대학교 총동창회 24~27대 부회장</li>
                <li>· 인하대학교 총동창회 28대 상임부회장</li>
                <li>· 인하대학교 총동창회 29대 수석부회장</li>
                <li>· 인하대학교 총동창회 수석부회장 (2025~)</li>
                <li>· 국무총리 표창 2회 (2015, 2020)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}
