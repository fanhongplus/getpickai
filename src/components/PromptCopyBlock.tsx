"use client";

import { useState } from "react";

interface PromptCopyBlockProps {
  title?: string;
  prompt: string;
}

export function PromptCopyBlock({ title = "最佳 Prompt", prompt }: PromptCopyBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = prompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="bg-bg-muted dark:bg-[#1e2235] border border-border rounded-[12px] overflow-hidden">
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-medium text-text">
          💡 {title}
        </span>
        <button
          onClick={handleCopy}
          className={`min-w-[44px] min-h-[44px] flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-medium transition-colors ${
            copied
              ? "bg-price-free/10 text-price-free"
              : "bg-bg hover:bg-accent/10 text-text-secondary hover:text-accent border border-border"
          }`}
        >
          {copied ? (
            <>已复制 ✓</>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              复制
            </>
          )}
        </button>
      </div>
      {/* 内容区 */}
      <div className="px-4 py-3 overflow-x-auto">
        <pre className="text-sm text-text-secondary leading-body whitespace-pre-wrap break-words font-mono">
          {prompt}
        </pre>
      </div>
    </div>
  );
}
