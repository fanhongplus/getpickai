import { Metadata } from "next";
import { ForPage } from "@/components/ForPage";

export const metadata: Metadata = {
  title: "图文博主 AI 工具箱",
  description: "SEO 长文、小红书种草、Newsletter，AI 帮你高效输出优质内容。",
};

export default function WriterPage() {
  return (
    <ForPage
      icon="✍️"
      title="图文博主 AI 工具箱"
      subtitle="SEO 长文、小红书种草、Newsletter，AI 帮你高效输出优质内容"
      tools={[
        { slug: "chatgpt", usage: "长文撰写和多平台文案生成，全能型 AI 助手" },
        { slug: "claude", usage: "爆文分析和内容策略规划，写作风格最自然" },
        { slug: "writesonic", usage: "SEO 优化的 AI 长文写作，性价比之选" },
        { slug: "surfer-seo", usage: "实时检测文章 SEO 评分，发布前优化关键词" },
        { slug: "ubersuggest", usage: "免费关键词研究和竞争分析，SEO 入门首选" },
        { slug: "grammarly", usage: "英文语法润色和可读性优化，写英文必装" },
        { slug: "canva", usage: "小红书配图和 Newsletter 头图，零基础出专业设计" },
        { slug: "getresponse", usage: "Newsletter 自动化发送和 A/B 测试" },
      ]}
      workflowTeaser={{
        title: "图文博主全流程工作流 —— 即将发布",
        desc: "Ubersuggest 选词 → Writesonic AI 写长文 → Surfer SEO 优化评分 → GetResponse 自动发送 Newsletter",
      }}
    />
  );
}
