import { getAllArticles } from "@/lib/data";
import { ArticleCard } from "@/components/ArticleCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "博客 - AI 工具测评与教程",
  description: "深度 AI 工具测评、对比文章和使用教程，帮你做出更好的选择。",
};

export default function BlogPage() {
  const articles = getAllArticles();

  return (
    <div className="animate-fade-in pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-text leading-heading">博客</h1>
          <p className="mt-2 text-text-secondary">
            深度测评、对比文章和使用教程
          </p>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-muted text-lg">文章正在路上...</p>
          </div>
        )}
      </div>
    </div>
  );
}
