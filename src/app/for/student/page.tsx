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
        { slug: "grammarly", usage: "英文写作必备，AI 语法检查 + 文风优化 + 抄袭检测" },
        { slug: "gamma", usage: "AI 一键生成 PPT，输入主题自动出精美幻灯片，告别熬夜做 PPT" },
        { slug: "quillbot", usage: "论文改写和降重神器，7 种改写模式，学术模式特别好用" },
        { slug: "speak", usage: "AI 英语口语练习，模拟真实对话场景，24 小时随时练" },
        { slug: "deepl", usage: "翻译质量最高的 AI 工具，读外文文献和写多语言作业首选" },
        { slug: "notion-ai", usage: "AI 笔记和学习管理，内置写作助手整理课堂笔记" },
        { slug: "kimi", usage: "免费 AI 助手，超长上下文能力，一次读完整篇论文" },
        { slug: "metaso", usage: "AI 搜索引擎，无广告直接给答案，学术搜索找文献利器" },
        { slug: "xiezuocat", usage: "中文写作润色，写中文报告和论文的好帮手" },
      ]}
      workflowTeaser={{
        title: "留学生 AI 学习全套工作流 —— 即将发布",
        desc: "从课前预习到期末论文，手把手教你用 AI 高效学习",
      }}
    />
  );
}
