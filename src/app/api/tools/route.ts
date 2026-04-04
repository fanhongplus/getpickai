import { NextResponse } from "next/server";
import { getAllTools } from "@/lib/data";

export async function GET() {
  const tools = getAllTools();
  return NextResponse.json(tools);
}
