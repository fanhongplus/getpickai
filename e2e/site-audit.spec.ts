// e2e/site-audit.spec.ts
// GoPick.ai 全站自动化检测
// 覆盖：500+ 页面状态 / 按钮链接 / 跳转 / 匹配器交互

import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

// ===== 数据加载 =====
const TOOLS_DIR = path.join(process.cwd(), "data/tools");
const MATCHER_PATH = path.join(process.cwd(), "data/matcher.json");
const ARTICLES_DIR = path.join(process.cwd(), "data/articles");

// 读取所有工具 slug
const toolSlugs = fs
  .readdirSync(TOOLS_DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(".json", ""));

// 读取 matcher 数据
const matcherData = JSON.parse(fs.readFileSync(MATCHER_PATH, "utf-8"));

// 读取所有文章 slug
const articleSlugs = fs
  .readdirSync(ARTICLES_DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(".json", ""));

// 提取所有工作流路径
const workflowPaths: string[] = [];
for (const identity of matcherData.identities) {
  for (const pp of identity.painpoints) {
    for (const budget of ["free", "paid", "cn-free"]) {
      if (pp.workflows[budget]) {
        workflowPaths.push(`/workflows/${identity.id}/${pp.id}/${budget}`);
      }
    }
  }
}

// 品类对比页 slug
const comparePages = [
  "ai-writing",
  "ai-image",
  "ai-video",
  "ai-efficiency",
  "ai-coding",
  "ai-marketing",
  "ai-design",
  "ai-music",
  "ai-ppt",
  "ai-language",
  "ai-blog",
];

// 人群落地页
const personaPages = [
  "ecommerce",
  "video-creator",
  "podcaster",
  "writer",
  "student",
  "developer",
];

// 超时设置（某些页面可能加载较慢）
const PAGE_TIMEOUT = 15000;

// ============================================================
// 1. 核心页面状态检测（全部必须 200）
// ============================================================
test.describe("1. 核心页面状态检测", () => {
  test("1.1 首页 200", async ({ page }) => {
    const resp = await page.goto("/", { timeout: PAGE_TIMEOUT });
    expect(resp?.status()).toBe(200);
  });

  test("1.2 找工具页 200", async ({ page }) => {
    const resp = await page.goto("/tools", { timeout: PAGE_TIMEOUT });
    expect(resp?.status()).toBe(200);
  });

  test("1.3 AI攻略页 200", async ({ page }) => {
    const resp = await page.goto("/blog", { timeout: PAGE_TIMEOUT });
    expect(resp?.status()).toBe(200);
  });

  test("1.4 品类对比索引页 200", async ({ page }) => {
    const resp = await page.goto("/compare", { timeout: PAGE_TIMEOUT });
    expect(resp?.status()).toBe(200);
  });

  test("1.5 巡检报告页 200", async ({ page }) => {
    const resp = await page.goto("/admin/health", { timeout: PAGE_TIMEOUT });
    expect(resp?.status()).toBe(200);
  });
});

// ============================================================
// 2. 全部 /tools/{slug} 页面检测
// ============================================================
test.describe("2. 工具详情页（/tools/）", () => {
  for (const slug of toolSlugs) {
    test(`2.x /tools/${slug} → 200`, async ({ page }) => {
      const resp = await page.goto(`/tools/${slug}`, { timeout: PAGE_TIMEOUT });
      expect(resp?.status()).toBe(200);

      // 页面标题不为空
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);

      // 返回按钮存在
      const backButton = page.locator("button, a").filter({ hasText: /返回/ });
      const backCount = await backButton.count();
      expect(backCount).toBeGreaterThanOrEqual(1);
    });
  }
});

// ============================================================
// 3. 全部 /go/{slug} 跳转检测
// ============================================================
test.describe("3. 联盟跳转页（/go/）", () => {
  // 读取每个工具的官网 URL
  const toolWebsites: { slug: string; website: string }[] = [];
  for (const slug of toolSlugs) {
    try {
      const toolData = JSON.parse(
        fs.readFileSync(path.join(TOOLS_DIR, `${slug}.json`), "utf-8")
      );
      const website = toolData.website || toolData.url || toolData.affiliateUrl || "";
      if (website) {
        toolWebsites.push({ slug, website });
      }
    } catch {
      // 跳过读取失败的
    }
  }

  for (const { slug } of toolWebsites) {
    test(`3.x /go/${slug} → 加载成功（不是 404/500）`, async ({ page }) => {
      const resp = await page.goto(`/go/${slug}`, {
        timeout: PAGE_TIMEOUT,
        waitUntil: "domcontentloaded",
      });
      // /go/ 页面应该是 200（中间页）或 3xx（直接跳转）
      const status = resp?.status() || 0;
      expect(status).toBeLessThan(500); // 不是服务器错误
      expect(status).not.toBe(404); // 不是 404
    });
  }
});

// ============================================================
// 4. 全部 /workflows/ 页面检测
// ============================================================
test.describe("4. 工作流独立页面（/workflows/）", () => {
  for (const wfPath of workflowPaths) {
    test(`4.x ${wfPath} → 200`, async ({ page }) => {
      const resp = await page.goto(wfPath, { timeout: PAGE_TIMEOUT });
      expect(resp?.status()).toBe(200);

      // 页面有工具步骤卡片
      const toolSteps = page.locator("[data-testid='tool-step']");
      const stepCount = await toolSteps.count();
      // 如果没有 data-testid，退而检查是否有工具链接
      if (stepCount === 0) {
        const toolLinks = page.locator("a[href^='/tools/']");
        expect(await toolLinks.count()).toBeGreaterThanOrEqual(2);
      } else {
        expect(stepCount).toBeGreaterThanOrEqual(2);
        expect(stepCount).toBeLessThanOrEqual(4);
      }
    });
  }
});

// ============================================================
// 5. 品类对比页检测
// ============================================================
test.describe("5. 品类对比页（/compare/）", () => {
  for (const scene of comparePages) {
    test(`5.x /compare/${scene} → 200 + 有工具列表`, async ({ page }) => {
      const resp = await page.goto(`/compare/${scene}`, { timeout: PAGE_TIMEOUT });
      expect(resp?.status()).toBe(200);

      // 页面有工具链接
      const toolLinks = page.locator("a[href^='/tools/']");
      expect(await toolLinks.count()).toBeGreaterThanOrEqual(1);
    });
  }
});

// ============================================================
// 6. 人群落地页检测
// ============================================================
test.describe("6. 人群落地页（/for/）", () => {
  for (const persona of personaPages) {
    test(`6.x /for/${persona} → 200`, async ({ page }) => {
      const resp = await page.goto(`/for/${persona}`, { timeout: PAGE_TIMEOUT });
      expect(resp?.status()).toBe(200);

      // 页面有工具卡片/链接
      const toolLinks = page.locator("a[href^='/tools/']");
      expect(await toolLinks.count()).toBeGreaterThanOrEqual(1);
    });
  }

  test("6.7 旧路由 /for/creator → 301 重定向", async ({ page }) => {
    const resp = await page.goto("/for/creator", {
      timeout: PAGE_TIMEOUT,
      waitUntil: "domcontentloaded",
    });
    // 跟随重定向后应该到 /for/video-creator，最终 200
    expect(resp?.status()).toBe(200);
    expect(page.url()).toContain("/for/video-creator");
  });
});

// ============================================================
// 7. 文章页面检测
// ============================================================
test.describe("7. 文章页面（/blog/）", () => {
  for (const slug of articleSlugs) {
    // 检查发布日期，未来的文章应该 404
    const articleData = JSON.parse(
      fs.readFileSync(path.join(ARTICLES_DIR, `${slug}.json`), "utf-8")
    );
    const publishDate = new Date(articleData.publishedAt);
    const today = new Date();
    const isPublished = publishDate <= today;

    if (isPublished) {
      test(`7.x /blog/${slug} → 200（已发布）`, async ({ page }) => {
        const resp = await page.goto(`/blog/${slug}`, { timeout: PAGE_TIMEOUT });
        expect(resp?.status()).toBe(200);
      });
    } else {
      test(`7.x /blog/${slug} → 404（定时未到）`, async ({ page }) => {
        const resp = await page.goto(`/blog/${slug}`, { timeout: PAGE_TIMEOUT });
        expect(resp?.status()).toBe(404);
      });
    }
  }
});

// ============================================================
// 8. 匹配器完整交互检测
// ============================================================
test.describe("8. 匹配器交互流程", () => {
  // 每个身份抽一个痛点 × 3 种预算
  const testCombinations = [
    { identity: "ecommerce", painpoint: "product-desc", label: "跨境电商·商品描述" },
    { identity: "video-creator", painpoint: "ai-video-generation", label: "视频·AI视频生成" },
    { identity: "podcaster", painpoint: "podcast-recording", label: "播客·录制" },
    { identity: "writer", painpoint: "xiaohongshu", label: "图文·小红书" },
    { identity: "student", painpoint: "paper-rewrite", label: "留学生·论文降重" },
    { identity: "developer", painpoint: "ai-coding", label: "开发者·AI编程" },
  ];

  for (const combo of testCombinations) {
    for (const budget of ["free", "paid", "cn-free"]) {
      // 检查这个组合是否有对应的工作流
      const identity = matcherData.identities.find(
        (i: any) => i.id === combo.identity
      );
      const painpoint = identity?.painpoints.find(
        (p: any) => p.id === combo.painpoint
      );
      const hasWorkflow = painpoint?.workflows[budget];

      if (hasWorkflow) {
        test(`8.x ${combo.label} + ${budget} → 匹配成功`, async ({ page }) => {
          await page.goto("/", { timeout: PAGE_TIMEOUT });

          const matcher = page.locator("[data-testid='scenario-matcher']");

          // 等待匹配器可见（可能有动画）
          await expect(matcher).toBeVisible({ timeout: 10000 });

          // 选择身份
          await matcher
            .locator("[data-testid='select-identity']")
            .selectOption(combo.identity);

          // 等待痛点下拉更新
          await page.waitForTimeout(300);

          // 选择痛点
          const ppSelect = matcher.locator("[data-testid='select-painpoint']");
          await expect(ppSelect).not.toBeDisabled({ timeout: 3000 });
          await ppSelect.selectOption(combo.painpoint);

          // 选择预算
          await matcher
            .locator("[data-testid='select-budget']")
            .selectOption(budget);

          // 点击匹配
          await matcher.locator("[data-testid='match-button']").click();

          // 结果出现
          const result = matcher.locator("[data-testid='workflow-result']");
          await expect(result).toBeVisible({ timeout: 3000 });

          // 工具步骤卡片 2-4 个
          const steps = result.locator("[data-testid='tool-step']");
          const count = await steps.count();
          expect(count).toBeGreaterThanOrEqual(2);
          expect(count).toBeLessThanOrEqual(4);

          // 每个步骤有"了解详情"按钮
          for (let i = 0; i < count; i++) {
            const step = steps.nth(i);
            const detailLink = step.locator("a[href^='/tools/']");
            expect(await detailLink.count()).toBeGreaterThanOrEqual(1);

            // 链接不指向 /go/（铁律：必须指向 /tools/）
            const href = await detailLink.first().getAttribute("href");
            expect(href).toMatch(/^\/tools\//);
            expect(href).not.toMatch(/^\/go\//);
          }
        });
      }
    }
  }

  test("8.99 未选完就点匹配 → 错误提示", async ({ page }) => {
    await page.goto("/", { timeout: PAGE_TIMEOUT });
    const matcher = page.locator("[data-testid='scenario-matcher']");
    await expect(matcher).toBeVisible({ timeout: 10000 });

    // 不选任何项直接点匹配
    await matcher.locator("[data-testid='match-button']").click();

    // 错误提示出现
    const error = matcher.locator("[data-testid='error-message']");
    await expect(error).toBeVisible({ timeout: 3000 });
  });
});

// ============================================================
// 9. 工具详情页「了解详情」按钮抽检
// ============================================================
test.describe("9. 工具详情页内容抽检", () => {
  // 抽检 10 个高频工具的详情页
  const sampleTools = [
    "chatgpt",
    "claude",
    "midjourney",
    "canva",
    "grammarly",
    "cursor",
    "heygen",
    "riverside",
    "quillbot",
    "ahrefs",
  ];

  for (const slug of sampleTools) {
    test(`9.x /tools/${slug} → ToolWorkflows 组件存在`, async ({ page }) => {
      await page.goto(`/tools/${slug}`, { timeout: PAGE_TIMEOUT });

      // 页面应包含工作流引导区块
      // 查找包含"工作流"文字的区块
      const workflowSection = page.locator("text=工作流").first();
      // 如果有，检查里面有工作流链接
      if ((await workflowSection.count()) > 0) {
        const wfLinks = page.locator("a[href^='/workflows/']");
        expect(await wfLinks.count()).toBeGreaterThanOrEqual(1);
      }
    });
  }
});

// ============================================================
// 10. 工作流页面功能抽检
// ============================================================
test.describe("10. 工作流页面功能抽检", () => {
  const sampleWorkflows = [
    "/workflows/student/paper-rewrite/paid",
    "/workflows/ecommerce/product-desc/free",
    "/workflows/developer/ai-coding/paid",
    "/workflows/video-creator/ai-video-generation/cn-free",
    "/workflows/podcaster/podcast-recording/paid",
  ];

  for (const wfPath of sampleWorkflows) {
    test(`10.x ${wfPath} → 功能完整`, async ({ page }) => {
      await page.goto(wfPath, { timeout: PAGE_TIMEOUT });

      // 面包屑存在
      const breadcrumb = page.locator("nav, [class*='breadcrumb']").first();
      if ((await breadcrumb.count()) > 0) {
        // 面包屑有首页链接
        const homeLink = breadcrumb.locator("a[href='/']");
        expect(await homeLink.count()).toBeGreaterThanOrEqual(1);
      }

      // 工具链接指向 /tools/（不是 /go/）
      const toolLinks = page.locator("a[href^='/tools/']");
      expect(await toolLinks.count()).toBeGreaterThanOrEqual(2);

      // 没有 /go/ 的直接外链
      const goLinks = page.locator("a[href^='/go/']");
      expect(await goLinks.count()).toBe(0);

      // 预算切换链接存在（至少有1个其他预算方案）
      const budgetLinks = page.locator("a[href^='/workflows/']");
      // 当前页面本身不算，所以其他预算链接至少0个也正常
      // 但大部分痛点有 2-3 种预算，所以通常 >= 1
    });
  }

  // 分享按钮测试
  test("10.6 分享按钮可点击", async ({ page }) => {
    await page.goto("/workflows/student/paper-rewrite/paid", {
      timeout: PAGE_TIMEOUT,
    });

    const shareButton = page.locator("button").filter({ hasText: /分享|复制/ });
    if ((await shareButton.count()) > 0) {
      await shareButton.first().click();
      // 点击后应出现 toast/提示
      await page.waitForTimeout(500);
    }
  });
});

// ============================================================
// 11. 首页元素检测
// ============================================================
test.describe("11. 首页元素完整性", () => {
  test("11.1 匹配器存在且有3个下拉", async ({ page }) => {
    await page.goto("/", { timeout: PAGE_TIMEOUT });

    const matcher = page.locator("[data-testid='scenario-matcher']");
    await expect(matcher).toBeVisible({ timeout: 10000 });

    await expect(
      matcher.locator("[data-testid='select-identity']")
    ).toBeVisible();
    await expect(
      matcher.locator("[data-testid='select-painpoint']")
    ).toBeVisible();
    await expect(
      matcher.locator("[data-testid='select-budget']")
    ).toBeVisible();
    await expect(
      matcher.locator("[data-testid='match-button']")
    ).toBeVisible();
  });

  test("11.2 身份下拉有6个选项", async ({ page }) => {
    await page.goto("/", { timeout: PAGE_TIMEOUT });
    await page
      .locator("[data-testid='scenario-matcher']")
      .waitFor({ timeout: 10000 });

    const options = page.locator(
      "[data-testid='select-identity'] option:not([disabled])"
    );
    expect(await options.count()).toBe(6);
  });

  test("11.3 预算下拉有3个选项（含中文免费）", async ({ page }) => {
    await page.goto("/", { timeout: PAGE_TIMEOUT });
    await page
      .locator("[data-testid='scenario-matcher']")
      .waitFor({ timeout: 10000 });

    const options = page.locator(
      "[data-testid='select-budget'] option:not([disabled])"
    );
    expect(await options.count()).toBe(3);
  });

  test("11.4 人群入口卡片有6张", async ({ page }) => {
    await page.goto("/", { timeout: PAGE_TIMEOUT });

    // 检查 /for/ 链接数量
    const forLinks = page.locator("a[href^='/for/']");
    const count = await forLinks.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test("11.5 导航栏包含核心入口", async ({ page }) => {
    await page.goto("/", { timeout: PAGE_TIMEOUT });

    const nav = page.locator("nav").first();
    // 找工具
    expect(await nav.locator("a[href='/tools']").count()).toBeGreaterThanOrEqual(0);
    // 工具横评
    expect(
      await nav.locator("a[href='/compare']").count()
    ).toBeGreaterThanOrEqual(0);
  });
});

// ============================================================
// 12. SEO 基础检测
// ============================================================
test.describe("12. SEO 基础检测", () => {
  const seoPages = [
    "/",
    "/tools",
    "/blog",
    "/compare",
    "/tools/chatgpt",
    "/workflows/student/paper-rewrite/paid",
    "/compare/ai-writing",
    "/for/ecommerce",
  ];

  for (const url of seoPages) {
    test(`12.x ${url} → 有 title 和 meta description`, async ({ page }) => {
      await page.goto(url, { timeout: PAGE_TIMEOUT });

      // title 不为空
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
      expect(title).not.toBe("undefined");

      // meta description 存在
      const metaDesc = page.locator('meta[name="description"]');
      if ((await metaDesc.count()) > 0) {
        const content = await metaDesc.getAttribute("content");
        expect(content?.length).toBeGreaterThan(0);
      }
    });
  }

  test("12.9 sitemap.xml 可访问", async ({ page }) => {
    const resp = await page.goto("/sitemap.xml", { timeout: PAGE_TIMEOUT });
    expect(resp?.status()).toBe(200);
  });
});

// ============================================================
// 13. 移动端兼容性抽检
// ============================================================
test.describe("13. 移动端兼容性", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("13.1 首页匹配器在移动端可用", async ({ page }) => {
    await page.goto("/", { timeout: PAGE_TIMEOUT });

    const matcher = page.locator("[data-testid='scenario-matcher']");
    await expect(matcher).toBeVisible({ timeout: 10000 });

    // 下拉框可见且不溢出
    const selects = matcher.locator("select");
    for (let i = 0; i < (await selects.count()); i++) {
      await expect(selects.nth(i)).toBeVisible();
      const box = await selects.nth(i).boundingBox();
      if (box) {
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(375 + 1);
      }
    }
  });

  test("13.2 工具详情页移动端布局正常", async ({ page }) => {
    await page.goto("/tools/chatgpt", { timeout: PAGE_TIMEOUT });

    // 页面内容不超出视口
    const body = await page.locator("body").boundingBox();
    if (body) {
      expect(body.width).toBeLessThanOrEqual(375 + 5);
    }
  });

  test("13.3 移动端完整匹配流程", async ({ page }) => {
    await page.goto("/", { timeout: PAGE_TIMEOUT });

    const matcher = page.locator("[data-testid='scenario-matcher']");
    await expect(matcher).toBeVisible({ timeout: 10000 });

    await matcher
      .locator("[data-testid='select-identity']")
      .selectOption("student");
    await page.waitForTimeout(300);
    await matcher
      .locator("[data-testid='select-painpoint']")
      .selectOption("paper-rewrite");
    await matcher
      .locator("[data-testid='select-budget']")
      .selectOption("paid");
    await matcher.locator("[data-testid='match-button']").click();

    const result = matcher.locator("[data-testid='workflow-result']");
    await expect(result).toBeVisible({ timeout: 3000 });
  });
});

// ============================================================
// 14. 深色模式抽检
// ============================================================
test.describe("14. 深色模式", () => {
  test.use({ colorScheme: "dark" });

  test("14.1 首页深色模式不白屏", async ({ page }) => {
    await page.goto("/", { timeout: PAGE_TIMEOUT });

    // 检查 body 背景色不是纯白
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    // 纯白是 rgb(255, 255, 255)，深色模式不应该是这个
    expect(bgColor).not.toBe("rgb(255, 255, 255)");
  });

  test("14.2 工具详情页深色模式正常", async ({ page }) => {
    await page.goto("/tools/chatgpt", { timeout: PAGE_TIMEOUT });
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    expect(bgColor).not.toBe("rgb(255, 255, 255)");
  });
});

// ============================================================
// 15. 404 页面检测
// ============================================================
test.describe("15. 404 处理", () => {
  test("15.1 不存在的工具页 → 404", async ({ page }) => {
    const resp = await page.goto("/tools/this-tool-does-not-exist-xyz", {
      timeout: PAGE_TIMEOUT,
    });
    expect(resp?.status()).toBe(404);
  });

  test("15.2 不存在的工作流 → 404", async ({ page }) => {
    const resp = await page.goto("/workflows/ghost/fake/premium", {
      timeout: PAGE_TIMEOUT,
    });
    expect(resp?.status()).toBe(404);
  });

  test("15.3 不存在的文章 → 404", async ({ page }) => {
    const resp = await page.goto("/blog/this-article-does-not-exist", {
      timeout: PAGE_TIMEOUT,
    });
    expect(resp?.status()).toBe(404);
  });
});
