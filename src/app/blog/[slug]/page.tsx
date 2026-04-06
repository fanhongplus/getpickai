import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { getArticleBySlug, getPublishedArticles, getAllTools, isArticlePublished } from "@/lib/data";
import { ToolCard } from "@/components/ToolCard";
import { ArticleCard } from "@/components/ArticleCard";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  if (!article || !isArticlePublished(article)) return { title: "文章未找到" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default function ArticleDetailPage({ params }: Props) {
  const article = getArticleBySlug(params.slug);
  if (!article || !isArticlePublished(article)) notFound();

  const allTools = getAllTools();
  const allArticles = getPublishedArticles();
  const relatedTools = article.relatedTools
    .map((slug) => allTools.find((t) => t.slug === slug))
    .filter(Boolean);
  const relatedArticles = article.relatedArticles
    .map((slug) => allArticles.find((a) => a.slug === slug))
    .filter(Boolean);

  return (
    <div className="animate-fade-in pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 文章头部 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 text-sm text-text-muted">
            <span className="text-xs text-accent bg-accent-bg px-2 py-0.5 rounded-tag">
              {article.category}
            </span>
            <span>{article.publishedAt}</span>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-text leading-heading">
            {article.title}
          </h1>
          <p className="mt-3 text-text-secondary text-lg">{article.excerpt}</p>
        </div>

        {/* 封面图 */}
        {article.coverImage ? (
          <div className="rounded-card overflow-hidden mb-10">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-auto"
            />
          </div>
        ) : (
          <div className="h-48 md:h-64 bg-bg-muted rounded-card flex items-center justify-center mb-10">
            <span className="text-5xl">{article.category === "排行榜" ? "🏆" : article.category === "教程" ? "📖" : "📝"}</span>
          </div>
        )}

        {/* 文章正文 */}
        <div
          className="prose-custom mb-12"
          dangerouslySetInnerHTML={{ __html: article.content }}
          style={{
            lineHeight: "1.8",
          }}
        />

        {/* 相关工具推荐 */}
        {relatedTools.length > 0 && (
          <section className="mb-10 pt-8 border-t border-border">
            <h2 className="text-xl font-bold text-text mb-4 leading-heading">文中提到的工具</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedTools.map((t) => t && <ToolCard key={t.slug} tool={t} />)}
            </div>
          </section>
        )}

        {/* 相关文章 */}
        {relatedArticles.length > 0 && (
          <section className="mb-10 pt-8 border-t border-border">
            <h2 className="text-xl font-bold text-text mb-4 leading-heading">相关阅读</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedArticles.map((a) => a && <ArticleCard key={a.slug} article={a} />)}
            </div>
          </section>
        )}

        <div className="text-center pt-6">
          <Link href="/blog" className="text-sm text-accent hover:text-accent-hover transition-colors">
            &larr; 返回AI攻略
          </Link>
        </div>
      </div>
    </div>
  );
}
