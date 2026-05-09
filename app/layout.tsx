import "./globals.css";

export const metadata = {
  title: "English Shadowing",
  description: "English Shadowing App",
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