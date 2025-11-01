import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next";
import Header from "@/components/header";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_DOMAIN = process.env.SITE_DOMAIN || "https://recoron.example.com";
const SITE_TITLE = "ReCoron — 安価で使える Cron Job as a Service";
const SITE_DESCRIPTION =
  "ReCoronはダッシュボードとAPIでcronジョブを簡単に登録・管理できる、開発者向けの低コストなスケジューリングサービスです。Webhook、HTTPエンドポイント、柔軟な通知をサポートします。";
const SITE_OG_IMAGE = `${SITE_DOMAIN}/og-image.png`;
const SITE_TWITTER = "@ReCoron_io";

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: "%s | ReCoron",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "cron",
    "cron job",
    "スケジュール",
    "スケジューリング",
    "スケジュール管理",
    "ReCoron",
    "cron as a service",
    "API",
    "Webhook",
    "低コスト",
    "サーバーレス",
    "自動化",
  ],
  authors: [{ name: "ReCoron", url: SITE_DOMAIN }],
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_DOMAIN,
    siteName: "ReCoron",
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "ReCoron — Cron as a Service",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
    creator: SITE_TWITTER,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      nocache: false,
    },
  },
  alternates: {
    canonical: SITE_DOMAIN,
    languages: {
      ja: "/",
      "en-US": "/en",
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        {children}
      </body>

      <Analytics />
    </html>
  );
}