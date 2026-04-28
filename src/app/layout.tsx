import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "인하대학교 총동창회",
    template: "%s | 인하대학교 총동창회",
  },
  description: "인하대학교 총동창회 공식 홈페이지 — 친목공영, 모교후원, 후진육영",
  keywords: ["인하대학교", "총동창회", "인하", "동문", "inhain"],
  openGraph: {
    title: "인하대학교 총동창회",
    description: "인하대학교 총동창회 공식 홈페이지",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://inha-alumni.vercel.app",
    siteName: "인하대학교 총동창회",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
