"use client";

import Script from "next/script";

const GA_ID = "G-FL1QXN78S3";

export function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}

// 追踪 Affiliate 点击事件
export function trackAffiliateClick(toolSlug: string, toolName: string) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "affiliate_click", {
      tool_slug: toolSlug,
      tool_name: toolName,
    });
  }
}
