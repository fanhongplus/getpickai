import { Metadata } from "next";
import { ForPage } from "@/components/ForPage";

export const metadata: Metadata = {
  title: "视频创作者 AI 工具箱",
  description: "从选题到发布，AI 帮你打通视频创作全流程。精选最适合视频创作者的 AI 工具。",
};

export default function VideoCreatorPage() {
  return (
    <ForPage
      icon="🎬"
      title="视频创作者 AI 工具箱"
      subtitle="从选题到发布，AI 帮你打通视频创作全流程"
      tools={[
        { slug: "chatgpt", usage: "视频选题调研和脚本撰写，5 分钟出一份完整脚本" },
        { slug: "capcut", usage: "AI 图文成片和智能字幕，零剪辑基础也能出片" },
        { slug: "pictory", usage: "脚本自动转视频，省去粗剪环节直接出初稿" },
        { slug: "opus-clip", usage: "长视频 AI 拆条，一条 30 分钟视频拆成 10 条短视频" },
        { slug: "elevenlabs", usage: "AI 配音和声音克隆，不用自己录音也能做视频" },
        { slug: "heygen", usage: "数字人出镜，不露脸也能做口播视频" },
        { slug: "midjourney", usage: "AI 生成独家封面素材，建立频道视觉辨识度" },
        { slug: "repurpose-io", usage: "视频自动分发到 TikTok/Reels/Shorts 全平台" },
      ]}
      workflowTeaser={{
        title: "视频创作者全自动工作流 —— 即将发布",
        desc: "用 Claude 批量生成脚本 → Pictory 自动成片 → ElevenLabs 多语言配音 → Repurpose.io 全平台分发",
      }}
    />
  );
}
