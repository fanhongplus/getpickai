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
        { slug: "chatgpt", usage: "全能 AI 助手，写 Listing、回复客户邮件、做选品调研" },
        { slug: "claude", usage: "长文本分析能力强，批量处理竞品 Review 和市场报告" },
        { slug: "jasper", usage: "写 Listing 文案、广告语和邮件营销内容，品牌声音功能保持风格统一" },
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
        { slug: "keepa", usage: "亚马逊价格追踪和历史数据，选品必看价格走势" },
        { slug: "amzscout", usage: "亚马逊选品工具，Chrome 插件一键查看产品数据" },
        { slug: "teikametrics", usage: "AI 广告优化，自动调整竞价最大化利润" },
        { slug: "pingpong", usage: "跨境收款，费率低于 PayPal，提现快" },
        { slug: "lianlianpay", usage: "跨境收付款一站式解决，国内卖家首选" },
        { slug: "printful", usage: "按需印刷代发货，零库存做跨境电商" },
        { slug: "spocket", usage: "Dropshipping 供应商平台，AI 推荐热销产品" },
        { slug: "smartscout", usage: "亚马逊品牌和子类目分析，发现蓝海市场" },
        { slug: "gorgias", usage: "电商 AI 客服，多渠道消息统一管理" },
        { slug: "chatfuel", usage: "社媒聊天机器人，WhatsApp/Instagram 自动营销" },
        { slug: "mailchimp", usage: "邮件营销平台，AI 生成邮件内容" },
        { slug: "klaviyo", usage: "电商邮件+短信营销，AI 个性化推荐" },
        { slug: "quickcreator", usage: "跨境 SEO AI 内容工具，多语言博客和落地页" },
        { slug: "adcreative-ai", usage: "AI 广告素材生成，一键出高转化广告图" },
        { slug: "magnific-ai", usage: "AI 图片无损放大，低分辨率商品图变超清" },
        { slug: "remove-bg", usage: "一键 AI 抠图，5 秒去除背景生成白底图" },
        { slug: "grammarly", usage: "英文 Listing 和邮件语法润色，避免低级错误" },
        { slug: "surfer-seo", usage: "独立站 SEO 内容优化，实时检测关键词覆盖度" },
        { slug: "pictory", usage: "脚本自动转产品视频，省去拍摄和粗剪" },
        { slug: "elevenlabs", usage: "AI 配音做产品介绍视频，多语言一次出齐" },
        { slug: "ahrefs", usage: "顶级 SEO 工具，分析竞品反向链接和关键词" },
        { slug: "ubersuggest", usage: "Neil Patel SEO 工具，免费查关键词搜索量" },
        { slug: "similarweb", usage: "竞品独立站流量分析，看清流量来源结构" },
        { slug: "buffer", usage: "社媒帖子统一排期，多渠道一次发布" },
        { slug: "getresponse", usage: "邮件营销自动化，弃购挽回和复购提醒" },
      ]}
      workflowTeaser={{
        title: "从选品到出单的 AI 全流程方案 —— 即将发布",
        desc: "一套完整的跨境电商 AI 工作流，覆盖选品、文案、图片、视频、投流全链路",
      }}
    />
  );
}
