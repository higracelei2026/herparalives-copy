import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "她的平行人生",
  description: "不替你选择人生，陪你把每种人生多走一段。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
