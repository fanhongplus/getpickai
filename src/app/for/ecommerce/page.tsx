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
        { slug: "helium-10", usage: "亚马逊全能运营工具，选品+关键词+广告优化一站搞定" },
        { slug: "sorftime", usage: "国产选品数据分析，市场容量和竞争度评估，中文界面友好" },
        { slug: "weshop-ai", usage: "AI 商拍神器，一张商品图生成多种模特和场景图" },
        { slug: "tidio", usage: "Shopify 独立站 AI 客服机器人，7×24 自动回复" },
        { slug: "synthesia", usage: "AI 数字人视频，120+ 语言，一条视频卖全球" },
        { slug: "shopify-magic", usage: "Shopify 内置 AI，自动生成产品描述和营销邮件" },
        { slug: "tongyi-translate", usage: "阿里 AI 翻译，电商场景优化，支持图片翻译" },
        { slug: "tool4seller", usage: "亚马逊 AI 运营助手，13 种语言内容生成" },
        { slug: "algopix", usage: "多市场选品分析，一键对比不同国家利润和竞争" },
        { slug: "lingxing", usage: "国产亚马逊 ERP，AI 文案和智能广告优化" },
        { slug: "creatorkit", usage: "AI 电商素材自动生成，产品视频和 Banner 一键出" },
        { slug: "shulex-voc", usage: "AI 评论分析，自动挖掘消费者痛点和竞品弱点" },
        { slug: "copy-ai", usage: "AI 营销文案生成，广告语和产品描述一键搞定" },
        { slug: "chanmama", usage: "抖音/TikTok 数据分析，AI 选品和达人匹配" },
      ]}
      workflowTeaser={{
        title: "从选品到出单的 AI 全流程方案 —— 即将发布",
        desc: "一套完整的跨境电商 AI 工作流，覆盖选品、文案、图片、视频、投流全链路",
      }}
    />
  );
}
