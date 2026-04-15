import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MAPIN",
  description: "내가 본 콘텐츠를 분석하고 추천받으세요",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="min-h-full bg-gray-100">
        {children}
      </body>
    </html>
  );
}
