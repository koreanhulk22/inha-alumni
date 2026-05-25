"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface AdBanner {
  id: string;
  zone: string;
  title: string | null;
  image_url: string | null;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
}

const ZONES = [
  { value: "side_left", label: "좌측 사이드 배너" },
  { value: "side_right", label: "우측 사이드 배너" },
  { value: "slide_right", label: "본문 우측 슬라이드 배너" },
];

const ZONE_LABELS: Record<string, string> = {
  side_left: "좌측 사이드",
  side_right: "우측 사이드",
  slide_right: "본문 슬라이드",
};

export default function AdBannersTab() {
  const [banners, setBanners] = useState<AdBanner[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<AdBanner>>({});
  const [form, setForm] = useState({ zone: "side_right", title: "", image_url: "", link_url: "", sort_order: 0 });

  async function load() {
    const { data } = await createClient().from("ad_banners" as never).select("*").order("zone").order("sort_order");
    setBanners((data ?? []) as AdBanner[]);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await createClient().from("ad_banners" as never).insert({
      zone: form.zone,
      title: form.title || null,
      image_url: form.image_url || null,
      link_url: form.link_url || null,
      sort_order: form.sort_order,
      is_active: true,
    } as never);
    setForm({ zone: "side_right", title: "", image_url: "", link_url: "", sort_order: 0 });
    setShowForm(false);
    setLoading(false);
    load();
  }

  async function handleUpdate(id: string) {
    setLoading(true);
    await createClient().from("ad_banners" as never).update({
      zone: editForm.zone,
      title: editForm.title || null,
      image_url: editForm.image_url || null,
      link_url: editForm.link_url || null,
      sort_order: editForm.sort_order ?? 0,
    } as never).eq("id", id);
    setEditingId(null);
    setLoading(false);
    load();
  }

  async function handleToggle(id: string, current: boolean) {
    await createClient().from("ad_banners" as never).update({ is_active: !current } as never).eq("id", id);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("삭제하시겠습니까?")) return;
    await createClient().from("ad_banners" as never).delete().eq("id", id);
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">광고 배너 관리</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] transition-colors">
          {showForm ? "취소" : "+ 새 배너"}
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700">
        사이드 배너는 스크롤하여 히어로 영역을 지나친 후부터 화면 좌우에 고정 표시됩니다.
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h2 className="text-base font-bold text-gray-700">새 광고 배너 추가</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">위치 *</label>
              <select value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]">
                {ZONES.map((z) => <option key={z.value} value={z.value}>{z.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">순서</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">배너명 (이미지 없을 때 표시)</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="예: 인하사랑카드 혜택" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">이미지 URL</label>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">클릭 링크 URL</label>
            <input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })}
              placeholder="/business/card 또는 https://..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
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
              <th className="py-3 px-4 text-left text-gray-500 font-medium w-32">위치</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-12">순서</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell w-20">이미지</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">배너명 / 링크</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-20">상태</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-28">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {banners.map((banner) => (
              <>
                <tr key={banner.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="text-xs bg-[#E8F0FE] text-[#003876] px-2 py-0.5 rounded font-medium">
                      {ZONE_LABELS[banner.zone] ?? banner.zone}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-400">{banner.sort_order}</td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    {banner.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={banner.image_url} alt="" className="w-14 h-9 object-cover rounded" />
                    ) : (
                      <div className="w-14 h-9 bg-gray-100 rounded flex items-center justify-center text-[10px] text-gray-400">없음</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-800">{banner.title ?? "(제목 없음)"}</p>
                    {banner.link_url && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{banner.link_url}</p>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => handleToggle(banner.id, banner.is_active)}
                      className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${banner.is_active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                      {banner.is_active ? "활성" : "비활성"}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => {
                        if (editingId === banner.id) { setEditingId(null); return; }
                        setEditingId(banner.id);
                        setEditForm({ zone: banner.zone, title: banner.title ?? "", image_url: banner.image_url ?? "", link_url: banner.link_url ?? "", sort_order: banner.sort_order });
                      }} className="text-xs text-[#003876] hover:underline">
                        {editingId === banner.id ? "취소" : "수정"}
                      </button>
                      <button onClick={() => handleDelete(banner.id)} className="text-xs text-red-400 hover:underline">삭제</button>
                    </div>
                  </td>
                </tr>
                {editingId === banner.id && (
                  <tr key={`edit-${banner.id}`} className="bg-[#F8FAFF]">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">위치</label>
                          <select value={editForm.zone} onChange={(e) => setEditForm({ ...editForm, zone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]">
                            {ZONES.map((z) => <option key={z.value} value={z.value}>{z.label}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">배너명</label>
                          <input value={editForm.title ?? ""} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">클릭 링크</label>
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
                          placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
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
              <tr><td colSpan={6} className="py-16 text-center text-gray-400">등록된 광고 배너가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
