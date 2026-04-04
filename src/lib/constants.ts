import { Scene } from "./types";

// 场景列表
export const scenes: Scene[] = [
  { id: "写文案", name: "写文案", icon: "✍️", description: "AI 帮你写出高转化文案" },
  { id: "做视频", name: "做视频", icon: "🎬", description: "用 AI 快速生成视频内容" },
  { id: "画图片", name: "画图片", icon: "🎨", description: "AI 绘图和图片生成" },
  { id: "写代码", name: "写代码", icon: "💻", description: "AI 辅助编程提升效率" },
  { id: "做PPT", name: "做PPT", icon: "📊", description: "AI 一键生成演示文稿" },
  { id: "学语言", name: "学语言", icon: "🌍", description: "AI 语言学习助手" },
  { id: "做音乐", name: "做音乐", icon: "🎵", description: "AI 音乐和音频创作" },
  { id: "提效率", name: "提效率", icon: "⚡", description: "AI 工具提升工作效率" },
];

// 场景标签颜色映射（纯前端可用，不依赖 fs）
export const sceneColorMap: Record<string, string> = {
  "写文案": "bg-tag-write/10 text-tag-write",
  "做营销": "bg-tag-marketing/10 text-tag-marketing",
  "写博客": "bg-tag-write/10 text-tag-write",
  "做视频": "bg-tag-video/10 text-tag-video",
  "画图片": "bg-tag-image/10 text-tag-image",
  "写代码": "bg-tag-code/10 text-tag-code",
  "做PPT": "bg-tag-productivity/10 text-tag-productivity",
  "学语言": "bg-tag-language/10 text-tag-language",
  "做音乐": "bg-tag-voice/10 text-tag-voice",
  "提效率": "bg-tag-productivity/10 text-tag-productivity",
  "做设计": "bg-tag-design/10 text-tag-design",
};

// 价格类型颜色映射
export const priceColorMap: Record<string, { bg: string; text: string; label: string }> = {
  free: { bg: "bg-price-free/10", text: "text-price-free", label: "免费" },
  freemium: { bg: "bg-price-trial/10", text: "text-price-trial", label: "免费试用" },
  paid: { bg: "bg-price-paid/10", text: "text-price-paid", label: "付费" },
};
