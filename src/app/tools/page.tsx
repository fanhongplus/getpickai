import { getAllTools } from "@/lib/data";
import { ToolsClient } from "./ToolsClient";

// 构建时获取所有工具数据，传给客户端组件筛选
export default function ToolsPage() {
  const tools = getAllTools();
  return <ToolsClient tools={tools} />;
}
