"use client";

import { useState } from "react";

type ThemeVars = {
  "--qm-bg": string;
  "--qm-text": string;
  "--qm-border": string;
  "--qm-hover": string;
  "--brand-primary": string;
  "--brand-secondary": string;
  "--shop-bg": string;
  "--donation-bg": string;
};

const OPTIONS: { key: string; label: string; swatch: string; vars: ThemeVars }[] = [
  {
    key: "navy",
    label: "현재 — 인하 네이비",
    swatch: "#003876",
    vars: {
      "--qm-bg": "#003876", "--qm-text": "#ffffff", "--qm-border": "rgba(255,255,255,0.15)", "--qm-hover": "rgba(0,0,0,0.15)",
      "--brand-primary": "#003876", "--brand-secondary": "#0066CC",
      "--shop-bg": "#C8A951", "--donation-bg": "#003876",
    },
  },
  {
    key: "blue",
    label: "안 1 — 밝은 블루",
    swatch: "#1565C0",
    vars: {
      "--qm-bg": "#1565C0", "--qm-text": "#ffffff", "--qm-border": "rgba(255,255,255,0.15)", "--qm-hover": "rgba(0,0,0,0.12)",
      "--brand-primary": "#1565C0", "--brand-secondary": "#0288D1",
      "--shop-bg": "#1565C0", "--donation-bg": "#1565C0",
    },
  },
  {
    key: "grad",
    label: "안 2 — 그라디언트",
    swatch: "linear-gradient(90deg,#003876,#0066CC)",
    vars: {
      "--qm-bg": "linear-gradient(90deg,#003876,#0066CC)", "--qm-text": "#ffffff", "--qm-border": "rgba(255,255,255,0.12)", "--qm-hover": "rgba(255,255,255,0.08)",
      "--brand-primary": "#003876", "--brand-secondary": "#0066CC",
      "--shop-bg": "linear-gradient(90deg,#003876,#0066CC)", "--donation-bg": "#003876",
    },
  },
  {
    key: "light",
    label: "안 3 — 연한 하늘",
    swatch: "#E8F0FE",
    vars: {
      "--qm-bg": "#E8F0FE", "--qm-text": "#003876", "--qm-border": "#c5d5f0", "--qm-hover": "rgba(0,56,118,0.07)",
      "--brand-primary": "#003876", "--brand-secondary": "#0066CC",
      "--shop-bg": "#C8A951", "--donation-bg": "#003876",
    },
  },
  {
    key: "gold",
    label: "안 4 — 다크+골드",
    swatch: "#002d63",
    vars: {
      "--qm-bg": "#002d63", "--qm-text": "#C8A951", "--qm-border": "rgba(200,169,81,0.2)", "--qm-hover": "rgba(200,169,81,0.08)",
      "--brand-primary": "#002d63", "--brand-secondary": "#003876",
      "--shop-bg": "#C8A951", "--donation-bg": "#002d63",
    },
  },
  {
    key: "grad-gold",
    label: "안 5 — 골드 그라디언트",
    swatch: "linear-gradient(90deg,#003876,#8B6914)",
    vars: {
      "--qm-bg": "linear-gradient(90deg,#003876 0%,#7a5c14 100%)", "--qm-text": "#ffffff", "--qm-border": "rgba(200,169,81,0.25)", "--qm-hover": "rgba(200,169,81,0.1)",
      "--brand-primary": "#003876", "--brand-secondary": "#7a5c14",
      "--shop-bg": "#8B6914", "--donation-bg": "#002040",
    },
  },
  {
    key: "indigo",
    label: "안 6 — 딥 인디고",
    swatch: "#312e81",
    vars: {
      "--qm-bg": "#312e81", "--qm-text": "#ffffff", "--qm-border": "rgba(255,255,255,0.15)", "--qm-hover": "rgba(255,255,255,0.08)",
      "--brand-primary": "#312e81", "--brand-secondary": "#4338ca",
      "--shop-bg": "#312e81", "--donation-bg": "#1e1b4b",
    },
  },
  {
    key: "teal",
    label: "안 7 — 딥 그린",
    swatch: "#065f46",
    vars: {
      "--qm-bg": "#065f46", "--qm-text": "#ffffff", "--qm-border": "rgba(255,255,255,0.15)", "--qm-hover": "rgba(0,0,0,0.12)",
      "--brand-primary": "#065f46", "--brand-secondary": "#047857",
      "--shop-bg": "#065f46", "--donation-bg": "#064e3b",
    },
  },
  {
    key: "slate",
    label: "안 8 — 차콜 슬레이트",
    swatch: "#1e293b",
    vars: {
      "--qm-bg": "#1e293b", "--qm-text": "#e2e8f0", "--qm-border": "rgba(255,255,255,0.1)", "--qm-hover": "rgba(255,255,255,0.06)",
      "--brand-primary": "#1e293b", "--brand-secondary": "#334155",
      "--shop-bg": "#334155", "--donation-bg": "#0f172a",
    },
  },
  {
    key: "white",
    label: "안 9 — 화이트",
    swatch: "#ffffff",
    vars: {
      "--qm-bg": "#ffffff", "--qm-text": "#003876", "--qm-border": "#e0e7f5", "--qm-hover": "rgba(0,56,118,0.05)",
      "--brand-primary": "#003876", "--brand-secondary": "#0066CC",
      "--shop-bg": "#C8A951", "--donation-bg": "#003876",
    },
  },
];

export function ColorSwitcher() {
  const [selected, setSelected] = useState<string>("navy");
  const [open, setOpen] = useState(true);

  function apply(opt: (typeof OPTIONS)[number]) {
    setSelected(opt.key);
    const root = document.documentElement;
    Object.entries(opt.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-[Pretendard,sans-serif]">
      {open && (
        <div className="bg-white rounded-xl shadow-2xl p-4 mb-3 w-56 max-h-[80vh] overflow-y-auto">
          <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">색상 테마 선택</p>
          <p className="text-[9px] text-gray-400 mb-3">퀵메뉴 · 인하상회 배너 · 사업 카드 · 기부 섹션</p>
          {OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => apply(opt)}
              className={`flex items-center gap-2 w-full px-3 py-2 mb-1.5 rounded-lg border-2 text-xs font-semibold text-left transition-all ${
                selected === opt.key
                  ? "border-[#003876] bg-[#003876] text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-[#003876] hover:text-[#003876]"
              }`}
            >
              <span
                className="w-4 h-4 rounded-sm shrink-0 border border-gray-200/50"
                style={{ background: opt.swatch }}
              />
              {opt.label}
            </button>
          ))}
          <p className="text-[10px] text-gray-400 mt-3 pt-3 border-t border-gray-100">
            마음에 드는 안 선택 후 알려주세요
          </p>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2.5 bg-[#003876] text-white text-xs font-bold rounded-xl shadow-lg hover:bg-[#002a5c] transition-colors"
      >
        {open ? "색상 패널 닫기 ✕" : "🎨 색상 테마 선택"}
      </button>
    </div>
  );
}
