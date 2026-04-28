"use client";

import { useState, useEffect } from "react";
import { createBanner, deleteBanner, toggleBanner } from "../actions";
import { createClient } from "@/lib/supabase/client";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadBanners() {
    const { data } = await createClient().from("banners").select("*").order("sort_order");
    setBanners(data ?? []);
  }

  useEffect(() => { loadBanners(); }, []);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await createBanner(formData);
    setShowForm(false);
    setLoading(false);
    loadBanners();
  }

  async function handleDelete(id: string) {
    if (!confirm("삭제하시겠습니까?")) return;
    await deleteBanner(id);
    loadBanners();
  }

  async function handleToggle(id: string, current: boolean) {
    await toggleBanner(id, !current);
    loadBanners();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">배너 관리</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] transition-colors">
          {showForm ? "취소" : "+ 새 배너"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h2 className="text-base font-bold text-gray-700">새 배너 추가</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
              <input name="title" required placeholder="배너 제목" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">순서</label>
              <input name="sort_order" type="number" defaultValue="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">부제목</label>
            <input name="subtitle" placeholder="부제목 (선택)" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">배경 이미지 URL</label>
            <input name="image_url" placeholder="https://... (Supabase Storage URL 또는 외부 이미지 URL)" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]" />
            <p className="text-xs text-gray-400 mt-1">없으면 기본 그라디언트 배경 사용</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">링크 URL</label>
            <input name="link_url" placeholder="/news/notice 또는 https://..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]" />
          </div>
          <button type="submit" disabled={loading} className="px-5 py-2 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] disabled:opacity-50">
            {loading ? "저장 중..." : "저장"}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-12">순서</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell w-16">이미지</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">제목</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell">링크</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-20">상태</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-16">삭제</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {banners.map((banner) => (
              <tr key={banner.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-center text-gray-400">{banner.sort_order}</td>
                <td className="py-3 px-4 hidden md:table-cell">
                  {banner.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={banner.image_url} alt="" className="w-14 h-9 object-cover rounded" />
                  ) : (
                    <div className="w-14 h-9 bg-linear-to-r from-[#003876] to-[#0066CC] rounded" />
                  )}
                </td>
                <td className="py-3 px-4">
                  <p className="font-medium text-gray-800">{banner.title}</p>
                  {banner.subtitle && <p className="text-xs text-gray-400">{banner.subtitle}</p>}
                </td>
                <td className="py-3 px-4 text-gray-500 text-xs truncate max-w-[180px] hidden md:table-cell">{banner.link_url || "-"}</td>
                <td className="py-3 px-4 text-center">
                  <button onClick={() => handleToggle(banner.id, banner.is_active)} className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                    banner.is_active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
                  }`}>
                    {banner.is_active ? "활성" : "비활성"}
                  </button>
                </td>
                <td className="py-3 px-4 text-center">
                  <button onClick={() => handleDelete(banner.id)} className="text-xs text-red-500 hover:underline">삭제</button>
                </td>
              </tr>
            ))}
            {banners.length === 0 && (
              <tr><td colSpan={5} className="py-16 text-center text-gray-400">등록된 배너가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
