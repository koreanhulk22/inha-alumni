"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Setting {
  key: string;
  value: string | null;
  label: string | null;
}

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

      <div className="bg-[#E8F0FE] rounded-xl p-4 text-xs text-[#003876] leading-relaxed">
        <p className="font-bold mb-1">💡 문자 서비스 변경 안내</p>
        <p>현재 NHN Cloud SMS 서비스로 연동되어 있습니다. 다른 서비스(알리고, CoolSMS 등)로 변경이 필요한 경우 개발사에 문의해주세요.</p>
        <p className="mt-1">API 키는 암호화되어 저장되지 않으므로 외부에 노출되지 않도록 주의해주세요.</p>
      </div>
    </div>
  );
}
