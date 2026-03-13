import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Valuey AI Command Center",
  description: "AI Agency Dashboard — Manage your agent team from one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark">
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
