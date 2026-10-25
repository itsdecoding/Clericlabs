import { NextResponse } from "next/server";
import { scanAccountsForOutliers } from "@/lib/radarScanner";
import { WatchlistAccount, INITIAL_WATCHLIST } from "@/data/mockData";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const accounts: WatchlistAccount[] =
      Array.isArray(body?.accounts) && body.accounts.length > 0
        ? body.accounts
        : INITIAL_WATCHLIST;

    // Run the scraper and 7-day outlier calculation
    const scanResult = await scanAccountsForOutliers(accounts);

    return NextResponse.json({
      success: true,
      scannedCount: scanResult.scannedAccounts,
      outliersFound: scanResult.outliersFound,
      outliers: scanResult.outliers,
      timestamp: scanResult.timestamp,
    });
  } catch (error) {
    console.error("Radar scan error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to scan monitored accounts",
      },
      { status: 500 }
    );
  }
}
