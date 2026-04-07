import { Metadata } from "next";
import { ForPage } from "@/components/ForPage";

export const metadata: Metadata = {
  title: "独立开发者 AI 工具箱",
  description: "AI 辅助编程、前端生成、应用搭建、快速建站，一套工具搞定。",
};

export default function DeveloperPage() {
  return (
    <ForPage
      icon="💻"
      title="独立开发者 AI 工具箱"
      subtitle="AI 辅助编程、前端生成、应用搭建、快速建站，一套工具搞定"
      tools={[
        { slug: "cursor", usage: "AI 代码编辑器，用自然语言写代码，理解整个项目上下文" },
        { slug: "github-copilot", usage: "代码补全行业标准，IDE 集成最完善" },
        { slug: "windsurf", usage: "AI 代码编辑器新秀，Cascade 模式自动多文件改动" },
        { slug: "v0-dev", usage: "Vercel 出品，自然语言生成 React 前端界面" },
        { slug: "dify", usage: "开源可视化搭建 AI 应用和 RAG 工作流" },
        { slug: "coze", usage: "字节出品，零代码搭建 AI Bot 和智能体" },
        { slug: "replit-ai", usage: "在线 AI 编程环境，写完即部署" },
        { slug: "tongyi-lingma", usage: "阿里免费 AI 代码助手，IDE 插件即装即用" },
      ]}
      workflowTeaser={{
        title: "独立开发者全栈工作流 —— 即将发布",
        desc: "Cursor AI 写代码 → v0 生成前端 → Dify 搭建 AI 应用 → Claude 生成技术文档",
      }}
    />
  );
}
