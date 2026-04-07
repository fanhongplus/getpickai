"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ScenarioMatcher from "./ScenarioMatcher";

type Phase = 1 | 2 | 3 | 4 | 5;

const STORAGE_KEY = "gopick_hero_played_v1";

function HeroSearchBox() {
  return (
    <div className="w-full max-w-xl mx-auto">
      <Link href="/tools" className="block">
        <div className="flex items-center h-11 bg-bg border border-border rounded-card px-4 hover:border-accent/40 transition-colors cursor-pointer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted mr-3 flex-shrink-0">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="text-text-muted text-xs sm:text-sm">
            或直接搜索工具名…
          </span>
        </div>
      </Link>
    </div>
  );
}

function HeroHotTags() {
  const tags = [
    { label: "AI写作", scene: "写文案" },
    { label: "AI绘图", scene: "画图片" },
    { label: "AI视频", scene: "做视频" },
    { label: "免费工具", scene: "" },
    { label: "效率提升", scene: "提效率" },
  ];
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-3">
      {tags.map((tag) => (
        <Link
          key={tag.label}
          href={tag.scene ? `/tools?scene=${encodeURIComponent(tag.scene)}` : "/tools?price=free"}
          className="text-xs px-3 py-1 rounded-full bg-bg-muted text-text-secondary hover:bg-accent/10 hover:text-accent transition-colors"
        >
          {tag.label}
        </Link>
      ))}
    </div>
  );
}

export default function AnimatedHero() {
  const [phase, setPhase] = useState<Phase>(1);
  const [skipAnimation, setSkipAnimation] = useState(false);

  useEffect(() => {
    // 检查是否已播放过 / 是否需要降级动画
    const alreadyPlayed = typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1";
    const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (alreadyPlayed || reduceMotion) {
      setSkipAnimation(true);
      setPhase(5);
      return;
    }

    const timers = [
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2000),
      setTimeout(() => setPhase(4), 2500),
      setTimeout(() => setPhase(5), 3000),
      setTimeout(() => {
        try {
          sessionStorage.setItem(STORAGE_KEY, "1");
        } catch {}
      }, 3100),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section className="relative pt-24 pb-12 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* 动画区域 - 固定高度避免抖动 */}
        <div className="relative min-h-[140px] sm:min-h-[160px] flex items-center justify-center mb-6">
          {/* 阶段1: 质疑 */}
          {!skipAnimation && phase === 1 && (
            <div className="text-center zx-fade-in">
              <div className="text-5xl sm:text-6xl mb-3">😒</div>
              <p className="text-lg sm:text-xl text-text-secondary">
                AI 工具那么多，真的有用吗？
              </p>
            </div>
          )}

          {/* 阶段2: 淡出 */}
          {!skipAnimation && phase === 2 && (
            <div className="text-center zx-fade-out">
              <div className="text-5xl sm:text-6xl mb-3">😒</div>
              <p className="text-lg sm:text-xl text-text-secondary">
                AI 工具那么多，真的有用吗？
              </p>
            </div>
          )}

          {/* 阶段3: 表情反转 */}
          {!skipAnimation && phase === 3 && (
            <div className="text-center">
              <div className="relative inline-block">
                <div className="text-6xl sm:text-7xl zx-bounce-in">🤩</div>
                {/* 星星粒子 */}
                <span className="zx-sparkle-burst zx-sparkle-a absolute -top-2 -left-3 text-xl">✨</span>
                <span className="zx-sparkle-burst zx-sparkle-b absolute -top-3 right-0 text-lg">✨</span>
                <span className="zx-sparkle-burst zx-sparkle-c absolute -bottom-2 -right-4 text-xl">✨</span>
              </div>
            </div>
          )}

          {/* 阶段4 + 5: 表情定格 + 真香文字 */}
          {(phase === 4 || phase === 5) && (
            <div className="text-center w-full">
              <div className="text-6xl sm:text-7xl mb-3">🤩</div>
              <p className="text-2xl sm:text-3xl font-bold text-accent zx-slide-up">
                用过才知道，真香！
              </p>
            </div>
          )}
        </div>

        {/* 阶段5: 副标题 + 匹配器 + 搜索框 */}
        {phase === 5 && (
          <div className={skipAnimation ? "" : "zx-slide-up-delayed"}>
            {/* 副标题 */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-text leading-heading">
                AI 工具那么多，到底哪个值得用？
              </h1>
              <p className="mt-3 text-text-secondary text-base sm:text-lg">
                告诉我们你要做什么，30 秒给你一套实战工作流
              </p>
            </div>

            {/* 匹配器（已嵌入 Hero，不再需要内部标题） */}
            <ScenarioMatcher hideHeader />

            {/* 搜索框（辅助入口） */}
            <div className="mt-10 text-center">
              <HeroSearchBox />
              <HeroHotTags />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
