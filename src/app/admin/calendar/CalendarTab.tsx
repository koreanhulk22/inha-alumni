"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { createCalendarEvent, deleteCalendarEvent, toggleCalendarEnabled } from "../actions";

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  location: string | null;
  category: string;
  color: string;
  is_active: boolean;
}

export default function CalendarTab() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [migrationNeeded, setMigrationNeeded] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", start_date: "", end_date: "",
    location: "", category: "행사", color: "#003876",
  });

  async function load() {
    const supabase = createClient();
    const [{ data: evs, error }, { data: setting }] = await Promise.all([
      supabase.from("calendar_events").select("*").order("start_date"),
      supabase.from("site_settings").select("value").eq("key", "calendar_enabled").single(),
    ]);
    if (error?.code === "42P01") { setMigrationNeeded(true); return; }
    setEvents(evs ?? []);
    setEnabled(setting?.value !== "false");
  }

  useEffect(() => { load(); }, []);

  async function handleToggle() {
    const newVal = !enabled;
    setEnabled(newVal);
    await toggleCalendarEnabled(newVal);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await createCalendarEvent(fd);
    setShowForm(false);
    setForm({ title: "", description: "", start_date: "", end_date: "", location: "", category: "행사", color: "#003876" });
    await load();
    setLoading(false);
  }

  if (migrationNeeded) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">행사 달력 관리</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="font-semibold text-amber-800 mb-2">DB 마이그레이션 필요</p>
          <p className="text-sm text-amber-700 mb-4">Supabase 대시보드 → SQL 에디터에서 아래 SQL을 실행해주세요:</p>
          <pre className="bg-white border border-amber-200 rounded p-3 text-xs text-gray-700 overflow-auto whitespace-pre-wrap">
{`CREATE TABLE IF NOT EXISTS public.calendar_events (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title varchar(200) NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date,
  location varchar(300),
  category varchar(50) DEFAULT '행사',
  color varchar(20) DEFAULT '#003876',
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read calendar" ON public.calendar_events FOR SELECT USING (is_active = true);`}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">행사 달력 관리</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">달력 기능</span>
          <button
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-[#003876]" : "bg-gray-300"}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`} />
          </button>
          <span className={`text-xs font-semibold ${enabled ? "text-[#003876]" : "text-gray-400"}`}>
            {enabled ? "활성화" : "비활성화"}
          </span>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] transition-colors">
            + 행사 추가
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-gray-800">새 행사 등록</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">행사명 *</label>
              <input name="title" required value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]"
                placeholder="2026 총동창회장배 골프대회" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">시작일 *</label>
              <input name="start_date" type="date" required value={form.start_date} onChange={e => setForm(p => ({...p, start_date: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">종료일</label>
              <input name="end_date" type="date" value={form.end_date} onChange={e => setForm(p => ({...p, end_date: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">장소</label>
              <input name="location" value={form.location} onChange={e => setForm(p => ({...p, location: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]"
                placeholder="인천 송도컨벤시아" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
              <select name="category" value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]">
                {["행사", "골프", "총동창회", "특별행사", "학술", "기타"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">색상</label>
              <div className="flex items-center gap-2">
                <input name="color" type="color" value={form.color} onChange={e => setForm(p => ({...p, color: e.target.value}))}
                  className="h-9 w-16 rounded border border-gray-300 cursor-pointer" />
                <span className="text-xs text-gray-400">{form.color}</span>
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
              <textarea name="description" rows={2} value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]"
                placeholder="행사 상세 내용" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">취소</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-[#003876] text-white font-semibold rounded-lg hover:bg-[#002a5c] disabled:opacity-50">
              {loading ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">행사명</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium w-28">시작일</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell">장소</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium hidden lg:table-cell w-20">카테고리</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-20">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.map(ev => (
              <tr key={ev.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: ev.color }} />
                    <span className="font-medium text-gray-800">{ev.title}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-500">{ev.start_date}</td>
                <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{ev.location ?? "-"}</td>
                <td className="py-3 px-4 hidden lg:table-cell">
                  <span className="text-xs bg-[#E8F0FE] text-[#003876] px-2 py-0.5 rounded font-medium">{ev.category}</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <form action={deleteCalendarEvent.bind(null, ev.id)}>
                    <button type="submit" className="text-xs text-red-500 hover:text-red-700">삭제</button>
                  </form>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr><td colSpan={5} className="py-12 text-center text-gray-400">등록된 행사가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
