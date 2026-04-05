// 工具数据类型定义
export interface Tool {
  slug: string;
  name: string;
  logo: string;
  tagline: string;
  scenes: string[];
  pricingType: "free" | "freemium" | "paid";
  priceLabel: string;
  rating: number;
  affiliateUrl: string;
  websiteUrl: string;
  editorReview: string;
  goodFor: string[];
  notGoodFor: string[];
  pros: string[];
  cons: string[];
  pricingPlans: PricingPlan[];
  quickStart: string[];
  relatedTools: string[];
  screenshots: string[];
  isFeatured: boolean;
  isNew: boolean;
  affiliateCommission: string;
  cookieDuration: string;
  createdAt: string;
  verifiedAt?: string;
  prompts?: ToolPrompt[];
}

export interface ToolPrompt {
  title: string;
  prompt: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
}

// 文章数据类型
export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  readTime: string;
  publishedAt: string;
  content: string;
  relatedTools: string[];
  relatedArticles: string[];
}

// 场景定义
export interface Scene {
  id: string;
  name: string;
  icon: string;
  description: string;
}
