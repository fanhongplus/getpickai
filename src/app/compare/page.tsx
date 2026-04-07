import { Metadata } from "next";
import Link from "next/link";
import { getAllTools } from "@/lib/data";
import { SCENE_MAP } from "@/lib/constants";
import BackButton from "@/components/BackButton";

export const metadata: Metadata = {
  title: "AI 工具横评 | GoPick AI",
  description:
    "GoPick 编辑部深度对比，158 款 AI 工具按品类分组，帮你找到最值得用的那个。AI 写作、绘图、视频、编程、效率工具全品类对比。",
};

export default function CompareIndexPage() {
  const tools = getAllTools();

  // 统计每个 scene 的工具数
  const sceneCount: Record<string, number> = {};
  for (const tool of tools) {
    for (const s of tool.scenes || []) {
      sceneCount[s] = (sceneCount[s] || 0) + 1;
    }
  }

  // 按数量倒序排列，只展示 SCENE_MAP 里有映射的
  const categories = Object.entries(SCENE_MAP)
    .map(([cn, info]) => ({ cn, ...info, count: sceneCount[cn] || 0 }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="animate-fade-in pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <BackButton />

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs text-accent bg-accent/10 px-3 py-1 rounded-full mb-4">
            <span>🔬 编辑部横评</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text leading-heading mb-3">
            AI 工具横评
          </h1>
          <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto">
            GoPick 编辑部深度对比，{tools.length} 款 AI 工具按品类分组，
            <br className="hidden sm:block" />
            帮你找到最值得用的那个。
          </p>
        </div>

        {/* 品类卡片网格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/compare/${cat.slug}`}
              className="card-hover bg-bg border border-border rounded-card p-5 hover:border-accent/40 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="text-3xl">{cat.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-text">{cat.label}</div>
                  <div className="text-xs text-text-muted mt-0.5">
                    {cat.count} 款工具
                  </div>
                </div>
              </div>
              <div className="text-xs text-accent font-medium mt-3">
                查看横评 →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
