"use client";

import type { Transaction } from "./types";
import { formatNumber } from "./utils";

type TransactionHistoryProps = {
  transactions: Transaction[];
  showAllTransactions: boolean;
  setShowAllTransactions: (show: boolean) => void;
  currency: string;
};

const TransactionHistory = ({
  transactions,
  showAllTransactions,
  setShowAllTransactions,
  currency,
}: TransactionHistoryProps) => {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Transaction History
        </h2>
        <button
          onClick={() => setShowAllTransactions(!showAllTransactions)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {showAllTransactions ? "Hide Details" : "Show All Transactions"}
        </button>
      </div>

      {showAllTransactions && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  Description
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  Type
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  {currency} Amount
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  MYR Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((tx, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 ${
                    tx.type === "buy"
                      ? "text-green-600"
                      : tx.type === "sell"
                        ? "text-red-600"
                        : ""
                  }`}
                >
                  <td className="px-4 py-2">{tx.date}</td>
                  <td className="px-4 py-2">{tx.description}</td>
                  <td className="px-4 py-2 capitalize">{tx.type}</td>
                  <td className="px-4 py-2">{formatNumber(tx.amount, 8)}</td>
                  <td className="px-4 py-2">
                    MYR {formatNumber(Math.abs(tx.myr))}
                    {tx.type === "sell" && tx.myr < 0 && " (proceeds)"}
                    {tx.type === "buy" && " (cost)"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
