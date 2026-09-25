import type { DailyStock } from "../types/stock";

// Request stock data from backend
const getStocks = async (symbol: string): Promise<DailyStock[]> => {
    const response = await fetch(
        `http://localhost:3000/api/stocks/${encodeURIComponent(symbol)}`
    );

    // Pass backend error message to frontend
    if (!response.ok) {
        const error = await response.json().catch(() => null);

        throw new Error(
            error?.error || "Unable to load to stock data. Please try again."
        );
    }

    return response.json();
};

export default getStocks;