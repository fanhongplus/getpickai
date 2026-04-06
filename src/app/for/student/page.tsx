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
        { slug: "youdao", usage: "网易 AI 翻译，文档翻译和实时对话翻译" },
        { slug: "tencent-translate", usage: "腾讯 AI 翻译，同声传译和文档翻译，完全免费" },
        { slug: "islide", usage: "PPT 设计辅助，AI 一键排版 + 海量模板" },
        { slug: "consensus", usage: "AI 学术搜索，从 2 亿+ 论文中搜索答案并给出引用" },
        { slug: "elicit", usage: "AI 科研助手，自动搜索文献、提取关键信息" },
        { slug: "scholarcy", usage: "AI 论文摘要，自动提取核心论点和结论" },
        { slug: "otter-ai", usage: "AI 课堂实时转录，自动生成笔记和摘要" },
        { slug: "mathway", usage: "AI 数学解题，拍照即可获得分步解答" },
        { slug: "smodin", usage: "AI 改写和查重，覆盖 100+ 语言，引用生成" },
        { slug: "speechify", usage: "AI 文字转语音，把论文变有声书，碎片时间学习" },
        { slug: "flowus", usage: "国产 AI 笔记工具，学术笔记整理好帮手" },
        { slug: "napkin-ai", usage: "AI 文字转图表，论文和 PPT 数据可视化" },
        { slug: "notebooklm", usage: "Google AI 笔记，上传文档自动分析，还能生成播客" },
        { slug: "microsoft-copilot", usage: "微软 AI 助手，Word/Excel/PPT 全家桶 AI 加持" },
        { slug: "connected-papers", usage: "论文关联可视化，一篇论文发现整个文献网络" },
        { slug: "semantic-scholar", usage: "AI 学术搜索，自动提取论文核心信息和引用关系" },
        { slug: "writefull", usage: "学术英文润色专家，比 Grammarly 更懂论文写作" },
        { slug: "prowritingaid", usage: "AI 写作分析，深度检查文章结构和可读性" },
        { slug: "wolfram-alpha", usage: "计算知识引擎，数理化统计问题精确解答" },
        { slug: "photomath", usage: "拍照解数学题，AI 分步解答，Google 出品" },
        { slug: "quizlet", usage: "AI 智能闪卡，自动生成测试题高效备考" },
        { slug: "zotero", usage: "开源文献管理，一键保存论文自动生成引用" },
        { slug: "hemingway", usage: "英文简洁度检测，高亮复杂句式让文章更易读" },
        { slug: "socratic", usage: "Google AI 学习助手，拍照提问任何学科" },
        { slug: "popai", usage: "AI 文档分析，PDF 和论文智能问答总结" },
        { slug: "perplexity", usage: "AI 搜索引擎，带引用的结构化答案，调研利器" },
      ]}
      workflowTeaser={{
        title: "留学生 AI 学习全套工作流 —— 即将发布",
        desc: "从课前预习到期末论文，手把手教你用 AI 高效学习",
      }}
    />
  );
}
