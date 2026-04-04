import fs from "fs";
import path from "path";
import { Tool, Article } from "./types";

// 服务端专用：读取工具数据
const toolsDir = path.join(process.cwd(), "data/tools");

export function getAllTools(): Tool[] {
  if (!fs.existsSync(toolsDir)) return [];
  const files = fs.readdirSync(toolsDir).filter((f) => f.endsWith(".json"));
  return files
    .map((file) => {
      const content = fs.readFileSync(path.join(toolsDir, file), "utf-8");
      return JSON.parse(content) as Tool;
    })
    .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
}

export function getToolBySlug(slug: string): Tool | undefined {
  const filePath = path.join(toolsDir, `${slug}.json`);
  if (!fs.existsSync(filePath)) return undefined;
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content) as Tool;
}

export function getFeaturedTools(): Tool[] {
  return getAllTools().filter((t) => t.isFeatured);
}

export function getToolsByScene(scene: string): Tool[] {
  return getAllTools().filter((t) => t.scenes.includes(scene));
}

// 服务端专用：读取文章数据
const articlesDir = path.join(process.cwd(), "data/articles");

export function getAllArticles(): Article[] {
  if (!fs.existsSync(articlesDir)) return [];
  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".json"));
  return files
    .map((file) => {
      const content = fs.readFileSync(path.join(articlesDir, file), "utf-8");
      return JSON.parse(content) as Article;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getArticleBySlug(slug: string): Article | undefined {
  const filePath = path.join(articlesDir, `${slug}.json`);
  if (!fs.existsSync(filePath)) return undefined;
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content) as Article;
}
