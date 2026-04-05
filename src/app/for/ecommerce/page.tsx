import { Metadata } from "next";
import { ForPage } from "@/components/ForPage";

export const metadata: Metadata = {
  title: "跨境电商卖家的 AI 工具箱",
  description: "从选品到投流，用 AI 把效率拉到极致。精选 6 个最适合跨境电商卖家的 AI 工具。",
};

export default function EcommercePage() {
  return (
    <ForPage
      icon="🛒"
      title="跨境电商卖家的 AI 工具箱"
      subtitle="从选品到投流，用 AI 把效率拉到极致"
      tools={[
        { slug: "jasper-ai", usage: "写 Listing 文案、广告语和邮件营销内容，品牌声音功能保持风格统一" },
        { slug: "midjourney", usage: "生成高质量商品图、场景图和广告素材，省下大量拍摄成本" },
        { slug: "heygen", usage: "制作多语言产品视频，AI 数字人口播 + 自动翻译，一条视频卖全球" },
        { slug: "canva", usage: "做电商海报、社交媒体图和 A+ 页面，模板多到用不完" },
        { slug: "writesonic", usage: "写广告文案和产品描述，价格只有 Jasper 的一半，性价比之选" },
      ]}
      workflowTeaser={{
        title: "从选品到出单的 AI 全流程方案 —— 即将发布",
        desc: "一套完整的跨境电商 AI 工作流，覆盖选品、文案、图片、视频、投流全链路",
      }}
    />
  );
}
