"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Newsletter {
  id: string;
  title: string;
  issue_number: number | null;
  year: number | null;
  month: number | null;
  pdf_url: string | null;
  cover_image_url: string | null;
  created_at: string;
}

export default function NewsletterTab() {
  const [items, setItems] = useState<Newsletter[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", issue_number: "", year: "", month: "" });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  async function load() {
    const { data } = await createClient()
      .from("newsletters")
      .select("*")
      .order("year", { ascending: false })
      .order("month", { ascending: false });
    setItems(data ?? []);
  }

  useEffect(() => { load(); }, []);

  async function uploadFile(file: File, bucket: string) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", bucket);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    return json.url as string;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setError("제목을 입력해주세요."); return; }
    setUploading(true);
    setError("");

    try {
      let pdfUrl: string | null = null;
      let coverUrl: string | null = null;

      if (pdfFile) pdfUrl = await uploadFile(pdfFile, "newsletter-pdfs");
      if (coverFile) coverUrl = await uploadFile(coverFile, "gallery-images");

      const { error: dbErr } = await createClient().from("newsletters").insert({
        title: form.title,
        issue_number: form.issue_number ? parseInt(form.issue_number) : null,
        year: form.year ? parseInt(form.year) : null,
        month: form.month ? parseInt(form.month) : null,
        pdf_url: pdfUrl,
        cover_image_url: coverUrl,
      });

      if (dbErr) throw new Error(dbErr.message);
      setForm({ title: "", issue_number: "", year: "", month: "" });
      setPdfFile(null); setCoverFile(null); setCoverPreview(null);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드 실패");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(item: Newsletter) {
    if (!confirm(`"${item.title}"을 삭제하시겠습니까?`)) return;
    await createClient().from("newsletters").delete().eq("id", item.id);
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">동창회보 관리</h1>
        <button
          onClick={() => { setShowForm(!showForm); setError(""); }}
          className="px-4 py-2 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] transition-colors"
        >
          {showForm ? "취소" : "+ 호 추가"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="text-base font-bold text-gray-700">동창회보 등록</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">제목 *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
                placeholder="예: 인하 동창회보 제85호"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#003876]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">호수</label>
              <input type="number" value={form.issue_number} onChange={(e) => setForm({ ...form, issue_number: e.target.value })}
                placeholder="85"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#003876]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">발행연도</label>
              <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="2025"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#003876]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">PDF 파일</label>
              <label className={`flex items-center gap-2 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors ${pdfFile ? "border-[#003876] bg-[#E8F0FE]" : "border-gray-300 hover:border-[#003876]"}`}>
                <span className="text-lg">{pdfFile ? "📄" : "📁"}</span>
                <div>
                  <p className="text-xs font-semibold text-gray-700">{pdfFile ? pdfFile.name : "PDF 파일 선택"}</p>
                  <p className="text-xs text-gray-400">최대 20MB</p>
                </div>
                <input type="file" accept=".pdf" className="hidden" onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)} />
              </label>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">표지 이미지 (선택)</label>
              <label className={`flex items-center gap-2 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors ${coverFile ? "border-[#003876] bg-[#E8F0FE]" : "border-gray-300 hover:border-[#003876]"}`}>
                {coverPreview
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={coverPreview} alt="" className="h-10 object-contain rounded" />
                  : <span className="text-lg text-gray-400">🖼️</span>
                }
                <div>
                  <p className="text-xs font-semibold text-gray-700">{coverFile ? coverFile.name : "표지 이미지 선택"}</p>
                  <p className="text-xs text-gray-400">JPG · PNG</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setCoverFile(f);
                  if (f) { const r = new FileReader(); r.onload = (ev) => setCoverPreview(ev.target?.result as string); r.readAsDataURL(f); }
                }} />
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={uploading || !form.title.trim()}
            className="px-5 py-2 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] disabled:opacity-40">
            {uploading ? "업로드 중..." : "저장"}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-gray-500 font-medium w-16 hidden md:table-cell">표지</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">제목</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-20 hidden md:table-cell">호수</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-24 hidden md:table-cell">발행연도</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-20">PDF</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-16">삭제</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 hidden md:table-cell">
                  {item.cover_image_url
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={item.cover_image_url} alt="" className="w-10 h-14 object-cover rounded" />
                    : <div className="w-10 h-14 bg-gray-100 rounded flex items-center justify-center text-gray-300 text-xs">없음</div>
                  }
                </td>
                <td className="py-3 px-4 font-medium text-gray-800">{item.title}</td>
                <td className="py-3 px-4 text-center text-gray-500 hidden md:table-cell">{item.issue_number ? `제${item.issue_number}호` : "-"}</td>
                <td className="py-3 px-4 text-center text-gray-500 hidden md:table-cell">{item.year ?? "-"}</td>
                <td className="py-3 px-4 text-center">
                  {item.pdf_url
                    ? <a href={item.pdf_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#003876] font-semibold hover:underline">다운로드</a>
                    : <span className="text-xs text-gray-400">없음</span>
                  }
                </td>
                <td className="py-3 px-4 text-center">
                  <button onClick={() => handleDelete(item)} className="text-xs text-red-400 hover:underline">삭제</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} className="py-16 text-center text-gray-400">등록된 동창회보가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
