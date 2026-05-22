"use client";

import { useState, useEffect } from "react";
import { createBanner, updateBanner, deleteBanner, toggleBanner } from "../actions";
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Banner>>({});

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

  async function handleUpdate(id: string) {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", editForm.title ?? "");
    formData.append("subtitle", editForm.subtitle ?? "");
    formData.append("image_url", editForm.image_url ?? "");
    formData.append("link_url", editForm.link_url ?? "");
    formData.append("sort_order", String(editForm.sort_order ?? 0));
    await updateBanner(id, formData);
    setEditingId(null);
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

  function startEdit(banner: Banner) {
    setEditingId(banner.id);
    setEditForm({
      title: banner.title,
      subtitle: banner.subtitle ?? "",
      image_url: banner.image_url ?? "",
      link_url: banner.link_url ?? "",
      sort_order: banner.sort_order,
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">배너 관리 (히어로)</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] transition-colors">
          {showForm ? "취소" : "+ 새 배너"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h2 className="text-base font-bold text-gray-700">새 배너 추가</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">제목 *</label>
              <input name="title" required placeholder="배너 제목" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">순서</label>
              <input name="sort_order" type="number" defaultValue="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">부제목</label>
            <input name="subtitle" placeholder="부제목 (선택)" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">배경 이미지 URL</label>
            <input name="image_url" placeholder="https://... (없으면 기본 그라디언트)" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">링크 URL</label>
            <input name="link_url" placeholder="/news/notice 또는 https://..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
          </div>
          <button type="submit" disabled={loading} className="px-5 py-2 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] disabled:opacity-40">
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
              <th className="py-3 px-4 text-left text-gray-500 font-medium">제목 / 링크</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-20">상태</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-28">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {banners.map((banner) => (
              <>
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
                    {banner.link_url && <p className="text-xs text-gray-400 mt-0.5">{banner.link_url}</p>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => handleToggle(banner.id, banner.is_active)} className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                      banner.is_active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
                    }`}>
                      {banner.is_active ? "활성" : "비활성"}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => editingId === banner.id ? setEditingId(null) : startEdit(banner)} className="text-xs text-[#003876] hover:underline">
                        {editingId === banner.id ? "취소" : "수정"}
                      </button>
                      <button onClick={() => handleDelete(banner.id)} className="text-xs text-red-400 hover:underline">삭제</button>
                    </div>
                  </td>
                </tr>
                {editingId === banner.id && (
                  <tr key={`edit-${banner.id}`} className="bg-[#F8FAFF]">
                    <td colSpan={5} className="px-4 py-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">제목</label>
                          <input value={editForm.title ?? ""} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">부제목</label>
                          <input value={editForm.subtitle ?? ""} onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">링크 URL</label>
                          <input value={editForm.link_url ?? ""} onChange={(e) => setEditForm({ ...editForm, link_url: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">순서</label>
                          <input type="number" value={editForm.sort_order ?? 0} onChange={(e) => setEditForm({ ...editForm, sort_order: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">이미지 URL</label>
                        <input value={editForm.image_url ?? ""} onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
                      </div>
                      <button onClick={() => handleUpdate(banner.id)} disabled={loading}
                        className="mt-3 px-5 py-2 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] disabled:opacity-40">
                        {loading ? "저장 중..." : "수정 저장"}
                      </button>
                    </td>
                  </tr>
                )}
              </>
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
