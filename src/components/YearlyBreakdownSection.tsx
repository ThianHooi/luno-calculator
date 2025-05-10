"use client";

import type { YearlyBreakdown } from "./types";
import { formatNumber } from "./utils";

type YearlyBreakdownProps = {
  transactionsByYear: YearlyBreakdown;
  currentPrice: number;
  currency: string;
};

const YearlyBreakdownSection = ({
  transactionsByYear,
  currentPrice,
  currency,
}: YearlyBreakdownProps) => {
  if (Object.keys(transactionsByYear).length === 0) {
    return null;
  }
  
  // Get the display currency (show BTC instead of XBT for consistency)
  const displayCurrency = currency.toUpperCase() === "XBT" ? "BTC" : currency;

  return (
    <div className="mb-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">
        Yearly Breakdown
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Year
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                {displayCurrency} Purchased
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                MYR Spent
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Avg. Price
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Current Value
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                ROI
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Object.keys(transactionsByYear).map((year) => {
              const yearData = transactionsByYear[year];

              if (!yearData) return null;

              const yearAvgPrice =
                yearData.totalAmount !== 0
                  ? yearData.totalMyr / yearData.totalAmount
                  : 0;
              const yearCurrentValue = yearData.totalAmount * currentPrice;
              const yearProfit = yearCurrentValue - yearData.totalMyr;
              const yearRoi =
                yearData.totalMyr !== 0
                  ? (yearProfit / yearData.totalMyr) * 100
                  : 0;

              return (
                <tr key={year} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{year}</td>
                  <td className="px-4 py-3">
                    {formatNumber(yearData.totalAmount, 8)}
                  </td>
                  <td className="px-4 py-3">
                    MYR {formatNumber(yearData.totalMyr)}
                  </td>
                  <td className="px-4 py-3">
                    MYR {formatNumber(yearAvgPrice)}
                  </td>
                  <td className="px-4 py-3">
                    MYR {formatNumber(yearCurrentValue)}
                  </td>
                  <td
                    className={`px-4 py-3 ${yearRoi >= 0 ? "text-green-600" : "text-red-600"} font-medium`}
                  >
                    {formatNumber(yearRoi)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default YearlyBreakdownSection;