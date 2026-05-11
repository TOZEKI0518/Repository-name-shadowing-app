import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "English Shadowing",
  description: "English shadowing app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}