"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createSideBanner, updateSideBanner, deleteSideBanner, toggleSideBanner } from "../actions";
import { createClient } from "@/lib/supabase/client";

interface SideBanner {
  id: string;
  image_url: string | null;
  link_url: string | null;
  alt_text: string | null;
  position: string;
  sort_order: number;
  is_active: boolean;
}

export default function AdminSideBannersPage() {
  const [banners, setBanners] = useState<SideBanner[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SideBanner>>({});

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const editImageInputRef = useRef<HTMLInputElement>(null);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editUploading, setEditUploading] = useState(false);

  async function loadBanners() {
    const { data } = await createClient().from("side_banners").select("*").order("sort_order");
    setBanners(data ?? []);
  }

  useEffect(() => { loadBanners(); }, []);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", "post-media");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (res.ok) setImageUrl(json.url);
    setUploading(false);
  }

  async function handleEditImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", "post-media");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (res.ok) {
      const url = json.url;
      setEditImageUrl(url);
      setEditForm((prev) => ({ ...prev, image_url: url }));
    }
    setEditUploading(false);
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await createSideBanner(formData);
    setShowForm(false);
    setImageUrl("");
    setLoading(false);
    loadBanners();
  }

  async function handleUpdate(id: string) {
    setLoading(true);
    const formData = new FormData();
    formData.append("image_url", editImageUrl || (editForm.image_url ?? ""));
    formData.append("link_url", editForm.link_url ?? "");
    formData.append("alt_text", editForm.alt_text ?? "AD");
    formData.append("position", editForm.position ?? "left");
    formData.append("sort_order", String(editForm.sort_order ?? 0));
    await updateSideBanner(id, formData);
    setEditingId(null);
    setEditImageUrl("");
    setLoading(false);
    loadBanners();
  }

  async function handleDelete(id: string) {
    if (!confirm("삭제하시겠습니까?")) return;
    await deleteSideBanner(id);
    loadBanners();
  }

  async function handleToggle(id: string, current: boolean) {
    await toggleSideBanner(id, !current);
    loadBanners();
  }

  function startEdit(banner: SideBanner) {
    setEditingId(banner.id);
    setEditImageUrl("");
    setEditForm({
      image_url: banner.image_url ?? "",
      link_url: banner.link_url ?? "",
      alt_text: banner.alt_text ?? "AD",
      position: banner.position,
      sort_order: banner.sort_order,
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">사이드 배너 관리</h1>
          <p className="text-sm text-gray-400 mt-0.5">홈페이지 좌/우측 광고 배너 (1200px 이상 화면에서 표시)</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] transition-colors">
          {showForm ? "취소" : "+ 새 배너"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h2 className="text-base font-bold text-gray-700">새 사이드 배너 추가</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">위치 *</label>
              <select name="position" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]">
                <option value="left">왼쪽 (Left)</option>
                <option value="right">오른쪽 (Right)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">순서</label>
              <input name="sort_order" type="number" defaultValue="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">배너 이미지 (120×200px 권장)</label>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => imageInputRef.current?.click()}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                {uploading ? "업로드 중..." : "이미지 업로드"}
              </button>
              <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              {imageUrl && <span className="text-xs text-green-600 font-medium">업로드 완료</span>}
            </div>
            {imageUrl && (
              <div className="mt-2 relative w-[60px] h-[100px] rounded overflow-hidden border border-gray-200">
                <Image src={imageUrl} alt="preview" fill className="object-cover" />
              </div>
            )}
            <input type="hidden" name="image_url" value={imageUrl} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">링크 URL</label>
            <input name="link_url" placeholder="https://... 또는 /business/..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">대체 텍스트 (alt)</label>
            <input name="alt_text" defaultValue="AD" placeholder="AD" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
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
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-16">위치</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-12">순서</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell w-20">이미지</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">링크 / alt</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-20">상태</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-28">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {banners.map((banner) => (
              <>
                <tr key={banner.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${banner.position === "left" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}>
                      {banner.position === "left" ? "좌측" : "우측"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-400">{banner.sort_order}</td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    {banner.image_url ? (
                      <div className="relative w-[30px] h-[50px] rounded overflow-hidden border border-gray-200">
                        <Image src={banner.image_url} alt={banner.alt_text ?? "AD"} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-[30px] h-[50px] bg-gray-100 rounded flex items-center justify-center text-[10px] text-gray-400">없음</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {banner.link_url ? (
                      <p className="text-sm text-gray-700 truncate max-w-xs">{banner.link_url}</p>
                    ) : (
                      <p className="text-sm text-gray-300">링크 없음</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">{banner.alt_text}</p>
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
                    <td colSpan={6} className="px-4 py-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">위치</label>
                          <select value={editForm.position ?? "left"} onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]">
                            <option value="left">왼쪽</option>
                            <option value="right">오른쪽</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">링크 URL</label>
                          <input value={editForm.link_url ?? ""} onChange={(e) => setEditForm({ ...editForm, link_url: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">대체 텍스트</label>
                          <input value={editForm.alt_text ?? ""} onChange={(e) => setEditForm({ ...editForm, alt_text: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">순서</label>
                          <input type="number" value={editForm.sort_order ?? 0} onChange={(e) => setEditForm({ ...editForm, sort_order: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">이미지 교체</label>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => editImageInputRef.current?.click()}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                            {editUploading ? "업로드 중..." : "이미지 업로드"}
                          </button>
                          <input ref={editImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleEditImageUpload} />
                          {(editImageUrl || editForm.image_url) && (
                            <div className="relative w-[30px] h-[50px] rounded overflow-hidden border border-gray-200">
                              <Image src={editImageUrl || editForm.image_url!} alt="preview" fill className="object-cover" />
                            </div>
                          )}
                        </div>
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
              <tr><td colSpan={6} className="py-16 text-center text-gray-400">등록된 사이드 배너가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
