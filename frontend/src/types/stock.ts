// Define the daily stock data returned by the backend
type DailyStock = {
    day: string;
    lowAverage: number | null;
    highAverage: number | null;
    volume: number;
};

export type { DailyStock };