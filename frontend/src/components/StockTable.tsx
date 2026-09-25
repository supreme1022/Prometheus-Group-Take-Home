import type { DailyStock } from "../types/stock";

// Define search component props
type StockTableProps = {
    stocks: DailyStock[];
    symbol: string;
};

// Format prices to four decimal places + mark missing values
const formatPrice = (value: number | null) => {
    return value === null
        ? "-"
        : value.toLocaleString("en-US", {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
        });
};

const StockTable = ({ stocks, symbol }: StockTableProps) => {
    return (
        <div className="table-container">
            <table>
                <caption>{symbol} - daily results for the past month</caption>

                <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Average Low</th>
                        <th scope="col">Average High</th>
                        <th scope="col">Volume</th>
                    </tr>
                </thead>

                <tbody>
                    {/* Display one row for each day */}
                    {stocks.map((stock) => (
                        <tr key={stock.day}>
                            <th scope="row">{stock.day}</th>
                            <td>{formatPrice(stock.lowAverage)}</td>
                            <td>{formatPrice(stock.highAverage)}</td>
                            <td>{stock.volume.toLocaleString("en-US")}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StockTable;