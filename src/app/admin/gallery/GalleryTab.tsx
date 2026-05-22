"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { createAdminClient } from "@/lib/supabase/admin";

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  taken_at: string | null;
  sort_order: number;
  created_at: string;
}

export default function GalleryTab() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [takenAt, setTakenAt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const { data } = await createClient()
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    setItems(data ?? []);
  }

  useEffect(() => { load(); }, []);

  function handleFile(f: File | null) {
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim()) { setError("제목과 이미지를 입력해주세요."); return; }
    setUploading(true);
    setError("");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", "gallery-images");

    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json();

    if (!res.ok) { setError(json.error); setUploading(false); return; }

    const supabase = createClient();
    const { error: dbErr } = await supabase.from("gallery_items").insert({
      title,
      image_url: json.url,
      taken_at: takenAt || null,
      sort_order: items.length,
    });

    if (dbErr) { setError(dbErr.message); } else {
      setTitle(""); setTakenAt(""); setFile(null); setPreview(null);
      setShowForm(false);
      load();
    }
    setUploading(false);
  }

  async function handleDelete(item: GalleryItem) {
    if (!confirm(`"${item.title}" 사진을 삭제하시겠습니까?`)) return;
    await createClient().from("gallery_items").delete().eq("id", item.id);
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">갤러리 관리</h1>
        <button
          onClick={() => { setShowForm(!showForm); setError(""); }}
          className="px-4 py-2 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] transition-colors"
        >
          {showForm ? "취소" : "+ 사진 추가"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleUpload} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="text-base font-bold text-gray-700">사진 업로드</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">제목 *</label>
              <input
                value={title} onChange={(e) => setTitle(e.target.value)} required
                placeholder="예: 2025 인하 가족의 밤"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#003876]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">촬영일</label>
              <input
                type="date" value={takenAt} onChange={(e) => setTakenAt(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#003876]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">이미지 *</label>
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-[#003876] hover:bg-[#F8FAFF] transition-colors overflow-hidden">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="" className="max-h-40 object-contain rounded" />
              ) : (
                <>
                  <span className="text-2xl text-gray-400">🖼️</span>
                  <span className="text-sm text-gray-500">클릭하여 이미지 선택</span>
                  <span className="text-xs text-gray-400">JPG · PNG · WEBP 최대 20MB</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
            </label>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={uploading || !file || !title.trim()}
            className="px-5 py-2 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] disabled:opacity-40">
            {uploading ? "업로드 중..." : "업로드"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image_url} alt={item.title} className="w-full aspect-video object-cover" />
            <div className="p-3">
              <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
              {item.taken_at && <p className="text-xs text-gray-400 mt-0.5">{new Date(item.taken_at).toLocaleDateString("ko-KR")}</p>}
              <button
                onClick={() => handleDelete(item)}
                className="mt-2 text-xs text-red-400 hover:text-red-600 hover:underline transition-colors"
              >삭제</button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-4 py-16 text-center text-gray-400">등록된 사진이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
