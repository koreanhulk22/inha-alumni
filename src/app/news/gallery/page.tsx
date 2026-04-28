import { SubPageLayout } from "@/components/layout/SubPageLayout";

const sideMenus = [
  { label: "공지사항", href: "/news/notice" },
  { label: "주요행사", href: "/news/events" },
  { label: "동창회보", href: "/news/newsletter" },
  { label: "동문보도", href: "/news/press" },
  { label: "포토 갤러리", href: "/news/gallery" },
];

const galleries = [
  { title: "제33대 김종우 총동창회장 취임식", date: "2026.01.27", count: 24, emoji: "🎉" },
  { title: "2025 인하 가족의 밤", date: "2025.12.04", count: 48, emoji: "🌟" },
  { title: "2025 총동창회장배 골프대회", date: "2025.05.26", count: 36, emoji: "⛳" },
  { title: "비룡제 격려 방문", date: "2025.05.16", count: 12, emoji: "🎓" },
  { title: "명예회장단 월례회", date: "2025.04.21", count: 8, emoji: "📋" },
  { title: "인하대 개교 71주년 기념식", date: "2025.04.24", count: 20, emoji: "🏛️" },
  { title: "ROTC동문회 현충원 참배", date: "2025.06.01", count: 16, emoji: "🎖️" },
  { title: "120ROTC산악회 안나푸르나", date: "2025.10.15", count: 32, emoji: "🏔️" },
  { title: "2024 인하 가족의 밤", date: "2024.12.05", count: 52, emoji: "✨" },
  { title: "2024 총동창회장배 골프대회", date: "2024.05.20", count: 40, emoji: "⛳" },
  { title: "인하대 개교 70주년 기념행사", date: "2024.04.24", count: 60, emoji: "🎊" },
  { title: "인맥회(기계과) 회장 이취임식", date: "2025.03.07", count: 10, emoji: "🏅" },
];

export default function GalleryPage() {
  return (
    <SubPageLayout
      breadcrumbs={[{ label: "총동창회 소식", href: "/news/notice" }, { label: "포토 갤러리" }]}
      sideMenus={sideMenus}
      currentPath="/news/gallery"
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#003876]">포토 갤러리</h1>
          <p className="text-sm text-gray-400 mt-1">총동창회 주요 행사 사진</p>
        </div>

        <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleries.map((item) => (
            <div key={item.title} className="group cursor-pointer">
              <div className="aspect-video bg-linear-to-br from-[#E8F0FE] to-[#003876]/10 rounded-xl flex flex-col items-center justify-center mb-2 group-hover:from-[#003876]/10 group-hover:to-[#003876]/20 transition-all relative overflow-hidden">
                <span className="text-4xl mb-1">{item.emoji}</span>
                <span className="text-xs text-[#003876]/60 font-medium">사진 {item.count}장</span>
                <div className="absolute inset-0 bg-[#003876] opacity-0 group-hover:opacity-5 transition-opacity" />
              </div>
              <p className="text-xs font-medium text-gray-700 truncate">{item.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.date}</p>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">실제 사진은 순차적으로 업로드됩니다. 문의: inha@inhain.com</p>
        </div>
      </div>
    </SubPageLayout>
  );
}
