import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 记录 Affiliate 点击数据
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const clickLog = {
      ...data,
      user_agent: request.headers.get("user-agent") || "",
      recorded_at: new Date().toISOString(),
    };

    // 追加到 JSON 文件（MVP 简单方案）
    const logPath = path.join(process.cwd(), "data/clicks.json");
    let clicks: unknown[] = [];
    if (fs.existsSync(logPath)) {
      clicks = JSON.parse(fs.readFileSync(logPath, "utf-8"));
    }
    clicks.push(clickLog);
    fs.writeFileSync(logPath, JSON.stringify(clicks, null, 2));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
