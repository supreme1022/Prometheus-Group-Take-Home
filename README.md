# Stock History

A full-stack application built for the Prometheus Group take-home assessment. Users can search for a stock symbol and view daily average lows, average highs, and total trading volume for the past month.

## Tech Stack

- Frontend: React, TypeScript, Vite, CSS
- Backend: Node.js, Express, TypeScript
- Data source: Yahoo Finance chart endpoint

## Features

- Search by stock symbol
- View daily stock results in a table
- Loading indicators and error messages
- Responsive layout
- Backend request timeout of 10 seconds

## Project Structure

- `backend/src/index.ts` — Express setup, CORS, and route registration
- `backend/src/routes/stockRoutes.ts` — Fetching, grouping, and calculating stock data
- `frontend/src/App.tsx` — Search handling and application state
- `frontend/src/components/StockSearch.tsx` — Search form
- `frontend/src/components/StockTable.tsx` — Results table
- `frontend/src/api/stocks.ts` — Backend requests
- `frontend/src/types/stock.ts` — Daily stock result type
- `PROMPT_LOG.md` — AI assistance and implementation decisions

## Getting Started

### Requirements

- Tested with Node.js v24.13.1
- npm
- Internet access to retrieve Yahoo Finance data

No database or API key is required for this implementation.

### Start the Backend

From the project root:

```bash
cd backend
npm ci
npm run dev
```

The backend runs at `http://localhost:3000`.

### Start the Frontend

Open a second terminal at the project root:

```bash
cd frontend
npm ci
npm run dev
```

Open `http://localhost:5173` in your browser. Keep both terminals running.

The backend allows browser requests from `http://localhost:5173`. If Vite starts on another port, update the CORS origin in `backend/src/index.ts` to match.

## Usage

Enter a stock symbol, such as `AAPL`, `TSLA`, or `MSFT`, and select Search or press Enter.

The table displays:

- Date
- Average low
- Average high
- Total volume

The frontend removes surrounding spaces and converts the symbol to uppercase before submitting it.

## API

### GET `/api/stocks/:symbol`

Example:

```text
http://localhost:3000/api/stocks/AAPL
```

Returns an array of daily results with these fields:

| Field | Type | Description |
| --- | --- | --- |
| `day` | string | Exchange-local date in YYYY-MM-DD format |
| `lowAverage` | number or null | Average of available intraday low prices |
| `highAverage` | number or null | Average of available intraday high prices |
| `volume` | number | Sum of available intraday volume |

Errors are returned as JSON with an `error` message.

| Status | Meaning |
| --- | --- |
| 404 | Upstream service reports the symbol was not found |
| 502 | Upstream request failed or returned unusable data |
| 504 | Upstream request timed out |
| 500 | Unexpected processing error |

## Calculations and Data Handling

The backend requests Yahoo Finance data using `interval=15m` and `range=1mo`.

Timestamps and the low, high, and volume arrays are matched by index. Each timestamp is converted from Unix seconds and grouped by calendar date using the exchange's timezone.

For each day:

- Average low = sum of available low prices divided by their count
- Average high = sum of available high prices divided by their count
- Total volume = sum of available volume values

Price averages are rounded to four decimal places. Results are sorted from oldest to newest.

Missing low and high values are excluded from their respective averages. If a day has no available values for an average, the backend returns `null`, displayed as `—` in the table. Missing volume values contribute zero to the total.

These averages describe intraday interval lows and highs; they are not the day's minimum and maximum prices.

## Validation

Manual checks during development included:

- Requests in Postman
- Displaying results for TSLA and AAPL
- Searching for an invalid symbol and displaying the backend error message
- Displaying a connection error when the frontend could not reach the backend

To check backend TypeScript, run inside `backend`:

```bash
npx tsc --noEmit
```

To check frontend TypeScript and create a production build, run inside `frontend`:

```bash
npm run build
```

These commands check compilation; they do not independently verify the calculation results. No automated test suite is included.

## Limitations

- Data availability depends on Yahoo Finance.
- The first and most recent days in the requested range may contain partial trading data.
- Missing volume can cause daily totals to understate actual volume.
- Each search makes a new request; results are not cached.
- Backend URL and CORS settings are configured for local development.

## AI Assistance

AI was used for explanations, implementation guidance, code generation, and debugging, including frontend components and styling. Prompts and decisions are documented in `PROMPT_LOG.md`.