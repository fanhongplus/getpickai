import { Metadata } from "next";
import { ForPage } from "@/components/ForPage";

export const metadata: Metadata = {
  title: "自媒体创作者的 AI 工具箱",
  description: "一个人就是一支团队，用 AI 做出专业级内容。精选 6 个最适合自媒体创作者的 AI 工具。",
};

export default function CreatorPage() {
  return (
    <ForPage
      icon="🎬"
      title="自媒体创作者的 AI 工具箱"
      subtitle="一个人就是一支团队，用 AI 做出专业级内容"
      tools={[
        { slug: "jasper-ai", usage: "写脚本、文案和社交媒体帖子，50+ 模板覆盖各种内容场景" },
        { slug: "midjourney", usage: "做封面图、缩略图和插图，艺术级画质让内容更抓眼球" },
        { slug: "canva", usage: "做封面、海报和社交媒体图，零基础也能出专业设计" },
        { slug: "heygen", usage: "AI 数字人出镜，不用露脸也能做口播视频" },
        { slug: "elevenlabs", usage: "AI 配音和声音克隆，做播客和视频旁白" },
        { slug: "cursor", usage: "搭建个人网站和工具，不会编程也能用自然语言写代码" },
      ]}
      workflowTeaser={{
        title: "全自动 YouTube 频道工作流 —— 即将发布",
        desc: "从选题到发布的完整流程，工具月费 $45，预估月收益 $500-2000",
      }}
    />
  );
}
