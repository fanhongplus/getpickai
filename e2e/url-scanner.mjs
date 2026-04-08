#!/usr/bin/env node
/**
 * GoPick.ai 全站 URL 快速扫描器
 * 比 Playwright 快 10 倍，纯 HTTP 请求检测状态码
 * 用法：node e2e/url-scanner.mjs
 * 或：BASE_URL=https://gopick.ai node e2e/url-scanner.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// ===== 数据加载 =====
const toolSlugs = fs
  .readdirSync(path.join(ROOT, "data/tools"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(".json", ""));

const matcherData = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data/matcher.json"), "utf-8")
);

const articleSlugs = fs
  .readdirSync(path.join(ROOT, "data/articles"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(".json", ""));

// ===== 构建 URL 列表 =====
const urls = [];

// 核心页面
urls.push({ url: "/", label: "首页" });
urls.push({ url: "/tools", label: "工具列表" });
urls.push({ url: "/blog", label: "文章列表" });
urls.push({ url: "/compare", label: "品类索引" });

// 人群页
for (const p of ["ecommerce", "video-creator", "podcaster", "writer", "student", "developer"]) {
  urls.push({ url: `/for/${p}`, label: `人群页-${p}` });
}

// 工具详情页
for (const slug of toolSlugs) {
  urls.push({ url: `/tools/${slug}`, label: `工具-${slug}` });
}

// /go/ 跳转页
for (const slug of toolSlugs) {
  urls.push({ url: `/go/${slug}`, label: `跳转-${slug}`, allowRedirect: true });
}

// 工作流页面
for (const identity of matcherData.identities) {
  for (const pp of identity.painpoints) {
    for (const budget of ["free", "paid", "cn-free"]) {
      if (pp.workflows[budget]) {
        urls.push({
          url: `/workflows/${identity.id}/${pp.id}/${budget}`,
          label: `工作流-${identity.id}/${pp.id}/${budget}`,
        });
      }
    }
  }
}

// 品类对比页
for (const scene of [
  "ai-writing", "ai-image", "ai-video", "ai-efficiency", "ai-coding",
  "ai-marketing", "ai-design", "ai-music", "ai-ppt", "ai-language", "ai-blog",
]) {
  urls.push({ url: `/compare/${scene}`, label: `品类-${scene}` });
}

// 文章页
for (const slug of articleSlugs) {
  const articleData = JSON.parse(
    fs.readFileSync(path.join(ROOT, "data/articles", `${slug}.json`), "utf-8")
  );
  const publishDate = new Date(articleData.publishedAt);
  const isPublished = publishDate <= new Date();
  urls.push({
    url: `/blog/${slug}`,
    label: `文章-${slug}`,
    expectStatus: isPublished ? 200 : 404,
  });
}

// ===== 扫描 =====
const CONCURRENCY = 10; // 并发数
let passed = 0;
let failed = 0;
const failures = [];

async function checkUrl(item) {
  const fullUrl = `${BASE_URL}${item.url}`;
  try {
    const resp = await fetch(fullUrl, {
      redirect: item.allowRedirect ? "follow" : "follow",
      signal: AbortSignal.timeout(10000),
    });

    const expectedStatus = item.expectStatus || 200;
    const ok =
      item.allowRedirect
        ? resp.status < 500 && resp.status !== 404
        : resp.status === expectedStatus;

    if (ok) {
      passed++;
      // 只打印失败的，成功的静默
    } else {
      failed++;
      const msg = `❌ ${item.url} → ${resp.status}（期望 ${expectedStatus}）`;
      failures.push(msg);
      console.log(msg);
    }
  } catch (err) {
    failed++;
    const msg = `❌ ${item.url} → 连接失败: ${err.message}`;
    failures.push(msg);
    console.log(msg);
  }
}

async function runBatch(items, concurrency) {
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    await Promise.all(batch.map(checkUrl));
    // 进度
    const done = Math.min(i + concurrency, items.length);
    process.stdout.write(`\r  扫描进度: ${done}/${items.length}`);
  }
  console.log("");
}

// ===== 主流程 =====
console.log("╔══════════════════════════════════════════╗");
console.log("║   GoPick.ai 全站 URL 扫描器              ║");
console.log("╚══════════════════════════════════════════╝");
console.log(`  目标: ${BASE_URL}`);
console.log(`  URL 总数: ${urls.length}`);
console.log("");

const startTime = Date.now();
await runBatch(urls, CONCURRENCY);
const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

console.log("");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(`  扫描完成（${elapsed}秒）`);
console.log(`  ✅ 通过: ${passed}`);
console.log(`  ❌ 失败: ${failed}`);
console.log(`  📊 通过率: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

if (failures.length > 0) {
  console.log("");
  console.log("  ━━━ 失败详情 ━━━");
  failures.forEach((f) => console.log(`  ${f}`));
}

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

// 退出码
process.exit(failed > 0 ? 1 : 0);
