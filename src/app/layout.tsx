import type { Metadata } from "next";
import { DM_Sans, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto-sans-sc",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GoPick AI - 帮你挑出最值得用的 AI 工具",
    template: "%s | GoPick AI",
  },
  description: "不做最全的，只做最适合你的。每个工具都经过真实测评，帮全球华人挑出最值得用的 AI 工具。",
  keywords: ["AI工具", "AI工具推荐", "AI写作", "AI绘图", "AI视频", "人工智能工具"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${notoSansSC.variable} font-sans antialiased bg-bg text-text`}
      >
        <GoogleAnalytics />
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
