import Image from "next/image";
import Link from "next/link";
import { Tool } from "@/lib/types";
import { sceneColorMap, priceColorMap } from "@/lib/constants";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const priceInfo = priceColorMap[tool.pricingType] || priceColorMap.paid;

  return (
    <Link href={`/tools/${tool.slug}`}>
      <div className="card-hover bg-bg border border-border rounded-card p-5 h-full flex flex-col cursor-pointer hover:border-accent/30">
        {/* 顶部：Logo + 名称 + 描述 */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-logo overflow-hidden flex-shrink-0 bg-bg-muted">
            <Image
              src={tool.logo}
              alt={tool.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text text-base leading-heading">
              {tool.name}
              {tool.isNew && (
                <span className="ml-2 text-xs bg-accent/10 text-accent px-1.5 py-0.5 rounded-tag">
                  新
                </span>
              )}
            </h3>
            <p className="text-sm text-text-secondary mt-1 line-clamp-2">
              {tool.tagline}
            </p>
          </div>
        </div>

        {/* 价格和评分 */}
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-xs px-2 py-0.5 rounded-tag ${priceInfo.bg} ${priceInfo.text}`}>
            {tool.priceLabel}
          </span>
          <span className="text-sm text-text-muted flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {tool.rating}
          </span>
        </div>

        {/* 场景标签 */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
          {tool.scenes.slice(0, 3).map((scene) => (
            <span
              key={scene}
              className={`text-xs px-2 py-0.5 rounded-tag ${sceneColorMap[scene] || "bg-bg-muted text-text-secondary"}`}
            >
              {scene}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
