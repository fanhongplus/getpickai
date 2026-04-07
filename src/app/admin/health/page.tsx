import type { Metadata } from "next";
import Link from "next/link";
import { getAllTools } from "@/lib/data";
import matcherJson from "../../../../data/matcher.json";
import type { MatcherData } from "@/lib/types";

const matcherData = matcherJson as MatcherData;

export const metadata: Metadata = {
  title: "GoPick 工具健康巡检",
  description: "内部工具：扫描全站工具健康状态",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

function daysSince(dateStr?: string): number {
  if (!dateStr) return 9999;
  const then = new Date(dateStr);
  const now = new Date("2026-04-07");
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}

export default function HealthPage() {
  const tools = getAllTools();

  // 匹配器中使用的工具
  const usedSlugs = new Set<string>();
  for (const identity of matcherData.identities) {
    for (const pp of identity.painpoints) {
      for (const budget of ["free", "paid", "cn-free"] as const) {
        const wf = pp.workflows[budget];
        if (!wf) continue;
        for (const tool of wf.tools) usedSlugs.add(tool.slug);
      }
    }
  }

  // 状态分类
  const deprecated = tools.filter((t) => t.healthStatus === "deprecated");
  const watch = tools.filter((t) => t.healthStatus === "watch");
  const active = tools.filter((t) => (t.healthStatus || "active") === "active");

  // 超过 90 天未巡检（仅 active）
  const stale = active
    .filter((t) => daysSince(t.lastVerified) > 90)
    .sort((a, b) => daysSince(b.lastVerified) - daysSince(a.lastVerified));

  // 断链检测：deprecated 但仍在 matcher 中
  const brokenLinks = deprecated.filter((t) => usedSlugs.has(t.slug));

  // 平均巡检间隔
  const verifiedCount = tools.filter((t) => t.lastVerified).length;
  const avgDays = Math.round(
    tools.reduce((sum, t) => sum + (t.lastVerified ? daysSince(t.lastVerified) : 0), 0) / Math.max(verifiedCount, 1)
  );

  const matcherCoverage = Math.round((usedSlugs.size / tools.length) * 1000) / 10;

  return (
    <div className="animate-fade-in pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="text-xs text-text-muted mb-2">INTERNAL TOOL · 不对外收录</div>
          <h1 className="text-3xl font-bold text-text leading-heading mb-2">
            🔍 GoPick 工具健康巡检报告
          </h1>
          <p className="text-text-secondary text-sm">基准日期：2026-04-07</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="总工具数" value={tools.length} />
          <StatCard label="匹配器覆盖" value={`${usedSlugs.size} (${matcherCoverage}%)`} />
          <StatCard label="观察中" value={watch.length} color="text-tag-video" />
          <StatCard label="已下架" value={deprecated.length} color="text-price-paid" />
        </div>

        {/* 断链警告 */}
        {brokenLinks.length > 0 && (
          <section className="mb-10 p-5 rounded-card border border-tag-video/40 bg-tag-video/5">
            <h2 className="text-lg font-bold text-text mb-3">
              ❌ 断链警告（{brokenLinks.length}）
            </h2>
            <p className="text-sm text-text-secondary mb-3">
              以下工具已标记为 deprecated，但仍被 matcher.json 工作流引用，需要替换：
            </p>
            <ul className="space-y-1">
              {brokenLinks.map((t) => (
                <li key={t.slug} className="text-sm">
                  <Link href={`/tools/${t.slug}`} className="text-accent hover:underline">
                    {t.name}
                  </Link>
                  <span className="text-text-muted ml-2">({t.slug})</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 🔴 需要关注 */}
        {stale.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-text mb-4 leading-heading">
              🔴 需要关注（超过 90 天未巡检，{stale.length} 个）
            </h2>
            <div className="space-y-2">
              {stale.slice(0, 30).map((t) => (
                <div key={t.slug} className="flex items-center justify-between py-2 border-b border-border">
                  <Link href={`/tools/${t.slug}`} className="text-sm text-text hover:text-accent">
                    {t.name}
                  </Link>
                  <span className="text-xs text-text-muted">
                    上次巡检: {t.lastVerified || "未知"} ({daysSince(t.lastVerified)} 天前)
                  </span>
                </div>
              ))}
              {stale.length > 30 && (
                <p className="text-xs text-text-muted text-center mt-3">
                  还有 {stale.length - 30} 个...
                </p>
              )}
            </div>
          </section>
        )}

        {/* 🟡 观察中 */}
        {watch.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-text mb-4 leading-heading">
              🟡 观察中（{watch.length} 个）
            </h2>
            <div className="space-y-2">
              {watch.map((t) => (
                <div key={t.slug} className="flex items-center justify-between py-2 border-b border-border">
                  <Link href={`/tools/${t.slug}`} className="text-sm text-text hover:text-accent">
                    {t.name}
                  </Link>
                  <span className="text-xs text-text-muted">{t.slug}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 🟢 健康 */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-text mb-4 leading-heading">
            🟢 健康（{active.length - stale.length} 个，最近 90 天内巡检过）
          </h2>
          <p className="text-sm text-text-muted">
            平均巡检间隔：{avgDays} 天
          </p>
        </section>

        {/* 📊 汇总 */}
        <section className="p-5 bg-bg-soft border border-border rounded-card">
          <h2 className="text-lg font-bold text-text mb-3">📊 统计汇总</h2>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>总工具数：{tools.length}</li>
            <li>活跃：{active.length} | 观察中：{watch.length} | 已下架：{deprecated.length}</li>
            <li>匹配器覆盖：{usedSlugs.size} ({matcherCoverage}%)</li>
            <li>未进入匹配器：{tools.length - usedSlugs.size}</li>
            <li>平均巡检间隔：{avgDays} 天</li>
            <li className={brokenLinks.length > 0 ? "text-tag-video font-semibold" : "text-price-free"}>
              断链工作流：{brokenLinks.length}
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, color = "text-text" }: { label: string; value: number | string; color?: string }) {
  return (
    <div className="p-4 bg-bg-soft border border-border rounded-card">
      <div className="text-xs text-text-muted mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
