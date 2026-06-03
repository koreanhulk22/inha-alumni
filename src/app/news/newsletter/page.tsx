import { createClient } from "@/lib/supabase/server";
import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "공지사항", href: "/news/notice" },
  { label: "주요행사", href: "/news/events" },
  { label: "동창회보", href: "/news/newsletter" },
  { label: "동문보도", href: "/news/press" },
  { label: "포토 갤러리", href: "/news/gallery" },
];

const MONTH_LABELS: Record<number, string> = {
  1: "1월", 2: "2월", 3: "3월", 4: "4월", 5: "5월", 6: "6월",
  7: "7월", 8: "8월", 9: "9월", 10: "10월", 11: "11월", 12: "12월",
};

export default async function NewsletterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isApproved = false;
  if (user) {
    const { data: profile } = await supabase
      .from("users").select("is_alumni_verified").eq("id", user.id).single();
    isApproved = profile?.is_alumni_verified ?? false;
  }

  const { data: items } = await supabase
    .from("newsletters")
    .select("id, title, issue_number, year, month, pdf_url, cover_image_url")
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  const newsletters = items ?? [];

  return (
    <SubPageLayout
      breadcrumbs={[{ label: "총동창회 소식", href: "/news/notice" }, { label: "동창회보" }]}
      sideMenus={sideMenus}
      currentPath="/news/newsletter"
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#003876]">동창회보</h1>
          <p className="text-sm text-gray-400 mt-1">인하대학교 총동창회 기관지 — 연 4회 발행</p>
        </div>

        {!user ? (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-gray-700 mb-1">회원 전용 서비스입니다</p>
            <p className="text-xs text-gray-400 mb-4">동창회보 PDF는 승인된 회원만 열람할 수 있습니다.</p>
            <a href="/auth/login?redirect=/news/newsletter" className="inline-block px-6 py-2.5 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] transition-colors">
              로그인하기
            </a>
          </div>
        ) : !isApproved ? (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-amber-700 mb-1">승인 대기 중</p>
            <p className="text-xs text-gray-400">관리자 승인 후 동창회보 PDF를 열람하실 수 있습니다.</p>
          </div>
        ) : newsletters.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {newsletters.map((item) => (
              <div key={item.id} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  {item.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.cover_image_url}
                      alt=""
                      className="shrink-0 w-12 h-16 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="shrink-0 w-16 h-20 bg-[#003876] rounded-lg flex flex-col items-center justify-center text-white">
                      {item.year && <div className="text-xs opacity-70">{item.year}</div>}
                      {item.month && <div className="text-sm font-bold">{MONTH_LABELS[item.month] ?? `${item.month}월`}</div>}
                      {item.issue_number && <div className="text-xs opacity-70 mt-1">제{item.issue_number}호</div>}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
                    {(item.year || item.month || item.issue_number) && (
                      <p className="text-xs text-gray-400 mt-1">
                        {[
                          item.year,
                          item.month ? MONTH_LABELS[item.month] : null,
                          item.issue_number ? `제${item.issue_number}호` : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0">
                    {item.pdf_url ? (
                      <a
                        href={item.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-white bg-[#003876] hover:bg-[#002a5c] px-3 py-1.5 rounded-lg font-semibold transition-colors"
                      >
                        PDF 다운로드
                      </a>
                    ) : (
                      <span className="text-xs text-gray-300 border border-gray-200 px-3 py-1.5 rounded-lg">
                        PDF 준비중
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-400">
            <p className="text-4xl mb-3">📰</p>
            <p className="text-sm">등록된 동창회보가 없습니다.</p>
          </div>
        )}

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400">동창회보 구독 문의: inha@inhain.com / 032-887-2345</p>
        </div>
      </div>
    </SubPageLayout>
  );
}
