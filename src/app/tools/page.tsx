"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Tool } from "@/lib/types";
import { ToolCard } from "@/components/ToolCard";

// 场景列表
const sceneFilters = ["全部", "写文案", "做视频", "画图片", "写代码", "做PPT", "提效率", "学语言", "做音乐", "做设计", "做营销"];
const priceFilters = ["全部", "免费", "免费试用", "付费"];

function ToolsContent() {
  const searchParams = useSearchParams();
  const initialScene = searchParams.get("scene") || "全部";
  const initialPrice = searchParams.get("price") || "全部";

  const [tools, setTools] = useState<Tool[]>([]);
  const [activeScene, setActiveScene] = useState(initialScene);
  const [activePrice, setActivePrice] = useState(initialPrice === "free" ? "免费" : initialPrice);
  const [searchQuery, setSearchQuery] = useState("");

  // 客户端获取工具数据
  useEffect(() => {
    fetch("/api/tools")
      .then((res) => res.json())
      .then((data) => setTools(data));
  }, []);

  // 筛选逻辑
  const filteredTools = tools.filter((tool) => {
    const matchScene = activeScene === "全部" || tool.scenes.includes(activeScene);
    const matchPrice =
      activePrice === "全部" ||
      (activePrice === "免费" && tool.pricingType === "free") ||
      (activePrice === "免费试用" && tool.pricingType === "freemium") ||
      (activePrice === "付费" && tool.pricingType === "paid");
    const matchSearch =
      !searchQuery ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tagline.includes(searchQuery) ||
      tool.scenes.some((s) => s.includes(searchQuery));
    return matchScene && matchPrice && matchSearch;
  });

  return (
    <div className="animate-fade-in pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text leading-heading">AI 工具库</h1>
          <p className="mt-2 text-text-secondary">
            每个工具都经过我们的真实测评
          </p>
        </div>

        {/* 搜索框 */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="flex items-center h-[52px] bg-bg border border-border rounded-card px-4 focus-within:border-accent transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted mr-3 flex-shrink-0">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索工具名称或功能..."
              className="flex-1 bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
            />
          </div>
        </div>

        {/* 场景筛选 */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {sceneFilters.map((scene) => (
              <button
                key={scene}
                onClick={() => setActiveScene(scene)}
                className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
                  activeScene === scene
                    ? "bg-accent text-white"
                    : "bg-bg-muted text-text-secondary hover:text-text"
                }`}
              >
                {scene}
              </button>
            ))}
          </div>
        </div>

        {/* 价格筛选 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {priceFilters.map((price) => (
              <button
                key={price}
                onClick={() => setActivePrice(price)}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${
                  activePrice === price
                    ? "bg-primary text-white dark:bg-white dark:text-primary"
                    : "bg-bg-muted text-text-muted hover:text-text-secondary"
                }`}
              >
                {price}
              </button>
            ))}
          </div>
        </div>

        {/* 工具网格 */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-muted text-lg">暂无匹配的工具</p>
            <p className="text-text-muted text-sm mt-2">试试其他筛选条件</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<div className="pt-24 text-center text-text-muted">加载中...</div>}>
      <ToolsContent />
    </Suspense>
  );
}
