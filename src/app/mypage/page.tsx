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

          {/* 동문 인증 상태 배너 */}
          {profile?.is_alumni_verified ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <p className="text-sm font-semibold text-green-700">동문 인증 완료</p>
                <p className="text-xs text-green-600 mt-0.5">모든 서비스를 이용하실 수 있습니다.</p>
              </div>
            </div>
          ) : (
            <div className="bg-[#E8F0FE] border border-[#003876]/20 rounded-xl p-4">
              <p className="text-sm font-semibold text-[#003876] mb-1">동문 인증이 필요합니다</p>
              <p className="text-xs text-gray-600 mb-3">동문 인증 후 동문 검색, 게시글 작성 등 모든 서비스를 이용하실 수 있습니다.</p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>· 인증 방법: 사무국 직접 방문 또는 이메일 신청</p>
                <p>· 이메일: <strong>inha@inhain.com</strong></p>
                <p>· 전화: <strong>032-887-2345</strong></p>
                <p>· 졸업증명서 또는 학위증 사본 첨부 필요</p>
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
