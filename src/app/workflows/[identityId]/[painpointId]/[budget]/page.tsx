import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import BackButton from "@/components/BackButton";
import ShareButton from "@/components/ShareButton";
import matcherData from "../../../../../../data/matcher.json";
import type { MatcherData, MatcherBudget } from "@/lib/types";

const data = matcherData as MatcherData;

const BUDGET_LABELS: Record<string, string> = {
  free: "免费方案",
  paid: "付费方案",
  "cn-free": "🇨🇳 中文免费方案",
};

const ALL_BUDGETS: MatcherBudget[] = ["free", "paid", "cn-free"];

interface PageProps {
  params: {
    identityId: string;
    painpointId: string;
    budget: string;
  };
}

// ===== 静态生成所有工作流页面 =====
export function generateStaticParams() {
  const params: { identityId: string; painpointId: string; budget: string }[] = [];
  for (const identity of data.identities) {
    for (const pp of identity.painpoints) {
      for (const budget of ALL_BUDGETS) {
        if (pp.workflows[budget]) {
          params.push({
            identityId: identity.id,
            painpointId: pp.id,
            budget,
          });
        }
      }
    }
  }
  return params;
}

// ===== SEO metadata =====
export function generateMetadata({ params }: PageProps): Metadata {
  const { identityId, painpointId, budget } = params;

  const identity = data.identities.find((i) => i.id === identityId);
  const painpoint = identity?.painpoints.find((p) => p.id === painpointId);
  const workflow = painpoint?.workflows[budget as MatcherBudget];

  if (!identity || !painpoint || !workflow) return { title: "工作流未找到" };

  const toolNames = workflow.tools.map((t) => t.name).join("、");
  const budgetLabel = BUDGET_LABELS[budget] || budget;

  return {
    title: `${painpoint.label}｜${budgetLabel} AI 工作流 — ${identity.label} | GoPick AI`,
    description: `${workflow.title}。包含 ${toolNames}，完整步骤指南。适合${identity.label}的 AI 实战工作流推荐。`,
  };
}

// ===== 页面组件 =====
export default function WorkflowPage({ params }: PageProps) {
  const { identityId, painpointId, budget } = params;

  const identity = data.identities.find((i) => i.id === identityId);
  if (!identity) return notFound();

  const painpoint = identity.painpoints.find((p) => p.id === painpointId);
  if (!painpoint) return notFound();

  const workflow = painpoint.workflows[budget as MatcherBudget];
  if (!workflow) return notFound();

  const budgetLabel = BUDGET_LABELS[budget] || budget;

  // 其他预算方案
  const otherBudgets = ALL_BUDGETS.filter(
    (b) => b !== budget && painpoint.workflows[b]
  );

  const stepLabels = ["第一步", "第二步", "第三步"];

  return (
    <div className="animate-fade-in pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <BackButton />

        {/* 面包屑导航 */}
        <nav className="text-xs sm:text-sm text-text-secondary mb-6 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-accent transition-colors">
            首页
          </Link>
          <span className="text-text-muted">›</span>
          <Link
            href={`/for/${identityId}`}
            className="hover:text-accent transition-colors"
          >
            {identity.icon} {identity.label}
          </Link>
          <span className="text-text-muted">›</span>
          <span className="text-text-muted">{painpoint.label}</span>
          <span className="text-text-muted">›</span>
          <span className="text-accent font-medium">{budgetLabel}</span>
        </nav>

        {/* 标题区 */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs text-accent bg-accent/10 px-3 py-1 rounded-full mb-4">
            <span>✨ 为你推荐的工作流</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text leading-heading mb-3">
            {workflow.title}
          </h1>
          <p className="text-text-secondary text-sm sm:text-base">
            {identity.icon} {identity.label} · {painpoint.label} · {budgetLabel}
          </p>
        </div>

        {/* 工具步骤卡片 */}
        <div className="space-y-0 mb-12">
          {workflow.tools.map((tool, idx) => {
            const stepLabel = stepLabels[idx] || `第${idx + 1}步`;
            const isLast = idx === workflow.tools.length - 1;
            return (
              <div key={`${tool.slug}-${idx}`}>
                <div className="bg-bg-soft border border-border rounded-card p-5 hover:border-accent/40 transition-colors flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* 左侧：步骤标签 + 工具名 + 描述 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-accent text-white whitespace-nowrap flex-shrink-0">
                        {stepLabel}
                      </span>
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="font-semibold text-text hover:text-accent transition-colors"
                      >
                        {tool.name}
                      </Link>
                    </div>
                    <p className="text-sm text-text-secondary leading-body">
                      {tool.step}
                    </p>
                  </div>
                  {/* 右侧：费用 + 按钮 */}
                  <div className="flex flex-col sm:items-end gap-2 sm:flex-shrink-0">
                    <span className="text-xs px-2 py-0.5 rounded-tag bg-accent/10 text-accent self-start sm:self-end">
                      {tool.cost}
                    </span>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-accent text-white hover:opacity-90 transition-opacity w-full sm:w-auto justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                      了解详情
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
                {/* 连接箭头 */}
                {!isLast && (
                  <div className="flex justify-center py-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-accent/40"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <polyline points="19 12 12 19 5 12" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 深度攻略文章 */}
        {workflow.articleSlug && (
          <section className="border-t border-border pt-8 mb-8">
            <h2 className="text-lg font-bold text-text mb-4 leading-heading">
              📖 深度攻略
            </h2>
            <Link
              href={`/blog/${workflow.articleSlug}`}
              className="card-hover block bg-accent/5 border border-accent/20 rounded-card p-5 hover:border-accent/50"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-text-secondary mb-1">GoPick 编辑部实战文章</p>
                  <p className="font-semibold text-text">查看完整教程和使用技巧</p>
                </div>
                <span className="text-sm text-accent font-medium flex-shrink-0">
                  阅读文章 →
                </span>
              </div>
            </Link>
          </section>
        )}

        {/* 其他预算方案 */}
        {otherBudgets.length > 0 && (
          <section className="border-t border-border pt-8 mb-8">
            <h2 className="text-lg font-bold text-text mb-4 leading-heading">
              查看其他预算方案
            </h2>
            <div className="flex flex-wrap gap-3">
              {otherBudgets.map((b) => (
                <Link
                  key={b}
                  href={`/workflows/${identityId}/${painpointId}/${b}`}
                  className="px-4 py-2 rounded-btn border border-border text-sm text-text hover:border-accent hover:text-accent transition-colors"
                >
                  {BUDGET_LABELS[b]}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 分享按钮 */}
        <section className="border-t border-border pt-8">
          <h2 className="text-lg font-bold text-text mb-4 leading-heading">
            分享给朋友
          </h2>
          <ShareButton />
        </section>
      </div>
    </div>
  );
}
