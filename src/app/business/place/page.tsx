import { createClient } from "@/lib/supabase/server";
import { SubPageLayout } from "@/components/layout/SubPageLayout";
import { RegisterForm } from "./RegisterForm";

const sideMenus = [
  { label: "인하상회", href: "/business/shop" },
  { label: "인하사랑카드", href: "/business/card" },
  { label: "인하플레이스", href: "/business/place" },
  { label: "인하사랑콘서트", href: "/business/concert" },
  { label: "창업지원", href: "/business/startup" },
];

const categoryIcons: Record<string, string> = {
  요식업: "🍽️", 의료: "🏥", 사무소: "🏢", 교육: "📚", 서비스: "🛎️", 기타: "📌",
};

export default async function PlacePage() {
  const supabase = await createClient();
  const [{ data: businesses }, { data: { user } }] = await Promise.all([
    supabase.from("alumni_businesses").select("*").eq("is_approved", true).order("name"),
    supabase.auth.getUser(),
  ]);

  return (
    <SubPageLayout
      breadcrumbs={[{ label: "총동창회 사업" }, { label: "인하플레이스" }]}
      sideMenus={sideMenus}
      currentPath="/business/place"
    >
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-[#003876] mb-1">인하플레이스</h1>
              <p className="text-sm text-gray-500">전국 동문이 운영하는 업소를 GPS 기반으로 손쉽게 찾고, 동문 우대 혜택을 받아보세요.</p>
              <p className="text-xs text-[#C8A951] font-semibold mt-1">2026년 7월 1호점 현판식을 시작으로 플랫폼을 본격 운영합니다.</p>
            </div>
            {user && <RegisterForm userId={user.id} />}
          </div>
        </div>

        {/* 지도 자리 */}
        <div className="bg-[#E8F0FE] rounded-xl h-60 flex items-center justify-center text-[#003876]">
          <div className="text-center">
            <div className="text-3xl mb-2">🗺️</div>
            <p className="text-sm font-medium">Kakao Map 연동 예정</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex gap-2 flex-wrap">
            {["전체", "요식업", "의료", "사무소", "교육", "서비스", "기타"].map((cat) => (
              <span key={cat} className="px-3 py-1 text-xs rounded-full border border-gray-200 text-gray-600 cursor-pointer hover:border-[#003876] hover:text-[#003876]">
                {cat}
              </span>
            ))}
          </div>
          <div className="divide-y divide-gray-100">
            {businesses?.map((biz) => (
              <div key={biz.id} className="px-6 py-4 flex items-center gap-4">
                <span className="text-2xl shrink-0">{categoryIcons[biz.category] ?? "📌"}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{biz.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{biz.address}</p>
                  {biz.benefit && <p className="text-xs text-[#003876] mt-1 font-medium">혜택: {biz.benefit}</p>}
                </div>
                <span className="shrink-0 text-xs bg-[#E8F0FE] text-[#003876] px-2 py-0.5 rounded">{biz.category}</span>
              </div>
            ))}
            {(!businesses || businesses.length === 0) && (
              <div className="py-16 text-center text-gray-400 text-sm">등록된 업소가 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}
