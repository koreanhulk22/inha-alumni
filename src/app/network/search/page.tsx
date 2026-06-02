"use client";

import { useState, useEffect } from "react";
import { SubPageLayout } from "@/components/layout/SubPageLayout";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const sideMenus = [
  { label: "동문 검색", href: "/network/search" },
  { label: "동문회 안내", href: "/network/guide" },
  { label: "동문기업탐방", href: "/network/companies" },
  { label: "업종별 현황", href: "/network/industry" },
];

function maskName(name: string): string {
  if (!name || name.length <= 1) return name;
  return name[0] + "○".repeat(name.length - 1);
}

export default function NetworkSearchPage() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", department: "", graduation_year: "" });
  const [results, setResults] = useState<{ id: string; name: string; department: string | null; graduation_year: number | null }[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const supabase = createClient();
    let query = supabase.from("users").select("id, name, department, graduation_year").eq("is_alumni_verified", true);
    if (form.name) query = query.ilike("name", `%${form.name}%`);
    if (form.department) query = query.ilike("department", `%${form.department}%`);
    if (form.graduation_year) query = query.eq("graduation_year", parseInt(form.graduation_year));
    const { data } = await query.limit(20);
    setResults(data ?? []);
    setSearched(true);
    setLoading(false);
  };

  return (
    <SubPageLayout
      breadcrumbs={[{ label: "동문 네트워크" }, { label: "동문 검색" }]}
      sideMenus={sideMenus}
      currentPath="/network/search"
    >
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h1 className="text-xl font-bold text-[#003876] mb-1">동문 검색</h1>
          <p className="text-sm text-gray-400 mb-5">인증된 동문 회원을 검색할 수 있습니다.</p>

          {!user ? (
            <div className="bg-[#E8F0FE] rounded-xl p-6 text-center">
              <p className="text-sm font-semibold text-[#003876] mb-1">로그인이 필요한 서비스입니다</p>
              <p className="text-xs text-gray-500 mb-4">동문 검색은 회원 전용 서비스입니다.</p>
              <a href="/auth/login?redirect=/network/search" className="inline-block px-5 py-2 bg-[#003876] text-white text-sm rounded-full hover:bg-[#002a5c] transition-colors">
                로그인하기
              </a>
            </div>
          ) : (
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { label: "이름", key: "name", placeholder: "홍길동" },
                  { label: "학과", key: "department", placeholder: "전자공학과" },
                  { label: "입학년도", key: "graduation_year", placeholder: "1984" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    <input
                      value={form[f.key as keyof typeof form]}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]"
                    />
                  </div>
                ))}
              </div>
              <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] transition-colors disabled:opacity-50">
                {loading ? "검색 중..." : "동문 검색"}
              </button>
            </form>
          )}
        </div>

        {searched && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-700">검색 결과 {results.length}명</span>
            </div>
            <div className="divide-y divide-gray-100">
              {results.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">검색 결과가 없습니다.</div>
              ) : results.map((r) => (
                <div key={r.id} className="px-6 py-3 flex items-center gap-4">
                  <div className="w-9 h-9 bg-[#E8F0FE] rounded-full flex items-center justify-center text-[#003876] font-semibold text-sm shrink-0">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{maskName(r.name)}</p>
                    <p className="text-xs text-gray-400">
                      {[r.department, r.graduation_year ? `${r.graduation_year}학번` : null].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SubPageLayout>
  );
}
