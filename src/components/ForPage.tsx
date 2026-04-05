import Link from "next/link";
import Image from "next/image";
import { getToolBySlug } from "@/lib/data";

interface ToolRec {
  slug: string;
  usage: string; // 这个工具对该人群的用途描述
}

interface ForPageProps {
  icon: string;
  title: string;
  subtitle: string;
  tools: ToolRec[];
  workflowTeaser?: {
    title: string;
    desc: string;
  };
}

export function ForPage({ icon, title, subtitle, tools, workflowTeaser }: ForPageProps) {
  const toolsData = tools
    .map((t) => ({ ...t, tool: getToolBySlug(t.slug) }))
    .filter((t) => t.tool);

  return (
    <div className="animate-fade-in pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 页面头部 */}
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">{icon}</div>
          <h1 className="text-2xl md:text-3xl font-bold text-text leading-heading">{title}</h1>
          <p className="mt-2 text-text-secondary text-lg">{subtitle}</p>
        </div>

        {/* 推荐工具列表 */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-text mb-6 leading-heading">推荐工具</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {toolsData.map(({ slug, usage, tool }) =>
              tool ? (
                <Link key={slug} href={`/tools/${slug}`}>
                  <div className="card-hover bg-bg border border-border rounded-card p-5 h-full hover:border-accent/30 cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-logo overflow-hidden bg-bg-muted flex-shrink-0">
                        <Image src={tool.logo} alt={tool.name} width={40} height={40} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text text-sm">{tool.name}</h3>
                        <span className="text-xs text-text-muted">{tool.priceLabel}</span>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary">{usage}</p>
                    <span className="inline-block mt-3 text-xs text-accent font-medium">查看详情 &rarr;</span>
                  </div>
                </Link>
              ) : null
            )}
          </div>
        </section>

        {/* 相关文章（占位） */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-text mb-4 leading-heading">相关教程</h2>
          <div className="bg-bg-soft rounded-card p-8 text-center">
            <p className="text-text-muted">更多专属教程即将上线，敬请期待</p>
          </div>
        </section>

        {/* 工作流预告 */}
        {workflowTeaser && (
          <section className="mb-12">
            <div className="bg-bg-soft border border-border rounded-card p-6 text-center">
              <h3 className="font-bold text-text">{workflowTeaser.title}</h3>
              <p className="text-sm text-text-muted mt-1">{workflowTeaser.desc}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
