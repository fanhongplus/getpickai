import Link from "next/link";
import { Article } from "@/lib/types";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/blog/${article.slug}`}>
      <div className="card-hover bg-bg border border-border rounded-card overflow-hidden h-full flex flex-col cursor-pointer hover:border-accent/30">
        {/* 封面图占位 */}
        {article.coverImage ? (
          <div className="h-40 overflow-hidden">
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="h-40 bg-bg-muted flex items-center justify-center">
            <span className="text-3xl">{article.category === "排行榜" ? "🏆" : article.category === "教程" ? "📖" : article.category === "工作流" ? "💰" : "📝"}</span>
          </div>
        )}

        {/* 内容 */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-accent bg-accent-bg px-2 py-0.5 rounded-tag">
              GoPick AI
            </span>
            <span className="text-xs text-text-muted">{article.readTime}</span>
          </div>
          <h3 className="font-semibold text-text text-base leading-heading line-clamp-2 mb-2">
            {article.title}
          </h3>
          <p className="text-sm text-text-secondary line-clamp-2 mt-auto">
            {article.excerpt}
          </p>
        </div>
      </div>
    </Link>
  );
}
