import Image from "next/image";
import Link from "next/link";
import { getAllArticles, getFeaturedTools } from "@/lib/data";
import { scenes } from "@/lib/constants";
import { ArticleCard } from "@/components/ArticleCard";

// 搜索框组件（首页用）
function SearchBox() {
  return (
    <div className="w-full max-w-xl mx-auto">
      <Link href="/tools" className="block">
        <div className="flex items-center h-[52px] bg-bg border border-border rounded-card px-4 hover:border-accent/40 transition-colors cursor-pointer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted mr-3 flex-shrink-0">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="text-text-muted text-sm">
            输入你想做的事，比如「写英文邮件」「生成产品图」...
          </span>
        </div>
      </Link>
    </div>
  );
}

// 热门标签
function HotTags() {
  const tags = [
    { label: "AI写作", scene: "写文案" },
    { label: "AI绘图", scene: "画图片" },
    { label: "AI视频", scene: "做视频" },
    { label: "免费工具", scene: "" },
    { label: "效率提升", scene: "提效率" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {tags.map((tag) => (
        <Link
          key={tag.label}
          href={tag.scene ? `/tools?scene=${encodeURIComponent(tag.scene)}` : "/tools?price=free"}
          className="text-xs px-3 py-1.5 rounded-full bg-bg-muted text-text-secondary hover:bg-accent/10 hover:text-accent transition-colors"
        >
          {tag.label}
        </Link>
      ))}
    </div>
  );
}

export default function HomePage() {
  const featuredTools = getFeaturedTools();
  const articles = getAllArticles();

  return (
    <div className="animate-fade-in">
      {/* Hero 区域 */}
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-text leading-heading">
            帮你挑出最值得用的 AI 工具
          </h1>
          <p className="mt-4 text-text-secondary text-lg">
            不做最全的，只做最适合你的。每个工具都经过真实测评。
          </p>
          <div className="mt-8">
            <SearchBox />
            <HotTags />
          </div>
        </div>
      </section>

      {/* 场景导航：你想用 AI 做什么？ */}
      <section className="py-section px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-text text-center leading-heading">
            你想用 AI 做什么？
          </h2>
          <p className="mt-2 text-text-secondary text-center text-sm">
            按你的需求找到最适合的工具
          </p>
          <div className="mt-section-title grid grid-cols-2 md:grid-cols-4 gap-4">
            {scenes.map((scene) => (
              <Link
                key={scene.id}
                href={`/tools?scene=${encodeURIComponent(scene.id)}`}
                className="card-hover bg-bg border border-border rounded-card p-5 text-center hover:border-accent/30"
              >
                <div className="text-3xl mb-2">{scene.icon}</div>
                <div className="font-medium text-text text-sm">{scene.name}</div>
                <div className="text-xs text-text-muted mt-1">{scene.description}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 人群入口：找到适合你的AI工具箱 */}
      <section className="py-section px-4 bg-bg-soft">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-text text-center leading-heading">
            找到适合你的 AI 工具箱
          </h2>
          <p className="mt-2 text-text-secondary text-center text-sm">
            按你的身份，获取定制化的工具推荐方案
          </p>
          <div className="mt-section-title grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: "🛒", title: "跨境电商卖家", desc: "从选品到投流，AI帮你全链路提效", href: "/for/ecommerce" },
              { icon: "🎬", title: "自媒体创作者", desc: "从选题到发布，一个人就是一支团队", href: "/for/creator" },
              { icon: "🎓", title: "留学生", desc: "写论文、做PPT、练口语，AI是你的学霸搭档", href: "/for/student" },
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
