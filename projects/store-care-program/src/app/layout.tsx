import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import { TopBar } from "@/components/layout/TopBar";
import { APP_NAME } from "@/lib/th";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Store Care Program — store follow-up, issue tracking, closure.",
};

// Every page is per-user and auth-gated; nothing benefits from static rendering.
// Forcing dynamic also avoids a stale prerender from the build environment (which
// has no Supabase env) once the app is deployed with real config.
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${notoSansThai.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TopBar />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
