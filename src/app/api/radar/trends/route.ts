import { NextResponse } from "next/server";
import { scanInternetForAITrends } from "@/lib/nicheTrendScanner";

export async function GET() {
  try {
    const result = await scanInternetForAITrends();
    return NextResponse.json({
      success: true,
      trends: result.trends,
      total: result.totalFound,
      sources: result.sourcesScanned,
      timestamp: result.timestamp,
    });
  } catch (error: any) {
    console.error("Trends scan error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to scan internet trends",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
