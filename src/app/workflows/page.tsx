import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 变现实战指南",
  description: "不只是推荐工具，更是手把手教你用 AI 赚钱。每套方案都附带成本核算和可复制的 Prompt。",
};

interface WorkflowCard {
  title: string;
  desc: string;
  tools: string;
  cost: string;
  tag: string;
  tagColor: string;
  href: string;
  published: boolean;
}

const workflows: WorkflowCard[] = [
  {
    title: "AI副业变现：5种不需要技术基础的赚钱方式",
    desc: "每种方式都附带工具推荐和上手教程",
    tools: "ChatGPT · Midjourney · Canva",
    cost: "月费 $20-50",
    tag: "🔥 热门",
    tagColor: "bg-tag-video/10 text-tag-video",
    href: "/blog/ai-side-hustle-guide",
    published: true,
  },
  {
    title: "全自动YouTube频道：从选题到发布的完整工作流",
    desc: "用 AI 生成脚本、配音、画面，全自动运营一个 YouTube 频道",
    tools: "ChatGPT · ElevenLabs · HeyGen · Canva",
    cost: "月费 $45",
    tag: "即将发布",
    tagColor: "bg-bg-muted text-text-muted",
    href: "#",
    published: false,
  },
  {
    title: "AI 电商全流程：从选品到出单的自动化方案",
    desc: "用 AI 完成选品分析、Listing 撰写、图片生成、广告投放全流程",
    tools: "ChatGPT · Jasper · Midjourney · HeyGen",
    cost: "月费 $80-120",
    tag: "即将发布",
    tagColor: "bg-bg-muted text-text-muted",
    href: "#",
    published: false,
  },
];

export default function WorkflowsPage() {
  return (
    <div className="animate-fade-in pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 页面头部 */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-text leading-heading">
            AI 变现实战指南
          </h1>
          <p className="mt-2 text-text-secondary text-lg">
            不只是推荐工具，更是手把手教你用 AI 赚钱
          </p>
          <p className="mt-1 text-text-muted text-sm">
            每套方案都附带成本核算和可复制的 Prompt
          </p>
        </div>

        {/* 工作流列表 */}
        <div className="space-y-4">
          {workflows.map((wf) => (
            <div key={wf.title} className={!wf.published ? "opacity-60" : ""}>
              {wf.published ? (
                <Link href={wf.href}>
                  <WorkflowCardUI wf={wf} />
                </Link>
              ) : (
                <WorkflowCardUI wf={wf} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkflowCardUI({ wf }: { wf: WorkflowCard }) {
  return (
    <div className={`card-hover flex border border-border rounded-card overflow-hidden ${wf.published ? "hover:bg-accent/5 cursor-pointer" : ""}`}>
      <div className={`w-1 flex-shrink-0 ${wf.published ? "bg-accent" : "bg-text-muted"}`} />
      <div className="flex-1 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-text text-base">{wf.title}</h3>
            <p className="text-sm text-text-secondary mt-1">{wf.desc}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-tag flex-shrink-0 whitespace-nowrap ${wf.tagColor}`}>
            {wf.tag}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
          <span>🛠 {wf.tools}</span>
          <span>💰 {wf.cost}</span>
        </div>
        {wf.published && (
          <span className="inline-block mt-3 text-sm text-accent font-medium">阅读指南 &rarr;</span>
        )}
      </div>
    </div>
  );
}
