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
        { slug: "descript", usage: "像编辑文档一样编辑视频，播客和访谈内容创作利器" },
        { slug: "opus-clip", usage: "AI 自动把长视频剪成短视频精华，矩阵分发效率翻倍" },
        { slug: "pika", usage: "AI 视频生成，文字和图片快速生成短视频片段" },
        { slug: "suno", usage: "AI 音乐生成，输入描述就能创作完整歌曲和视频配乐" },
        { slug: "udio", usage: "AI 音乐创作，古典爵士等复杂风格特别出色" },
        { slug: "chuangkit", usage: "国产在线设计，AI 智能设计 + 海量中文模板" },
        { slug: "copy-ai", usage: "AI 营销文案生成，社媒帖子和广告文案一键搞定" },
        { slug: "leonardo-ai", usage: "AI 图片生成，内置多种风格模型，社媒配图利器" },
        { slug: "ideogram", usage: "AI 图片生成，文字渲染能力最强，做海报和 Logo 首选" },
        { slug: "dreamina", usage: "字节 AI 绘图，中文提示词理解强，免费使用" },
        { slug: "newrank", usage: "自媒体数据分析，AI 内容趋势分析和账号监测" },
        { slug: "chanmama", usage: "抖音/TikTok 数据分析，热门内容和达人数据追踪" },
        { slug: "jianying", usage: "国内版 AI 视频剪辑，图文成片功能是杀手级" },
        { slug: "synthesia", usage: "AI 数字人视频，多语言口播不用真人出镜" },
        { slug: "luma-ai", usage: "AI 3D 和视频生成，创意短视频素材制作" },
        { slug: "napkin-ai", usage: "AI 文字转图表，数据可视化一键搞定" },
        { slug: "kapwing", usage: "在线 AI 视频编辑，自动字幕 + 多人协作" },
        { slug: "invideo", usage: "文字自动生成视频，5000+ 模板覆盖各场景" },
        { slug: "riverside", usage: "播客和视频远程录制，AI 生成精华片段" },
        { slug: "loom", usage: "录屏视频消息，AI 自动生成摘要和章节" },
        { slug: "buffer", usage: "社媒管理工具，AI 生成帖子 + 多平台定时发布" },
        { slug: "remove-bg", usage: "一键 AI 抠图，5 秒去除图片背景" },
        { slug: "fotor", usage: "AI 在线修图和设计，一键修图 + AI 扩图" },
        { slug: "pixlr", usage: "在线 AI 图片编辑器，专业修图 + 批量编辑" },
        { slug: "remini", usage: "AI 照片修复增强，模糊照片变高清" },
        { slug: "krea-ai", usage: "实时 AI 图片生成，画一笔 AI 帮你补全" },
        { slug: "playground-ai", usage: "免费 AI 图片生成，每天 500 张免费额度" },
        { slug: "tensor-art", usage: "免费 AI 图片社区，海量模型和 LoRA" },
        { slug: "kling-ai", usage: "快手 AI 视频生成，文生视频质量业界领先" },
        { slug: "hailuo-ai", usage: "MiniMax AI 视频生成，速度快免费额度足" },
        { slug: "monica-ai", usage: "AI 浏览器助手，网页总结 + AI 写作 + 翻译" },
        { slug: "mailchimp", usage: "邮件营销平台，AI 生成内容 + 粉丝运营" },
        { slug: "adcreative-ai", usage: "AI 广告素材生成，社媒广告图一键出" },
        { slug: "magnific-ai", usage: "AI 图片无损放大，素材变超高清" },
        { slug: "vidu", usage: "国产 AI 视频生成，多种风格质量领先" },
        { slug: "prowritingaid", usage: "AI 写作分析润色，文章结构和风格优化" },
      ]}
      workflowTeaser={{
        title: "全自动 YouTube 频道工作流 —— 即将发布",
        desc: "从选题到发布的完整流程，工具月费 $45，预估月收益 $500-2000",
      }}
    />
  );
}
