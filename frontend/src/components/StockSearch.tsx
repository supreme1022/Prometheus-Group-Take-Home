import { useState } from "react";

// Define search component props
type StockSearchProps = {
    onSearch: (symbol: string) => void;
    loading: boolean;
};

const StockSearch = ({ onSearch, loading }: StockSearchProps) => {
    const [symbol, setSymbol] = useState("");
    return (
        <form
            onSubmit={(event) => {
                // Prevent page reload on submission
                event.preventDefault();

                // Remove extra spaces
                const cleanedSymbol = symbol.trim().toUpperCase();

                if (cleanedSymbol) {
                    onSearch(cleanedSymbol);
                }
            }}
        >
            <label htmlFor="symbol">Stock symbol</label>

            <input
                id="symbol"
                type="text"
                placeholder="TSLA"
                value={symbol}
                onChange={(event) => setSymbol(event.target.value)}
                disabled={loading}
                required
            />

            <button type="submit" disabled={loading || !symbol.trim()}>
                {loading ? "Searching..." : "Search"}
            </button>
        </form>
    );
};

export default StockSearch
