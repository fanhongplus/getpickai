import Link from "next/link";
import matcherJson from "../../data/matcher.json";
import type { MatcherData, MatcherBudget } from "@/lib/types";
import { SCENE_MAP } from "@/lib/constants";

const matcherData = matcherJson as MatcherData;

const BUDGET_LABELS: Record<string, string> = {
  free: "免费方案",
  paid: "付费方案",
  "cn-free": "🇨🇳 中文免费",
};

interface ToolWorkflowsProps {
  toolSlug: string;
  toolScenes: string[];
}

interface WorkflowRef {
  identityId: string;
  painpointId: string;
  budget: MatcherBudget;
  identityLabel: string;
  identityIcon: string;
  painpointLabel: string;
  title: string;
  toolSlugs: string[];
}

function scanWorkflows(toolSlug: string, toolScenes: string[]): {
  mode: "direct" | "related" | "none";
  workflows: WorkflowRef[];
  sceneSlug: string | null;
  sceneLabel: string | null;
} {
  const allBudgets: MatcherBudget[] = ["free", "paid", "cn-free"];
  const direct: WorkflowRef[] = [];

  for (const identity of matcherData.identities) {
    for (const pp of identity.painpoints) {
      for (const budget of allBudgets) {
        const wf = pp.workflows[budget];
        if (!wf) continue;
        const entry: WorkflowRef = {
          identityId: identity.id,
          painpointId: pp.id,
          budget,
          identityLabel: identity.label,
          identityIcon: identity.icon,
          painpointLabel: pp.label,
          title: wf.title,
          toolSlugs: wf.tools.map((t) => t.slug),
        };

        if (wf.tools.some((t) => t.slug === toolSlug)) {
          direct.push(entry);
        }
      }
    }
  }

  if (direct.length > 0) {
    return { mode: "direct", workflows: direct, sceneSlug: null, sceneLabel: null };
  }

  // 模式 B：没有直接引用，找同类场景的工作流
  // 取当前工具第一个在 SCENE_MAP 中的 scene 作为定位
  let primaryScene: string | null = null;
  for (const s of toolScenes) {
    if (SCENE_MAP[s]) {
      primaryScene = s;
      break;
    }
  }
  if (!primaryScene) {
    return { mode: "none", workflows: [], sceneSlug: null, sceneLabel: null };
  }

  // 找到所有工具 json 中属于该 scene 的 slug
  // 由于这是服务端组件，直接扫描工具库代价较高
  // 改用：扫描 matcher 中所有工作流，如果工作流有任意一个工具的 slug 出现在该 scene 的其他工具中，即视为同类
  // 简化：只要工作流里有任意一个工具拥有相同的 scene，就算同类工作流
  // 这里无法直接查到其它工具的 scenes（组件是 server component，可以读 data/tools，但简化起见用一个启发式）
  // 更简单：从 matcher 所有工作流里，找工作流 title/tools 中提及该 scene 关键词 — 太宽
  // 最干净的办法：把同场景的工具 slug 集合预先算出来
  return { mode: "none", workflows: [], sceneSlug: SCENE_MAP[primaryScene].slug, sceneLabel: SCENE_MAP[primaryScene].label };
}

export default function ToolWorkflows({ toolSlug, toolScenes }: ToolWorkflowsProps) {
  const { mode, workflows, sceneSlug, sceneLabel } = scanWorkflows(toolSlug, toolScenes);

  // 模式 A：工具直接在 matcher 中
  if (mode === "direct" && workflows.length > 0) {
    const displayed = workflows.slice(0, 6);
    return (
      <section className="mt-12 pt-8 border-t border-border">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-text leading-heading">
            📋 这个工具出现在以下 GoPick 工作流中
          </h2>
        </div>
        <div className="space-y-3">
          {displayed.map((wf, idx) => {
            const stepIdx = wf.toolSlugs.indexOf(toolSlug);
            const stepLabels = ["第一步", "第二步", "第三步", "第四步"];
            const stepLabel = stepLabels[stepIdx] || `第${stepIdx + 1}步`;
            return (
              <Link
                key={idx}
                href={`/workflows/${wf.identityId}/${wf.painpointId}/${wf.budget}`}
                className="card-hover block bg-bg-soft border border-border rounded-card p-4 hover:border-accent/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-text-muted mb-1">
                      {wf.identityIcon} {wf.identityLabel} · {wf.painpointLabel} · {BUDGET_LABELS[wf.budget]}
                    </div>
                    <div className="text-sm text-text font-medium">
                      {wf.title}
                    </div>
                    <div className="text-xs text-accent mt-1">
                      {stepLabel}：你在这里
                    </div>
                  </div>
                  <span className="text-xs text-accent font-medium flex-shrink-0 sm:ml-4">
                    查看完整工作流 →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        {workflows.length > 6 && (
          <p className="text-xs text-text-muted text-center mt-4">
            共出现在 {workflows.length} 条工作流中
          </p>
        )}
      </section>
    );
  }

  // 模式 B：没有直接引用，但属于已知场景 → 引导到品类对比页
  if (sceneSlug && sceneLabel) {
    return (
      <section className="mt-12 pt-8 border-t border-border">
        <h2 className="text-xl font-bold text-text leading-heading mb-4">
          📋 同类{sceneLabel}工具的推荐工作流
        </h2>
        <div className="bg-bg-soft border border-border rounded-card p-6">
          <p className="text-sm text-text-secondary mb-4">
            这个工具暂未进入 GoPick 的实战工作流推荐，但品质达到收录标准。
            查看 GoPick 编辑部从同类{sceneLabel}工具中精选的完整工作流：
          </p>
          <Link
            href={`/compare/${sceneSlug}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-accent text-white hover:opacity-90 transition-opacity"
          >
            查看全部{sceneLabel}工具横评 →
          </Link>
        </div>
      </section>
    );
  }

  // 模式 C：什么都没有，不渲染
  return null;
}
