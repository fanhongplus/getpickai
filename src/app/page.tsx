import Image from "next/image";
import Link from "next/link";
import { getPublishedArticles, getFeaturedTools } from "@/lib/data";
import { ArticleCard } from "@/components/ArticleCard";
import AnimatedHero from "@/components/AnimatedHero";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const featuredTools = getFeaturedTools();
  const articles = getPublishedArticles();

  return (
    <div className="animate-fade-in">
      {/* 第一屏：动画 Hero + 匹配器 */}
      <AnimatedHero />

      {/* 人群入口：找到适合你的AI工具箱 */}
      <section className="py-section px-4 bg-bg-soft">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-text text-center leading-heading">
            找到适合你的 AI 工具箱
          </h2>
          <p className="mt-2 text-text-secondary text-center text-sm">
            按你的身份，获取定制化的工具推荐方案
          </p>
          <div className="mt-section-title grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "🛒", title: "跨境电商卖家", desc: "从选品到投流，AI 全链路提效", href: "/for/ecommerce" },
              { icon: "🎬", title: "视频创作者", desc: "选题、脚本、剪辑、配音一站式", href: "/for/video-creator" },
              { icon: "🎙️", title: "播客主", desc: "录制、剪辑、二创、推广全流程", href: "/for/podcaster" },
              { icon: "✍️", title: "图文博主", desc: "SEO 长文、小红书、Newsletter", href: "/for/writer" },
              { icon: "🎓", title: "留学生", desc: "写论文、做 PPT、练口语好搭档", href: "/for/student" },
              { icon: "💻", title: "独立开发者", desc: "AI 编程、前端生成、快速建站", href: "/for/developer" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="card-hover bg-bg border border-border rounded-card p-6 h-full hover:border-accent/30 cursor-pointer">
                  <div className="text-[48px] mb-3">{item.icon}</div>
                  <h3 className="text-lg font-bold text-text">{item.title}</h3>
                  <p className="text-sm text-text-secondary mt-1">{item.desc}</p>
                  <span className="inline-block mt-4 text-sm text-accent font-medium">
                    查看工具箱 &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI 变现工作流 */}
      <section className="py-section px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-text text-center leading-heading">
            用 AI 赚钱的实战指南
          </h2>
          <p className="mt-2 text-text-secondary text-center text-sm max-w-2xl mx-auto">
            不是教你用工具，是教你用工具赚钱。每套方案都附带成本核算和可复制的 Prompt。
          </p>
          <div className="mt-section-title space-y-4 max-w-3xl mx-auto">
            {/* 工作流卡片1 - 已发布 */}
            <Link href="/blog/ai-side-hustle-guide">
              <div className="card-hover flex border border-border rounded-card overflow-hidden hover:bg-accent/5 cursor-pointer">
                <div className="w-1 bg-accent flex-shrink-0" />
                <div className="flex-1 p-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-text text-base">AI副业变现：5种不需要技术基础的赚钱方式</h3>
                    <p className="text-sm text-text-secondary mt-1">每种方式都附带工具推荐和上手教程</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-tag bg-tag-video/10 text-tag-video flex-shrink-0 whitespace-nowrap">
                    🔥 热门
                  </span>
                </div>
              </div>
            </Link>
            {/* 工作流卡片2 - 即将发布 */}
            <div className="flex border border-border rounded-card overflow-hidden opacity-60">
              <div className="w-1 bg-text-muted flex-shrink-0" />
              <div className="flex-1 p-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-text text-base">全自动YouTube频道：从选题到发布的完整工作流</h3>
                  <p className="text-sm text-text-secondary mt-1">工具月费$45，预估月收益$500-2000</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-tag bg-bg-muted text-text-muted flex-shrink-0 whitespace-nowrap">
                  即将发布
                </span>
              </div>
            </div>
          </div>
          <div className="text-center mt-6">
            <Link href="/workflows" className="text-sm text-accent hover:text-accent-hover font-medium transition-colors">
              查看全部工作流 &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 编辑精选 */}
      <section className="py-section px-4 bg-bg-soft">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-text text-center leading-heading">
            本周编辑精选
          </h2>
          <p className="mt-2 text-text-secondary text-center text-sm">
            我们亲自试过，真心推荐
          </p>
          <div className="mt-section-title grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredTools.map((tool) => (
              <div key={tool.slug} className="card-hover bg-bg border border-border rounded-card p-6 hover:border-accent/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-logo overflow-hidden bg-bg-muted flex-shrink-0">
                    <Image
                      src={tool.logo}
                      alt={tool.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text">{tool.name}</h3>
                    <span className="text-xs text-text-muted">{tool.priceLabel}</span>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-body line-clamp-3">
                  {tool.editorReview.split("\n")[0]}
                </p>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="inline-block mt-4 text-sm text-accent hover:text-accent-hover font-medium transition-colors"
                >
                  查看详情 &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 最新内容 */}
      {articles.length > 0 && (
        <section className="py-section px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-text text-center leading-heading">
              最新测评
            </h2>
            <div className="mt-section-title grid grid-cols-1 md:grid-cols-3 gap-5">
              {articles.slice(0, 3).map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 底部 CTA：邮箱订阅 */}
      <section className="py-section px-4 bg-bg-soft">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-text leading-heading">
            每周收到 AI 工具精选推荐
          </h2>
          <p className="mt-2 text-text-secondary text-sm">
            加入我们的早期读者，第一时间获取最新 AI 工具测评
          </p>
          <div className="mt-6 flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="输入你的邮箱"
              className="flex-1 h-11 px-4 rounded-btn border border-border bg-bg text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
            />
            <button className="h-11 px-6 bg-accent text-white text-sm font-medium rounded-btn hover:bg-accent-hover transition-colors">
              订阅
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
