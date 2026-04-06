"use client";

import { useState, useEffect } from "react";

export function ZhenXiangModule() {
  const [phase, setPhase] = useState<"doubt" | "flip" | "wow">("doubt");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    function cycle() {
      // 1. 显示怀疑脸
      setPhase("doubt");

      timer = setTimeout(() => {
        // 2. 1秒后翻转
        setPhase("flip");

        timer = setTimeout(() => {
          // 3. 翻转动画 600ms 后进入 wow
          setPhase("wow");

          timer = setTimeout(() => {
            // 4. 停留3秒后重新开始
            cycle();
          }, 3000);
        }, 600);
      }, 1000);
    }

    cycle();
    return () => clearTimeout(timer);
  }, []);

  const isWow = phase === "wow";
  const isFlipping = phase === "flip";

  return (
    <div className="zx-module relative flex flex-col items-center justify-center">
      {/* 背景光晕 */}
      <div className="absolute inset-0 -m-8 rounded-[28px] pointer-events-none">
        <div
          className="absolute inset-0 rounded-[28px] transition-opacity duration-700"
          style={{
            background: "radial-gradient(ellipse at center, rgba(79,110,247,0.12) 0%, rgba(79,110,247,0) 70%)",
            opacity: isWow ? 1 : 0.3,
          }}
        />
      </div>

      {/* 主卡片 */}
      <div className="relative z-10 w-52 md:w-60 rounded-[20px] bg-bg border border-border p-6 md:p-8 flex flex-col items-center shadow-lg">
        {/* Emoji 容器（翻转动画） */}
        <div
          className="transition-transform duration-500 ease-in-out"
          style={{
            transform: isFlipping ? "rotateY(90deg) scale(0.8)" : "rotateY(0deg) scale(1)",
            perspective: "600px",
          }}
        >
          <span className="block text-[80px] md:text-[100px] leading-none select-none">
            {isWow ? "🤩" : "😒"}
          </span>
        </div>

        {/* 文字标签 */}
        <div className="mt-3 h-8 flex items-center justify-center overflow-hidden">
          <span
            className="text-lg md:text-xl font-bold transition-all duration-400"
            style={{
              color: isWow ? "#4f6ef7" : undefined,
              opacity: isFlipping ? 0 : 1,
              transform: isFlipping ? "translateY(8px)" : "translateY(0)",
            }}
          >
            {isWow ? "\u201C真香！\u201D" : "\u201C这能行？\u201D"}
          </span>
        </div>

        {/* 星星散射（真香状态才显示） */}
        {isWow && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[20px]">
            <span className="zx-sparkle zx-sparkle-1 absolute text-sm">✨</span>
            <span className="zx-sparkle zx-sparkle-2 absolute text-xs">✨</span>
            <span className="zx-sparkle zx-sparkle-3 absolute text-sm">✨</span>
            <span className="zx-sparkle zx-sparkle-4 absolute text-xs">✨</span>
            <span className="zx-sparkle zx-sparkle-5 absolute text-sm">✨</span>
            <span className="zx-sparkle zx-sparkle-6 absolute text-xs">✨</span>
          </div>
        )}
      </div>

      {/* 底部文案 */}
      <p
        className="relative z-10 mt-5 text-sm text-text-secondary transition-all duration-500"
        style={{
          opacity: isWow ? 1 : 0,
          transform: isWow ? "translateY(0)" : "translateY(12px)",
        }}
      >
        用过才知道，真香~
      </p>
    </div>
  );
}