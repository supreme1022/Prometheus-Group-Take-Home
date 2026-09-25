import express = require("express");
const router = express.Router();

// GET REQUESTS
router.get("/:symbol", async (req, res) => {

    try {

        // Create symbol variable
        const { symbol } = req.params;
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=15m&range=1mo`;

        // Get the header from the url
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            },
            signal: AbortSignal.timeout(10000)
        });

        // Error handling
        if (!response.ok) {
            const status = response.status === 404 ? 404 : 502;
            const message = status === 404
                ? "Stock symbol not found."
                : "Unable to retrieve stock data. Please try again.";

            res.status(status).json({ error: message });
            return;
        }

        const data = await response.json();
        

        // Extract and check the arrays
        const result = data.chart?.result?.[0];
        const timestamps = result?.timestamp;
        const quote = result?.indicators?.quote?.[0];

        if (
            !Array.isArray(timestamps) ||
            timestamps.length === 0 ||
            !Array.isArray(quote?.low) ||
            !Array.isArray(quote?.high) ||
            !Array.isArray(quote?.volume)
        ) {
            res.status(502).json({
                error: "No usable stock data was returned."
            });
            return;
        }

        const { low, high, volume } = quote;


        // Convert timestamps + Group entries
        const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: result.meta.exchangeTimezoneName,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });

        // Create entry class
        type Entry = {
            low: number | null;
            high: number | null;
            volume: number | null;
        };

        const grouped = new Map<string, Entry[]>();

        // Loop through timestamps
        for (let i = 0; i < timestamps.length; i++) {
            const date = new Date(timestamps[i] * 1000);
            const parts = formatter.formatToParts(date);

            const year = parts.find(p => p.type === "year")!.value;
            const month = parts.find(p => p.type === "month")!.value;
            const day = parts.find(p => p.type === "day")!.value;

            const dateKey = `${year}-${month}-${day}`;

            if (!grouped.has(dateKey)) {
                grouped.set(dateKey, []);
            }

            grouped.get(dateKey)!.push({
                low: low[i] ?? null,
                high: high[i] ?? null,
                volume: volume[i] ?? null
            });
        }

        // Calculate each day's average and total volume
        const dailyResults = Array.from(grouped, ([day, entries]) => {
            const lows = entries
                .map(entry => entry.low)
                .filter((value): value is number => value !== null);

            const highs = entries
                .map(entry => entry.high)
                .filter((value): value is number => value !== null);

            return {
                day,
                lowAverage: lows.length
                    ? Number((lows.reduce((sum, value) => sum + value, 0) / lows.length).toFixed(4))
                    : null,
                highAverage: highs.length
                    ? Number((highs.reduce((sum, value) => sum + value, 0) / highs.length).toFixed(4))
                    : null,
                volume: entries.reduce((sum, entry) => sum + (entry.volume ?? 0), 0)
            };
        });

        dailyResults.sort((a, b) => a.day.localeCompare(b.day));

        
        res.json(dailyResults);
    
    // Catch any errors
    } catch (error) {
        console.error(error);

        const timedOut =
            error instanceof Error && error.name === "TimeoutError";

        res.status(timedOut ? 504 : 500).json({
            error: timedOut
                ? "Stock data request timed out. Please try again."
                : "Unable to process stock data."
        });
    }
});

export = router; 