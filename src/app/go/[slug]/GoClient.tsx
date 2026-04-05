"use client";

import { useEffect } from "react";
import { trackAffiliateClick } from "@/components/GoogleAnalytics";

interface GoClientProps {
  slug: string;
  toolName: string;
  affiliateUrl: string;
}

export function GoClient({ slug, toolName, affiliateUrl }: GoClientProps) {
  useEffect(() => {
    if (affiliateUrl) {
      // GA4 追踪
      trackAffiliateClick(slug, toolName);

      // 1.5 秒后跳转
      setTimeout(() => {
        window.location.href = affiliateUrl;
      }, 1500);
    }
  }, [slug, toolName, affiliateUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-text mb-2">
          Go<span className="text-accent">Pick</span> AI
        </div>
        <div className="mt-6">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">
            正在为你跳转至 <span className="font-medium text-text">{toolName || "..."}</span> 官网...
          </p>
        </div>
        {affiliateUrl && (
          <p className="mt-4 text-xs text-text-muted">
            如未自动跳转，请{" "}
            <a href={affiliateUrl} className="text-accent underline">
              点击这里
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
