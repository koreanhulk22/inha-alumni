"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createAdSlide, updateAdSlide, deleteAdSlide, toggleAdSlide } from "../actions";
import { createClient } from "@/lib/supabase/client";

interface AdSlide {
  id: string;
  title: string;
  label: string | null;
  image_url: string | null;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export default function AdminAdSlidesPage() {
  const [slides, setSlides] = useState<AdSlide[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<AdSlide>>({});

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const editImageInputRef = useRef<HTMLInputElement>(null);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editUploading, setEditUploading] = useState(false);

  async function loadSlides() {
    const { data } = await createClient().from("ad_slides").select("*").order("sort_order");
    setSlides(data ?? []);
  }

  useEffect(() => { loadSlides(); }, []);

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
    await createAdSlide(formData);
    setShowForm(false);
    setImageUrl("");
    setLoading(false);
    loadSlides();
  }

  async function handleUpdate(id: string) {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", editForm.title ?? "");
    formData.append("label", editForm.label ?? "총동창회 업무 제휴 협력 기업");
    formData.append("image_url", editImageUrl || (editForm.image_url ?? ""));
    formData.append("link_url", editForm.link_url ?? "");
    formData.append("sort_order", String(editForm.sort_order ?? 0));
    await updateAdSlide(id, formData);
    setEditingId(null);
    setEditImageUrl("");
    setLoading(false);
    loadSlides();
  }

  async function handleDelete(id: string) {
    if (!confirm("삭제하시겠습니까?")) return;
    await deleteAdSlide(id);
    loadSlides();
  }

  async function handleToggle(id: string, current: boolean) {
    await toggleAdSlide(id, !current);
    loadSlides();
  }

  function startEdit(slide: AdSlide) {
    setEditingId(slide.id);
    setEditImageUrl("");
    setEditForm({
      title: slide.title,
      label: slide.label ?? "총동창회 업무 제휴 협력 기업",
      image_url: slide.image_url ?? "",
      link_url: slide.link_url ?? "",
      sort_order: slide.sort_order,
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">슬라이드 광고 관리</h1>
          <p className="text-sm text-gray-400 mt-0.5">총동창회 협력 기업 슬라이드 배너</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] transition-colors">
          {showForm ? "취소" : "+ 새 슬라이드"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h2 className="text-base font-bold text-gray-700">새 슬라이드 추가</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">제목 *</label>
              <input name="title" required placeholder="협력 기업명 또는 슬라이드 제목" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">순서</label>
              <input name="sort_order" type="number" defaultValue="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">라벨 (배지 텍스트)</label>
            <input name="label" defaultValue="총동창회 업무 제휴 협력 기업" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">광고 이미지</label>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => imageInputRef.current?.click()}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                {uploading ? "업로드 중..." : "이미지 업로드"}
              </button>
              <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              {imageUrl && <span className="text-xs text-green-600 font-medium">업로드 완료</span>}
            </div>
            {imageUrl && (
              <div className="mt-2 relative w-40 h-20 rounded overflow-hidden border border-gray-200">
                <Image src={imageUrl} alt="preview" fill className="object-cover" />
              </div>
            )}
            <input type="hidden" name="image_url" value={imageUrl} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">링크 URL</label>
            <input name="link_url" placeholder="https://... 또는 /business/..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
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
              <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell w-20">이미지</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">제목 / 라벨</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-20">상태</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-28">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {slides.map((slide) => (
              <>
                <tr key={slide.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-center text-gray-400">{slide.sort_order}</td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    {slide.image_url ? (
                      <div className="relative w-16 h-10 rounded overflow-hidden border border-gray-200">
                        <Image src={slide.image_url} alt={slide.title} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">없음</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-800">{slide.title}</p>
                    {slide.label && <p className="text-xs text-[#003876] mt-0.5">{slide.label}</p>}
                    {slide.link_url && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{slide.link_url}</p>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => handleToggle(slide.id, slide.is_active)} className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                      slide.is_active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
                    }`}>
                      {slide.is_active ? "활성" : "비활성"}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => editingId === slide.id ? setEditingId(null) : startEdit(slide)} className="text-xs text-[#003876] hover:underline">
                        {editingId === slide.id ? "취소" : "수정"}
                      </button>
                      <button onClick={() => handleDelete(slide.id)} className="text-xs text-red-400 hover:underline">삭제</button>
                    </div>
                  </td>
                </tr>
                {editingId === slide.id && (
                  <tr key={`edit-${slide.id}`} className="bg-[#F8FAFF]">
                    <td colSpan={5} className="px-4 py-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">제목</label>
                          <input value={editForm.title ?? ""} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876]" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">라벨</label>
                          <input value={editForm.label ?? ""} onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
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
                        <label className="block text-xs font-semibold text-gray-600 mb-1">이미지 교체</label>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => editImageInputRef.current?.click()}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                            {editUploading ? "업로드 중..." : "이미지 업로드"}
                          </button>
                          <input ref={editImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleEditImageUpload} />
                          {(editImageUrl || editForm.image_url) && (
                            <div className="relative w-24 h-14 rounded overflow-hidden border border-gray-200">
                              <Image src={editImageUrl || editForm.image_url!} alt="preview" fill className="object-cover" />
                            </div>
                          )}
                        </div>
                      </div>
                      <button onClick={() => handleUpdate(slide.id)} disabled={loading}
                        className="mt-3 px-5 py-2 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] disabled:opacity-40">
                        {loading ? "저장 중..." : "수정 저장"}
                      </button>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {slides.length === 0 && (
              <tr><td colSpan={5} className="py-16 text-center text-gray-400">등록된 슬라이드가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
