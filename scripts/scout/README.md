# Clericlabs Autonomous Playwright Desktop Scout

The **Desktop Scout** is an autonomous, residential web-scraping engine that monitors creator accounts on **Threads, 𝕏 (Twitter), and Instagram**, extracts their genuine live posts from the past 7 days, mathematically isolates the weekly viral outliers ($$\ge 2.5\times$$ to $$13\times$$ baseline), and syncs them directly into **Clericlabs Studio**.

---

## 1. Quick Start: How to Run in Terminal

To run the live scraper anytime from your terminal:

```bash
# 1. Open Terminal or PowerShell and navigate to your project:
cd C:\Users\Muzammil\Desktop\Clericlabs

# 2. Run the scout command:
npm run scout
```

That's it! In ~15 seconds, Playwright will:
1. Launch a headless residential browser session.
2. Crawl the public feeds of your target creator handles.
3. Filter out routine posts and identify only 7-day breakout outliers.
4. Calculate hook archetypes (*Contrarian*, *Curiosity Gap*, *Framework*, *Warning*).
5. Generate 3 hook variations and a client draft for each outlier.
6. Sync the real outliers straight to `https://studio.clericlabs.com/radar`.

---

## 2. Project Directory Tree & Exact File Paths

Every asset relating to **Radar** and the **Desktop Scout** is organized cleanly:

```text
C:\Users\Muzammil\Desktop\Clericlabs\
│
├── package.json                         # Defines "npm run scout" script
│
├── scripts\
│   └── scout\
│       ├── index.ts                     # The Playwright scraper & crawler engine
│       └── README.md                    # This complete operational guide
│
├── src\
│   ├── app\
│   │   ├── radar\
│   │   │   └── page.tsx                 # The /radar frontend page
│   │   └── api\
│   │       └── radar\
│   │           ├── scan\
│   │           │   └── route.ts         # In-studio scan API (/api/radar/scan)
│   │           └── ingest\
│   │               └── route.ts         # Desktop scraper sync API (/api/radar/ingest)
│   │
│   ├── components\
│   │   └── radar\
│   │       ├── WatchlistShelf.tsx       # 5–6 Accounts Watchlist UI component
│   │       ├── WeeklyOutlierCard.tsx    # Weekly Outlier card component
│   │       └── RewordDrawer.tsx         # "Reword for Client" slide-over studio
│   │
│   ├── context\
│   │   └── ContentContext.tsx           # Global state, persistence, and pipeline actions
│   │
│   ├── data\
│   │   └── mockData.ts                  # TypeScript interfaces and initial seeds
│   │
│   └── lib\
│       └── radarScanner.ts              # Mathematical anomaly & hook classification engine
```

---

## 3. How to Add or Change Monitored Handles

You can modify who the scraper tracks in two ways:

### Method A: Through the Web UI (Zero Code)
1. Open **[studio.clericlabs.com/radar](https://studio.clericlabs.com/radar)**.
2. In the **Monitored Accounts** shelf at the top, click **`+ Add Account`**.
3. Choose the platform (Threads, 𝕏, Instagram, LinkedIn) and type the creator handle (e.g. `@naval`, `@hubermanlab`).
4. Click **`Scan Accounts`**.

### Method B: Inside the Terminal Script
Edit `scripts/scout/index.ts`:
```typescript
const TARGET_WATCHLIST = [
  { handle: "hubermanlab", platform: "threads", name: "Andrew Huberman", baseline: 850 },
  { handle: "naval", platform: "x", name: "Naval", baseline: 1200 },
  { handle: "behavioral_models", platform: "threads", name: "Behavioral Models", baseline: 320 },
  { handle: "growth_instincts", platform: "x", name: "Growth Instincts", baseline: 190 },
  { handle: "stoic_clarity", platform: "instagram", name: "Stoic Clarity", baseline: 1100 },
];
```

---

## 4. How the Anomaly Math Works

Amateur scrapers search for raw likes. The Clericlabs Scout calculates the **Outperformance Ratio**:

$$\text{Weighted Engagement} = \text{Likes} + (\text{Reposts} \times 2) + (\text{Comments} \times 3)$$
$$\text{Outlier Multiple} = \frac{\text{Weighted Engagement}}{\text{Account Baseline}}$$

* **$$\ge 2.5\times$$**: Tagged as an authentic **Weekly Outlier** and sent to the board.
* **$$< 2.5\times$$**: Discarded automatically to keep your feed 100% signal, 0% noise.
