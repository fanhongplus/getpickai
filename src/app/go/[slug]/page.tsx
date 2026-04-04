"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { trackAffiliateClick } from "@/components/GoogleAnalytics";

export default function GoPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [toolName, setToolName] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  useEffect(() => {
    // 获取工具信息
    fetch("/api/tools")
      .then((res) => res.json())
      .then((tools) => {
        const tool = tools.find((t: { slug: string }) => t.slug === slug);
        if (tool) {
          setToolName(tool.name);
          setRedirectUrl(tool.affiliateUrl);

          // GA4 追踪 Affiliate 点击
          trackAffiliateClick(slug, tool.name);

          // 记录点击（发送到 API）
          fetch("/api/click", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tool_slug: slug,
              timestamp: new Date().toISOString(),
              referrer: document.referrer,
            }),
          }).catch(() => {
            // 静默处理错误
          });

          // 1.5 秒后跳转
          setTimeout(() => {
            window.location.href = tool.affiliateUrl;
          }, 1500);
        }
      });
  }, [slug]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-text mb-2">
          Get<span className="text-accent">Pick</span>AI
        </div>
        <div className="mt-6">
          {/* 加载动画 */}
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">
            正在为你跳转至 <span className="font-medium text-text">{toolName || "..."}</span> 官网...
          </p>
        </div>
        {redirectUrl && (
          <p className="mt-4 text-xs text-text-muted">
            如未自动跳转，请{" "}
            <a href={redirectUrl} className="text-accent underline">
              点击这里
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
