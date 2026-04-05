import { getAllTools } from "@/lib/data";
import { GoClient } from "./GoClient";

// 构建时生成静态路径
export async function generateStaticParams() {
  const tools = getAllTools();
  return tools.map((tool) => ({ slug: tool.slug }));
}

// 构建时获取工具数据传给客户端
export default function GoPage({ params }: { params: { slug: string } }) {
  const tools = getAllTools();
  const tool = tools.find((t) => t.slug === params.slug);
  const toolName = tool?.name || "";
  const affiliateUrl = tool?.affiliateUrl || "";

  return <GoClient slug={params.slug} toolName={toolName} affiliateUrl={affiliateUrl} />;
}
