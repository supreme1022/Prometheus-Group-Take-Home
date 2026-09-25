import { useState } from "react";
import StockSearch from "./components/StockSearch";
import StockTable from "./components/StockTable";
import getStocks from "./api/stocks";
import type { DailyStock } from "./types/stock";
import './App.css'

const App = () => {
  // Track stock results + search status
  const [stocks, setStocks] = useState<DailyStock[]>([]);
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchSymbol: string) => {
    // Clear previous results and start loading
    setLoading(true);
    setError("");
    setStocks([]);
    setSymbol(searchSymbol);
    setHasSearched(true);

    try {
      // Fetch and store daily stock data
      const results = await getStocks(searchSymbol);
      setStocks(results);
    } catch (error) {
      // Handle connection errors and backend error messages
      setError(
        error instanceof TypeError
          ? "Unable to connect to the server. Please try again."
          : error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."
      );
    } finally {
      // Stop loading whether the request succeeds or fails
      setLoading(false)
    }
  };

  return (
    <main className="app">
      <header className="page-header">
        <p className="eyebrow">MARKET EXPLORER</p>
        <h1>Stock History</h1>
        <p>
          Explore daily price averages and trading volume from the past month.
        </p>
      </header>

      <section className="search-card" aria-label="Stock search">
        <StockSearch onSearch={handleSearch} loading={loading} />

        <p className="hint">
          Enter a stock symbol, such as AAPL, TSLA, or MSFT
        </p>
      </section>

      <section
        className="results"
        aria-label="Stock results"
        aria-busy={loading}
      >
        {/* Display loading, initial, and empty states */}
        <div role="status">
          {loading && <p className="message">Loading {symbol}...</p>}

          {!loading && !hasSearched && (
            <p className="message">
              Searched for a symbol to view its history.
            </p>
          )}

          {!loading && hasSearched && !error && stocks.length === 0 && (
            <p className="message">No results found for {symbol}.</p>
          )}
        </div>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && stocks.length > 0 && (
          <>
            <StockTable stocks={stocks} symbol={symbol} />

            <p className="hint">
              Prices are averages of 15-minute interval lows and highs, in the
              stock’s quoted currency. Dates follow the exchange’s time zone.
              Volume is summed for each day. Missing prices appear as —. 
            </p>
          </>
        )}
      </section>
    </main>
  );
};

export default App;
