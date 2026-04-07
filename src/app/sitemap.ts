import { MetadataRoute } from "next";
import { getAllTools, getPublishedArticles } from "@/lib/data";
import matcherJson from "../../data/matcher.json";
import type { MatcherData, MatcherBudget } from "@/lib/types";
import { SCENE_MAP } from "@/lib/constants";

const BASE_URL = "https://gopick.ai";
const matcherData = matcherJson as MatcherData;

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = getAllTools();
  const articles = getPublishedArticles();

  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/workflows`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/for/ecommerce`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/for/video-creator`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/for/podcaster`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/for/writer`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/for/student`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/for/developer`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  // 工具详情页
  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: new Date(tool.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 文章详情页
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/blog/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 品类对比页
  const comparePages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...Object.values(SCENE_MAP).map((info) => ({
      url: `${BASE_URL}/compare/${info.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  // 工作流页面（动态生成）
  const workflowPages: MetadataRoute.Sitemap = [];
  const ALL_BUDGETS: MatcherBudget[] = ["free", "paid", "cn-free"];
  for (const identity of matcherData.identities) {
    for (const pp of identity.painpoints) {
      for (const budget of ALL_BUDGETS) {
        if (pp.workflows[budget]) {
          workflowPages.push({
            url: `${BASE_URL}/workflows/${identity.id}/${pp.id}/${budget}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
          });
        }
      }
    }
  }

  return [...staticPages, ...comparePages, ...toolPages, ...articlePages, ...workflowPages];
}
