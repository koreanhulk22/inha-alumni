"use client";

import { useState, useEffect } from "react";
import { createCondolence, deleteCondolence } from "../actions";
import { createClient } from "@/lib/supabase/client";

interface CondolenceEvent {
  id: string;
  type: string;
  name: string | null;
  content: string;
  event_date: string | null;
  created_at: string;
}

export default function AdminCondolencesPage() {
  const [events, setEvents] = useState<CondolenceEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function load() {
    const { data } = await createClient()
      .from("condolence_events")
      .select("*")
      .order("created_at", { ascending: false });
    setEvents(data ?? []);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await createCondolence(formData);
    setShowForm(false);
    setLoading(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("삭제하시겠습니까?")) return;
    await deleteCondolence(id);
    load();
  }

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }) : "-";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">경조사 관리</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] transition-colors"
        >
          {showForm ? "취소" : "+ 경조사 등록"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h2 className="text-base font-bold text-gray-700">경조사 등록</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">구분 *</label>
              <select name="type" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]">
                <option value="경사">경사</option>
                <option value="부고">부고</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">행사일</label>
              <input name="event_date" type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">동문명 *</label>
            <input name="name" required placeholder="예: 홍길동(전자89) 동문" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">내용 *</label>
            <input name="content" required placeholder="예: 장녀 결혼, 부친상 — 삼가 고인의 명복을 빕니다" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]" />
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
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-16">구분</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">동문명</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell">내용</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-28">행사일</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-28">등록일</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-16">삭제</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    event.type === "경사" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-600"
                  }`}>
                    {event.type}
                  </span>
                </td>
                <td className="py-3 px-4 font-medium text-gray-800">{event.name ?? "-"}</td>
                <td className="py-3 px-4 text-gray-500 text-xs max-w-xs truncate hidden md:table-cell">{event.content}</td>
                <td className="py-3 px-4 text-center text-xs text-gray-500">{formatDate(event.event_date)}</td>
                <td className="py-3 px-4 text-center text-xs text-gray-400">{formatDate(event.created_at)}</td>
                <td className="py-3 px-4 text-center">
                  <button onClick={() => handleDelete(event.id)} className="text-xs text-red-500 hover:underline">삭제</button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr><td colSpan={6} className="py-16 text-center text-gray-400">등록된 경조사가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
