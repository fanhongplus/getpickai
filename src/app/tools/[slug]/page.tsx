import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getToolBySlug, getAllTools } from "@/lib/data";
import { sceneColorMap, priceColorMap } from "@/lib/constants";
import { ToolCard } from "@/components/ToolCard";

interface Props {
  params: { slug: string };
}

// 静态路径生成
export async function generateStaticParams() {
  const tools = getAllTools();
  return tools.map((tool) => ({ slug: tool.slug }));
}

// 动态 metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);
  if (!tool) return { title: "工具未找到" };
  return {
    title: `${tool.name} - ${tool.tagline}`,
    description: tool.editorReview.slice(0, 160),
  };
}

export default function ToolDetailPage({ params }: Props) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  const priceInfo = priceColorMap[tool.pricingType] || priceColorMap.paid;
  const allTools = getAllTools();
  const relatedTools = tool.relatedTools
    .map((slug) => allTools.find((t) => t.slug === slug))
    .filter(Boolean);

  return (
    <div className="animate-fade-in pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* 顶部信息栏 */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10 pb-8 border-b border-border">
          <div className="w-16 h-16 rounded-logo overflow-hidden bg-bg-muted flex-shrink-0">
            <Image src={tool.logo} alt={tool.name} width={64} height={64} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-text leading-heading">{tool.name}</h1>
            <p className="text-text-secondary mt-1">{tool.tagline}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="text-sm text-text-muted flex items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {tool.rating}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-tag ${priceInfo.bg} ${priceInfo.text}`}>
                {tool.priceLabel}
              </span>
              {tool.scenes.map((scene) => (
                <span key={scene} className={`text-xs px-2 py-0.5 rounded-tag ${sceneColorMap[scene] || "bg-bg-muted text-text-secondary"}`}>
                  {scene}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0">
            <Link
              href={`/go/${tool.slug}`}
              className="inline-flex items-center gap-2 h-11 px-6 bg-accent text-white font-medium rounded-btn hover:bg-accent-hover transition-colors text-sm"
            >
              立即试用 &rarr;
            </Link>
          </div>
        </div>

        {/* 编辑点评 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-text mb-4 leading-heading">我们的看法</h2>
          <div className="bg-bg-soft rounded-card p-6">
            {tool.editorReview.split("\n").filter(Boolean).map((para, i) => (
              <p key={i} className="text-text-secondary leading-body mb-4 last:mb-0">
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* 适合谁 / 不适合谁 */}
        <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-bg border border-border rounded-card p-5">
            <h3 className="font-semibold text-text mb-3 flex items-center gap-2">
              <span className="text-price-free">&#x2705;</span> 适合
            </h3>
            <ul className="space-y-2">
              {tool.goodFor.map((item) => (
                <li key={item} className="text-sm text-text-secondary">{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-bg border border-border rounded-card p-5">
            <h3 className="font-semibold text-text mb-3 flex items-center gap-2">
              <span className="text-red-500">&#x274C;</span> 不适合
            </h3>
            <ul className="space-y-2">
              {tool.notGoodFor.map((item) => (
                <li key={item} className="text-sm text-text-secondary">{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* 优缺点 */}
        <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <h3 className="font-semibold text-text mb-3">优点</h3>
            <ul className="space-y-2">
              {tool.pros.map((pro) => (
                <li key={pro} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-price-free mt-0.5 flex-shrink-0">&#x2713;</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-text mb-3">缺点</h3>
            <ul className="space-y-2">
              {tool.cons.map((con) => (
                <li key={con} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-red-500 mt-0.5 flex-shrink-0">&#x2717;</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 价格方案 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-text mb-4 leading-heading">价格方案</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tool.pricingPlans.map((plan) => (
              <div key={plan.name} className="bg-bg border border-border rounded-card p-5">
                <h4 className="font-semibold text-text">{plan.name}</h4>
                <p className="text-xl font-bold text-accent mt-1">{plan.price}</p>
                <ul className="mt-3 space-y-1.5">
                  {plan.features.map((f) => (
                    <li key={f} className="text-sm text-text-secondary flex items-center gap-1.5">
                      <span className="text-text-muted">·</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 快速上手 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-text mb-4 leading-heading">快速上手</h2>
          <div className="bg-bg-soft rounded-card p-6">
            <ol className="space-y-3">
              {tool.quickStart.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                  <span className="w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 同类推荐 */}
        {relatedTools.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-text mb-4 leading-heading">类似工具</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedTools.map((t) => t && <ToolCard key={t.slug} tool={t} />)}
            </div>
          </section>
        )}

        {/* 底部 CTA */}
        <div className="text-center py-8 border-t border-border">
          <Link
            href={`/go/${tool.slug}`}
            className="inline-flex items-center gap-2 h-12 px-8 bg-accent text-white font-medium rounded-btn hover:bg-accent-hover transition-colors"
          >
            立即试用 {tool.name} &rarr;
          </Link>
        </div>

        {/* Affiliate 声明 */}
        <p className="text-xs text-text-muted text-center mt-4">
          本页面含推广链接。当您通过链接购买时，我们可能获得佣金。这不影响我们的评测客观性。
        </p>
      </div>
    </div>
  );
}
