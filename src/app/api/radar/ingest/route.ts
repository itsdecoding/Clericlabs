import { NextResponse } from "next/server";
import { WeeklyOutlier } from "@/data/mockData";

// In-memory / edge-compatible store of live scraped outliers
// When local scout pushes real posts, this endpoint caches and delivers them
let LIVE_SCRAPED_OUTLIERS: WeeklyOutlier[] = [];

export async function GET() {
  return NextResponse.json({
    success: true,
    count: LIVE_SCRAPED_OUTLIERS.length,
    outliers: LIVE_SCRAPED_OUTLIERS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const newOutliers: WeeklyOutlier[] = Array.isArray(body?.outliers) ? body.outliers : [];

    if (newOutliers.length === 0) {
      return NextResponse.json(
        { success: false, error: "No outliers provided in request body" },
        { status: 400 }
      );
    }

    // Merge new outliers by ID, keeping highest multiple first
    const map = new Map<string, WeeklyOutlier>();
    for (const item of LIVE_SCRAPED_OUTLIERS) {
      map.set(item.id, item);
    }
    for (const item of newOutliers) {
      map.set(item.id, item);
    }

    LIVE_SCRAPED_OUTLIERS = Array.from(map.values()).sort(
      (a, b) => b.outlierMultiple - a.outlierMultiple
    );

    return NextResponse.json({
      success: true,
      message: `Successfully ingested ${newOutliers.length} live outliers`,
      totalStored: LIVE_SCRAPED_OUTLIERS.length,
      outliers: LIVE_SCRAPED_OUTLIERS,
    });
  } catch (error: any) {
    console.error("Ingest error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to ingest outliers" },
      { status: 500 }
    );
  }
}
