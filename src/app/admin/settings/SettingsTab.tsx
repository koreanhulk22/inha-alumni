"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Setting {
  key: string;
  value: string | null;
  label: string | null;
}

const BLUE_SHADES = [
  { color: "#003876", name: "인하 기본" },
  { color: "#0A2342", name: "미드나잇 네이비" },
  { color: "#1A237E", name: "인디고" },
  { color: "#0D47A1", name: "딥 블루" },
  { color: "#1565C0", name: "미디엄 블루" },
  { color: "#0277BD", name: "오션 블루" },
  { color: "#01579B", name: "스틸 블루" },
  { color: "#0C3547", name: "다크 틸" },
];

const SECTIONS = [
  {
    title: "문자 서비스 설정",
    desc: "NHN Cloud SMS 서비스 연동 정보",
    keys: ["sms_sender_no", "sms_nhn_app_key", "sms_nhn_secret_key"],
    sensitive: ["sms_nhn_secret_key"],
  },
  {
    title: "계좌 정보",
    desc: "기부 및 회비 납부 계좌",
    keys: ["bank_membership", "bank_scholarship", "bank_construction"],
    sensitive: [],
  },
  {
    title: "사무국 정보",
    desc: "푸터, 오시는 길 페이지에 표시",
    keys: ["office_phone", "office_fax", "office_email", "office_address"],
    sensitive: [],
  },
];

export default function SettingsTab() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  async function load() {
    const { data } = await createClient().from("site_settings").select("*");
    const map: Record<string, string> = {};
    const editMap: Record<string, string> = {};
    (data ?? []).forEach((s: Setting) => {
      map[s.key] = s.value ?? "";
      editMap[s.key] = s.value ?? "";
    });
    setSettings(map);
    setEditing(editMap);
  }

  useEffect(() => { load(); }, []);

  async function handleSave(key: string) {
    setSaving(key);
    const { error } = await createClient()
      .from("site_settings")
      .upsert({ key, value: editing[key], updated_at: new Date().toISOString() });
    if (!error) {
      setSettings((prev) => ({ ...prev, [key]: editing[key] }));
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    }
    setSaving(null);
  }

  const LABELS: Record<string, string> = {
    sms_sender_no: "발신번호",
    sms_nhn_app_key: "NHN AppKey",
    sms_nhn_secret_key: "NHN SecretKey",
    bank_membership: "회비발전기금 계좌",
    bank_scholarship: "장학기금 계좌",
    bank_construction: "건립기금 계좌",
    office_phone: "대표 전화",
    office_fax: "팩스",
    office_email: "이메일",
    office_address: "주소",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">사이트 설정</h1>

      {SECTIONS.map((section) => (
        <div key={section.title} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-700">{section.title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{section.desc}</p>
          </div>
          <div className="divide-y divide-gray-100">
            {section.keys.map((key) => {
              const isSensitive = section.sensitive.includes(key);
              const isDirty = editing[key] !== settings[key];
              const isSaving = saving === key;
              const wasSaved = saved === key;

              return (
                <div key={key} className="flex items-center gap-4 px-5 py-4">
                  <label className="w-36 text-xs font-semibold text-gray-600 shrink-0">
                    {LABELS[key] ?? key}
                  </label>
                  <input
                    type={isSensitive ? "password" : "text"}
                    value={editing[key] ?? ""}
                    onChange={(e) => setEditing((prev) => ({ ...prev, [key]: e.target.value }))}
                    placeholder={isSensitive ? "••••••••" : "미설정"}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#003876]"
                  />
                  <button
                    onClick={() => handleSave(key)}
                    disabled={!isDirty || isSaving}
                    className={`text-xs px-4 py-2 rounded-lg font-semibold transition-colors shrink-0 ${
                      wasSaved
                        ? "bg-green-50 text-green-600"
                        : isDirty
                        ? "bg-[#003876] text-white hover:bg-[#002a5c]"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isSaving ? "저장 중" : wasSaved ? "저장됨 ✓" : "저장"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* 퀵메뉴 배경색 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-700">디자인 설정</h2>
          <p className="text-xs text-gray-400 mt-0.5">메인 페이지 퀵메뉴 띠 색상 (파란색 계열)</p>
        </div>
        <div className="px-5 py-5">
          <p className="text-xs font-semibold text-gray-600 mb-3">퀵메뉴 배경색</p>
          <div className="flex flex-wrap gap-3 mb-4">
            {BLUE_SHADES.map((shade) => {
              const isActive = (editing["quickmenu_color"] ?? "#003876") === shade.color;
              const wasSaved = saved === "quickmenu_color";
              return (
                <button
                  key={shade.color}
                  onClick={() => setEditing((prev) => ({ ...prev, quickmenu_color: shade.color }))}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all ${
                    isActive ? "border-[#003876]" : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <span
                    className="w-10 h-10 rounded-lg shadow-sm block"
                    style={{ backgroundColor: shade.color }}
                  />
                  <span className="text-[10px] text-gray-500 leading-tight text-center w-16">{shade.name}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-md shrink-0 border border-gray-200"
              style={{ backgroundColor: editing["quickmenu_color"] ?? "#003876" }}
            />
            <span className="text-xs font-mono text-gray-500">{editing["quickmenu_color"] ?? "#003876"}</span>
            <button
              onClick={() => handleSave("quickmenu_color")}
              disabled={editing["quickmenu_color"] === settings["quickmenu_color"] || saving === "quickmenu_color"}
              className={`ml-auto text-xs px-4 py-2 rounded-lg font-semibold transition-colors ${
                saved === "quickmenu_color"
                  ? "bg-green-50 text-green-600"
                  : editing["quickmenu_color"] !== settings["quickmenu_color"]
                  ? "bg-[#003876] text-white hover:bg-[#002a5c]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {saving === "quickmenu_color" ? "저장 중" : saved === "quickmenu_color" ? "저장됨 ✓" : "저장"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#E8F0FE] rounded-xl p-4 text-xs text-[#003876] leading-relaxed">
        <p className="font-bold mb-1">💡 문자 서비스 변경 안내</p>
        <p>현재 NHN Cloud SMS 서비스로 연동되어 있습니다. 다른 서비스(알리고, CoolSMS 등)로 변경이 필요한 경우 개발사에 문의해주세요.</p>
        <p className="mt-1">API 키는 암호화되어 저장되지 않으므로 외부에 노출되지 않도록 주의해주세요.</p>
      </div>
    </div>
  );
}
