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
        { slug: "sellersprite", usage: "亚马逊选品和关键词分析，中文界面零门槛，数据覆盖全球主要站点" },
        { slug: "deepl", usage: "多语言 Listing 文案翻译首选，翻译质量远超 Google 翻译" },
        { slug: "photoroom", usage: "一键生成白底图和场景图，手机拍照就能出专业商品图" },
        { slug: "salesmartly", usage: "多渠道智能客服，AI 自动回复 + 实时多语言翻译，解决时差问题" },
        { slug: "pic-copilot", usage: "阿里出品的免费电商图工具，一键生成商品主图和营销海报" },
        { slug: "dianxiaomi-ai", usage: "130 万卖家在用的 ERP，接入 AI 大模型辅助运营" },
        { slug: "jungle-scout", usage: "亚马逊选品数据最准确的工具，AI 驱动销量预测和市场分析" },
        { slug: "accio-work", usage: "阿里 AI Agent 平台，30 分钟完成从选品到开店全流程" },
        { slug: "gaoding", usage: "国产在线设计工具，AI 抠图 + 海量电商模板，快速出营销图" },
      ]}
      workflowTeaser={{
        title: "从选品到出单的 AI 全流程方案 —— 即将发布",
        desc: "一套完整的跨境电商 AI 工作流，覆盖选品、文案、图片、视频、投流全链路",
      }}
    />
  );
}
