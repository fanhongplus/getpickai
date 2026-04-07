import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import BackButton from "@/components/BackButton";
import { getAllTools } from "@/lib/data";
import { SCENE_MAP, SCENE_SLUG_TO_CN } from "@/lib/constants";
import matcherJson from "../../../../data/matcher.json";
import type { MatcherData, MatcherBudget } from "@/lib/types";

const matcherData = matcherJson as MatcherData;

interface Props {
  params: { scene: string };
}

export function generateStaticParams() {
  return Object.values(SCENE_MAP).map((info) => ({ scene: info.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const sceneCn = SCENE_SLUG_TO_CN[params.scene];
  if (!sceneCn) return { title: "品类未找到" };
  const info = SCENE_MAP[sceneCn];
  const tools = getAllTools().filter((t) => t.scenes?.includes(sceneCn));
  return {
    title: `${info.title}：${tools.length} 款深度对比 | GoPick AI`,
    description: `GoPick 编辑部精选 ${tools.length} 款${info.label}工具深度对比，标注哪些已进入实战工作流。帮你找到最值得用的那个。`,
  };
}

// 预算显示名
const BUDGET_LABELS: Record<string, string> = {
  free: "免费方案",
  paid: "付费方案",
  "cn-free": "🇨🇳 中文免费",
};

// 从 matcher.json 找出哪些工具在工作流中，并记录它们出现的工作流
function indexMatcher() {
  const toolToWorkflows: Record<
    string,
    { identityId: string; painpointId: string; budget: MatcherBudget; identityLabel: string; identityIcon: string; painpointLabel: string }[]
  > = {};
  const sceneRelatedWorkflows: Record<
    string,
    { identityId: string; painpointId: string; budget: MatcherBudget; identityLabel: string; identityIcon: string; painpointLabel: string; toolSlugs: string[] }[]
  > = {};

  for (const identity of matcherData.identities) {
    for (const pp of identity.painpoints) {
      const allBudgets: MatcherBudget[] = ["free", "paid", "cn-free"];
      for (const budget of allBudgets) {
        const wf = pp.workflows[budget];
        if (!wf) continue;
        const entry = {
          identityId: identity.id,
          painpointId: pp.id,
          budget,
          identityLabel: identity.label,
          identityIcon: identity.icon,
          painpointLabel: pp.label,
        };
        for (const tool of wf.tools) {
          if (!toolToWorkflows[tool.slug]) toolToWorkflows[tool.slug] = [];
          toolToWorkflows[tool.slug].push(entry);
        }
      }
    }
  }

  return { toolToWorkflows, sceneRelatedWorkflows };
}

export default function CompareScenePage({ params }: Props) {
  const sceneCn = SCENE_SLUG_TO_CN[params.scene];
  if (!sceneCn) return notFound();
  const info = SCENE_MAP[sceneCn];

  const allTools = getAllTools();
  const sceneTools = allTools.filter((t) => t.scenes?.includes(sceneCn));
  if (sceneTools.length === 0) return notFound();

  // 扫描 matcher 关联
  const { toolToWorkflows } = indexMatcher();

  // 精选 vs 其他
  const featured = sceneTools.filter((t) => toolToWorkflows[t.slug]);
  const others = sceneTools.filter((t) => !toolToWorkflows[t.slug]);

  // 按评分排序
  featured.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  others.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  // 相关工作流（该场景下精选工具引用的所有工作流，去重）
  const workflowKeys = new Set<string>();
  const relatedWorkflows: {
    identityId: string;
    painpointId: string;
    budget: MatcherBudget;
    identityLabel: string;
    identityIcon: string;
    painpointLabel: string;
  }[] = [];
  for (const tool of featured) {
    const wfs = toolToWorkflows[tool.slug] || [];
    for (const wf of wfs) {
      const key = `${wf.identityId}|${wf.painpointId}`;
      if (!workflowKeys.has(key)) {
        workflowKeys.add(key);
        relatedWorkflows.push(wf);
      }
    }
  }

  return (
    <div className="animate-fade-in pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <BackButton />

        {/* 面包屑 */}
        <nav className="text-xs sm:text-sm text-text-secondary mb-6 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-accent transition-colors">首页</Link>
          <span className="text-text-muted">›</span>
          <Link href="/compare" className="hover:text-accent transition-colors">工具横评</Link>
          <span className="text-text-muted">›</span>
          <span className="text-accent font-medium">{info.label}</span>
        </nav>

        {/* 标题区 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-4xl">{info.icon}</div>
            <h1 className="text-2xl md:text-3xl font-bold text-text leading-heading">
              {info.title}：{sceneTools.length} 款深度对比
            </h1>
          </div>
          <p className="text-text-secondary text-sm md:text-base">
            GoPick 编辑部从 {sceneTools.length} 款工具中精选 {featured.length} 款进入实战工作流推荐
          </p>
          <p className="text-text-muted text-xs mt-2">最近更新：2026 年 4 月</p>
        </div>

        {/* ⭐ GoPick 精选 */}
        {featured.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-bold text-text leading-heading">
                ⭐ GoPick 精选推荐
              </h2>
              <span className="text-xs text-text-muted">（已编入实战工作流）</span>
            </div>
            <div className="space-y-4">
              {featured.map((tool) => {
                const wfs = toolToWorkflows[tool.slug] || [];
                const uniqueWfs = Array.from(
                  new Map(wfs.map((w) => [`${w.identityId}|${w.painpointId}`, w])).values()
                );
                return (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="card-hover block bg-bg border border-border rounded-card p-5 hover:border-accent/40"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-logo overflow-hidden bg-bg-muted flex-shrink-0">
                        <Image src={tool.logo} alt={tool.name} width={48} height={48} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-text">{tool.name}</h3>
                          {tool.rating && (
                            <span className="text-xs text-text-muted">⭐ {tool.rating}</span>
                          )}
                          <span className="text-xs text-text-muted">· {tool.priceLabel}</span>
                        </div>
                        <p className="text-sm text-text-secondary line-clamp-2 mb-2">{tool.tagline}</p>
                        {/* 入选工作流 */}
                        <div className="flex flex-wrap gap-1.5">
                          {uniqueWfs.slice(0, 3).map((w, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] px-2 py-0.5 rounded-tag bg-accent/10 text-accent"
                            >
                              {w.identityIcon} {w.painpointLabel}
                            </span>
                          ))}
                          {uniqueWfs.length > 3 && (
                            <span className="text-[11px] text-text-muted">+{uniqueWfs.length - 3}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-accent font-medium flex-shrink-0 mt-1">查看详情 →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 📋 相关实战工作流 */}
        {relatedWorkflows.length > 0 && (
          <section className="mb-14 bg-bg-soft border border-border rounded-card p-6">
            <h2 className="text-xl font-bold text-text leading-heading mb-4">
              📋 相关实战工作流
            </h2>
            <p className="text-sm text-text-secondary mb-4">
              GoPick 编辑部用这些工具拼装的实战工作流，直接点开即可查看完整步骤
            </p>
            <div className="space-y-3">
              {relatedWorkflows.slice(0, 6).map((w, idx) => {
                const identity = matcherData.identities.find((i) => i.id === w.identityId)!;
                const painpoint = identity.painpoints.find((p) => p.id === w.painpointId)!;
                const availBudgets: MatcherBudget[] = (["free", "paid", "cn-free"] as const).filter(
                  (b) => painpoint.workflows[b]
                );
                return (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2">
                    <div className="text-sm text-text">
                      <span className="font-semibold">{w.identityIcon} {w.identityLabel}</span>
                      <span className="text-text-muted"> → </span>
                      <span>{w.painpointLabel}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availBudgets.map((b) => (
                        <Link
                          key={b}
                          href={`/workflows/${w.identityId}/${w.painpointId}/${b}`}
                          className="text-xs px-2.5 py-1 rounded-btn border border-border text-text hover:border-accent hover:text-accent transition-colors"
                        >
                          {BUDGET_LABELS[b]}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 其他同类工具 */}
        {others.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-text leading-heading mb-2">
              其他同类工具
            </h2>
            <p className="text-sm text-text-muted mb-4">
              未进入工作流推荐，但品质达到 GoPick 收录标准
            </p>
            <div className="flex flex-wrap gap-2">
              {others.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="text-sm px-3 py-1.5 rounded-btn border border-border text-text-secondary hover:border-accent hover:text-accent transition-colors"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
