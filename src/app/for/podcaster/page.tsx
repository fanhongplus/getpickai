import { Metadata } from "next";
import { ForPage } from "@/components/ForPage";

export const metadata: Metadata = {
  title: "播客主 AI 工具箱",
  description: "录制、剪辑、推广、二创，一套 AI 工具搞定播客全链路。",
};

export default function PodcasterPage() {
  return (
    <ForPage
      icon="🎙️"
      title="播客主 AI 工具箱"
      subtitle="录制、剪辑、推广、二创，一套 AI 工具搞定播客全链路"
      tools={[
        { slug: "riverside", usage: "高清远程录制，本地录音防断网，嘉宾连线也清晰" },
        { slug: "descript", usage: "看着文字稿剪音频，删文字就删语音，剪辑效率翻倍" },
        { slug: "adobe-podcast", usage: "一键 AI 降噪，在家录出录音棚音质" },
        { slug: "otter-ai", usage: "录音自动转逐字稿，生成时间戳和章节标记" },
        { slug: "claude", usage: "生成 Show Notes 和内容二创文案" },
        { slug: "opus-clip", usage: "提取播客精华片段做短视频引流" },
        { slug: "canva", usage: "制作每期封面和社媒推广卡片" },
        { slug: "buffer", usage: "播客推广内容全平台排期发布" },
      ]}
      workflowTeaser={{
        title: "播客主一站式工作流 —— 即将发布",
        desc: "Riverside 录制 → Descript 剪辑 → Adobe Podcast 降噪 → Claude 生成 Show Notes → Opus Clip 拆精华短视频",
      }}
    />
  );
}
