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
        { slug: "capcut", usage: "免费 AI 视频剪辑，自动字幕 + 智能剪辑一键搞定" },
        { slug: "runway", usage: "最前沿的 AI 视频生成，文字和图片一键生成视频片段" },
        { slug: "notion-ai", usage: "AI 笔记和选题管理，内置写作助手帮你理清创作思路" },
        { slug: "xiezuocat", usage: "中文写作润色神器，改写纠错续写，公众号和小红书必备" },
        { slug: "gaoding", usage: "国产设计工具，AI 抠图 + 海量中文模板，做封面效率极高" },
        { slug: "fish-audio", usage: "AI 语音合成和声音克隆，中文配音效果比 ElevenLabs 更自然" },
        { slug: "deepl", usage: "多语言翻译首选，做海外内容的文案翻译利器" },
      ]}
      workflowTeaser={{
        title: "全自动 YouTube 频道工作流 —— 即将发布",
        desc: "从选题到发布的完整流程，工具月费 $45，预估月收益 $500-2000",
      }}
    />
  );
}
