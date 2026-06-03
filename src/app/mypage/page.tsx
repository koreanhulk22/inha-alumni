import { createClient } from "@/lib/supabase/server";
import { GNB } from "@/components/layout/GNB";
import { Footer } from "@/components/layout/Footer";
import { redirect } from "next/navigation";
import { ProfileEditForm } from "./ProfileEditForm";

export default async function MyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirect=/mypage");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen flex flex-col font-[Pretendard,system-ui,sans-serif]">
      <GNB />
      <main className="flex-1 bg-gray-50 py-10">
        <div className="max-w-2xl mx-auto px-4 space-y-4">
          <h1 className="text-2xl font-bold text-[#003876]">마이페이지</h1>

          {/* 가입 승인 상태 배너 */}
          {profile?.is_alumni_verified ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <p className="text-sm font-semibold text-green-700">승인 완료</p>
                <p className="text-xs text-green-600 mt-0.5">모든 서비스를 이용하실 수 있습니다.</p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-amber-800">가입 승인 대기 중</p>
                <p className="text-xs text-amber-700 mt-0.5">관리자 승인 후 동문 검색, 동창회보 등 전체 서비스 이용이 가능합니다.</p>
                <p className="text-xs text-gray-500 mt-1.5">문의: inha@inhain.com / 032-887-2345</p>
              </div>
            </div>
          )}

          {/* 내 정보 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-700 mb-4">내 정보</h2>
            <div className="space-y-3 text-sm mb-6">
              {[
                { label: "이메일", value: user.email || "-" },
                { label: "동문 인증", value: profile?.is_alumni_verified ? "✓ 인증 완료" : "미인증", highlight: profile?.is_alumni_verified },
              ].map((row) => (
                <div key={row.label} className="flex gap-4">
                  <span className="text-gray-400 w-24 shrink-0">{row.label}</span>
                  <span className={row.highlight ? "text-green-600 font-medium" : "text-gray-800"}>{row.value}</span>
                </div>
              ))}
            </div>

            <ProfileEditForm
              userId={user.id}
              initialName={profile?.name ?? ""}
              initialDepartment={profile?.department ?? ""}
              initialYear={profile?.graduation_year?.toString() ?? ""}
              initialPhone={profile?.phone ?? ""}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
