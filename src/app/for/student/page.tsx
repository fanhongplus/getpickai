import { Metadata } from "next";
import { ForPage } from "@/components/ForPage";

export const metadata: Metadata = {
  title: "留学生的 AI 工具箱",
  description: "写论文、做 PPT、练口语，AI 是你的学霸搭档。精选 6 个最适合留学生的 AI 工具。",
};

export default function StudentPage() {
  return (
    <ForPage
      icon="🎓"
      title="留学生的 AI 工具箱"
      subtitle="写论文、做 PPT、练口语，AI 是你的学霸搭档"
      tools={[
        { slug: "jasper-ai", usage: "润色英文论文和写作，提升学术写作质量" },
        { slug: "canva", usage: "做 PPT 和课堂展示，海量学术模板直接用" },
        { slug: "elevenlabs", usage: "练习听力和发音，AI 生成各种口音的英语语音" },
        { slug: "writesonic", usage: "润色英文写作、生成摘要和大纲，学术写作好帮手" },
        { slug: "notta", usage: "课堂录音实时转文字，再也不怕漏听重要内容" },
        { slug: "midjourney", usage: "做课题报告插图和海报，AI 画图比手画强一百倍" },
      ]}
      workflowTeaser={{
        title: "留学生 AI 学习全套工作流 —— 即将发布",
        desc: "从课前预习到期末论文，手把手教你用 AI 高效学习",
      }}
    />
  );
}
