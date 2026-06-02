"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { createVideo, deleteVideo, toggleVideo } from "../actions";

interface Video {
  id: string;
  title: string;
  description: string | null;
  youtube_id: string;
  is_active: boolean;
  sort_order: number;
  published_at: string | null;
}

export default function VideosTab() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [migrationNeeded, setMigrationNeeded] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", youtube_url: "", published_at: "", sort_order: "0" });

  async function load() {
    const { data, error } = await createClient().from("videos").select("*").order("sort_order").order("created_at", { ascending: false });
    if (error?.code === "42P01") { setMigrationNeeded(true); return; }
    setVideos(data ?? []);
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await createVideo(new FormData(e.currentTarget));
    setShowForm(false);
    setForm({ title: "", description: "", youtube_url: "", published_at: "", sort_order: "0" });
    await load();
    setLoading(false);
  }

  if (migrationNeeded) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">영상 관리</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="font-semibold text-amber-800 mb-2">DB 마이그레이션 필요</p>
          <p className="text-sm text-amber-700 mb-4">Supabase 대시보드 → SQL 에디터에서 아래 SQL을 실행해주세요:</p>
          <pre className="bg-white border border-amber-200 rounded p-3 text-xs text-gray-700 overflow-auto whitespace-pre-wrap">
{`CREATE TABLE IF NOT EXISTS public.videos (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title varchar(200) NOT NULL,
  description text,
  youtube_id varchar(20) NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  sort_order integer DEFAULT 0,
  published_at date,
  created_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read videos" ON public.videos FOR SELECT USING (is_active = true);`}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">영상 관리 (유튜브)</h1>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] transition-colors">
          + 영상 추가
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-gray-800">새 영상 등록</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
            <input name="title" required value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]"
              placeholder="제33대 김종우 총동창회장 취임식" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">유튜브 URL 또는 영상 ID *</label>
            <input name="youtube_url" required value={form.youtube_url} onChange={e => setForm(p => ({...p, youtube_url: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]"
              placeholder="https://youtu.be/xxxxx 또는 영상ID" />
            <p className="text-xs text-gray-400 mt-1">유튜브 공유 링크 또는 Watch URL 붙여넣기</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">게시일</label>
              <input name="published_at" type="date" value={form.published_at} onChange={e => setForm(p => ({...p, published_at: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">정렬 순서</label>
              <input name="sort_order" type="number" value={form.sort_order} onChange={e => setForm(p => ({...p, sort_order: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]"
                placeholder="0" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <textarea name="description" rows={2} value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]" />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">취소</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-[#003876] text-white font-semibold rounded-lg hover:bg-[#002a5c] disabled:opacity-50">
              {loading ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map(v => (
          <div key={v.id} className={`bg-white rounded-xl border ${v.is_active ? "border-gray-200" : "border-gray-100 opacity-60"} overflow-hidden`}>
            <div className="relative aspect-video bg-black">
              <img
                src={`https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`}
                alt={v.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-gray-800 line-clamp-2">{v.title}</p>
              {v.published_at && <p className="text-xs text-gray-400 mt-1">{v.published_at}</p>}
              <div className="flex items-center gap-2 mt-3">
                <form action={toggleVideo.bind(null, v.id, !v.is_active)}>
                  <button type="submit" className={`text-xs px-2 py-1 rounded-full font-medium ${v.is_active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                    {v.is_active ? "공개" : "비공개"}
                  </button>
                </form>
                <a href={`https://youtu.be/${v.youtube_id}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-[#003876] hover:underline ml-auto">유튜브</a>
                <form action={deleteVideo.bind(null, v.id)}>
                  <button type="submit" className="text-xs text-red-500 hover:text-red-700">삭제</button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {videos.length === 0 && (
          <div className="col-span-3 py-16 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
            <p className="text-3xl mb-2">🎬</p>
            <p className="text-sm">등록된 영상이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
