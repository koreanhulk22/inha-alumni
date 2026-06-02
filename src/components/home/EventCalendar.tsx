"use client";

import { useState } from "react";

interface CalendarEvent {
  id: string;
  title: string;
  start_date: string;
  end_date: string | null;
  location: string | null;
  category: string;
  color: string;
}

interface Props {
  events: CalendarEvent[];
}

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

export function EventCalendar({ events }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDate(null);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDate(null);
  }

  function dateStr(d: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  function eventsOnDate(d: number) {
    const ds = dateStr(d);
    return events.filter(ev => {
      const start = ev.start_date;
      const end = ev.end_date ?? ev.start_date;
      return ds >= start && ds <= end;
    });
  }

  const selectedEvents = selectedDate
    ? events.filter(ev => {
        const end = ev.end_date ?? ev.start_date;
        return selectedDate >= ev.start_date && selectedDate <= end;
      })
    : [];

  // 이달의 행사 (이번 달에 시작하는 이벤트)
  const monthEvents = events.filter(ev => {
    const [ey, em] = ev.start_date.split("-").map(Number);
    return ey === year && em === month + 1;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-xl font-bold text-[#003876]">행사 달력</h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 달력 */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">
                ‹
              </button>
              <span className="text-base font-bold text-gray-800">{year}년 {MONTHS[month]}</span>
              <button onClick={nextMonth} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">
                ›
              </button>
            </div>

            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((d, i) => (
                <div key={d} className={`text-center text-xs font-semibold py-1 ${i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-400"}`}>
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const d = i + 1;
                const ds = dateStr(d);
                const dayEvents = eventsOnDate(d);
                const isToday = ds === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
                const isSelected = ds === selectedDate;
                const dayOfWeek = (firstDay + i) % 7;

                return (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(isSelected ? null : ds)}
                    className={`aspect-square flex flex-col items-center justify-start pt-1 rounded-lg text-xs transition-colors relative ${
                      isSelected ? "bg-[#003876] text-white" :
                      isToday ? "bg-[#E8F0FE] text-[#003876]" :
                      "hover:bg-gray-50"
                    }`}
                  >
                    <span className={`font-medium ${
                      isSelected ? "text-white" :
                      isToday ? "text-[#003876] font-bold" :
                      dayOfWeek === 0 ? "text-red-400" :
                      dayOfWeek === 6 ? "text-blue-400" : "text-gray-700"
                    }`}>
                      {d}
                    </span>
                    {dayEvents.length > 0 && (
                      <div className="flex gap-0.5 mt-0.5">
                        {dayEvents.slice(0, 3).map(ev => (
                          <span key={ev.id} className="w-1.5 h-1.5 rounded-full" style={{ background: isSelected ? "white" : ev.color }} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 우측 패널 */}
          <div className="space-y-4">
            {selectedDate && selectedEvents.length > 0 ? (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString("ko-KR", { month: "long", day: "numeric" })} 행사
                </p>
                <div className="space-y-2">
                  {selectedEvents.map(ev => (
                    <div key={ev.id} className="p-3 rounded-lg border border-gray-200" style={{ borderLeftColor: ev.color, borderLeftWidth: 3 }}>
                      <p className="text-sm font-semibold text-gray-800">{ev.title}</p>
                      {ev.location && <p className="text-xs text-gray-500 mt-1">📍 {ev.location}</p>}
                      <span className="text-xs text-gray-400 mt-1 inline-block">{ev.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : selectedDate ? (
              <p className="text-sm text-gray-400 text-center py-4">이 날의 행사가 없습니다.</p>
            ) : null}

            {monthEvents.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">{MONTHS[month]} 행사 목록</p>
                <div className="space-y-2">
                  {monthEvents.map(ev => (
                    <div key={ev.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                      <div className="w-10 text-center shrink-0">
                        <div className="text-xs text-gray-400">
                          {new Date(ev.start_date + "T00:00:00").toLocaleDateString("ko-KR", { month: "short" })}
                        </div>
                        <div className="text-lg font-bold text-[#003876] leading-none">
                          {new Date(ev.start_date + "T00:00:00").getDate()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 line-clamp-2">{ev.title}</p>
                        {ev.location && <p className="text-xs text-gray-500 mt-0.5 truncate">📍 {ev.location}</p>}
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-1" style={{ background: ev.color }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {monthEvents.length === 0 && !selectedDate && (
              <p className="text-sm text-gray-400 text-center py-4">{MONTHS[month]}에 등록된 행사가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
