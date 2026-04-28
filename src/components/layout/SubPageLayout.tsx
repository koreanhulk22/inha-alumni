import Link from "next/link";
import { GNB } from "./GNB";
import { Footer } from "./Footer";

interface SideMenu {
  label: string;
  href: string;
}

interface Breadcrumb {
  label: string;
  href?: string;
}

interface Props {
  breadcrumbs: Breadcrumb[];
  sideMenus: SideMenu[];
  currentPath: string;
  children: React.ReactNode;
}

export function SubPageLayout({ breadcrumbs, sideMenus, currentPath, children }: Props) {
  return (
    <div className="min-h-screen flex flex-col font-[Pretendard,system-ui,sans-serif]">
      <GNB />
      <main className="flex-1 bg-gray-50">
        {/* 브레드크럼 */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-[#003876]">홈</Link>
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span>›</span>
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-[#003876]">{crumb.label}</Link>
                  ) : (
                    <span className="text-[#003876] font-medium">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* 사이드 메뉴 */}
            <aside className="hidden md:block w-48 shrink-0">
              <nav className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {sideMenus.map((menu) => (
                  <Link
                    key={menu.href}
                    href={menu.href}
                    className={`block px-4 py-3 text-sm border-b border-gray-100 last:border-0 transition-colors ${
                      currentPath === menu.href
                        ? "bg-[#003876] text-white font-semibold"
                        : "text-gray-600 hover:bg-[#E8F0FE] hover:text-[#003876]"
                    }`}
                  >
                    {menu.label}
                  </Link>
                ))}
              </nav>
            </aside>

            {/* 콘텐츠 */}
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
