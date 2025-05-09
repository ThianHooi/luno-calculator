"use client";

import React, { useState, useCallback } from "react";
import Papa from "papaparse";
import type { Transaction, CSVRow, YearlyBreakdown, Metrics } from "./types";
import FileUploadSection from "./FileUploadSection";
import SummarySection from "./SummarySection";
import ROICalculator from "./ROICalculator";
import YearlyBreakdownSection from "./YearlyBreakdownSection";
import TransactionHistory from "./TransactionHistory";
import { generateSampleCSV } from "./utils";

const LunoInvestmentCalculator: React.FC = () => {
  const [currency, setCurrency] = useState<string>("ETH");
  const [currentPrice, setCurrentPrice] = useState<number>(10000);
  const [showAllTransactions, setShowAllTransactions] =
    useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to parse CSV file and extract transactions for the selected currency
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsLoading(true);
      setError(null);

      Papa.parse<CSVRow>(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            if (results.errors && results.errors.length > 0) {
              setError(`Error parsing CSV: ${results?.errors?.[0]?.message}`);
              setIsLoading(false);
              return;
            }

            // Filter for transactions of the selected currency
            const filteredTransactions = results.data.filter(
              (row) => row.Currency?.toUpperCase() === currency.toUpperCase(),
            );

            if (filteredTransactions.length === 0) {
              setError(`No ${currency} transactions found in the CSV file`);
              setIsLoading(false);
              return;
            }

            // Map CSV data to our transaction format
            const mappedTransactions: Transaction[] = filteredTransactions.map(
              (row) => {
                // Format the date from timestamp
                let formattedDate = "";

                if (row["Timestamp (UTC)"]) {
                  const date = new Date(row["Timestamp (UTC)"]);
                  formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}, ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
                }

                return {
                  date: formattedDate,
                  description: row.Description ?? "Transaction",
                  amount: row["Balance delta"] ?? 0,
                  myr: row["Value amount"] ?? 0,
                };
              },
            );

            setTransactions(mappedTransactions);
            setIsLoading(false);
          } catch (error) {
            setError(`Error processing CSV: ${(error as Error).message}`);
            setIsLoading(false);
          }
        },
        error: (error) => {
          setError(`Error parsing CSV: ${error.message}`);
          setIsLoading(false);
        },
      });
    },
    [currency],
  );

  // Calculate investment metrics
  const calculateMetrics = (): Metrics => {
    // Handle empty transactions case
    if (transactions.length === 0) {
      return {
        currency,
        totalAmount: 0,
        totalMyr: 0,
        averagePrice: 0,
        currentValue: 0,
        profit: 0,
        roiPercentage: 0,
      };
    }

    const totalAmount = transactions.reduce(
      (total, tx) => total + tx.amount,
      0,
    );
    const totalMyr = transactions.reduce((total, tx) => total + tx.myr, 0);
    const averagePrice = totalAmount !== 0 ? totalMyr / totalAmount : 0;
    const currentValue = totalAmount * currentPrice;
    const profit = currentValue - totalMyr;
    const roiPercentage = totalMyr !== 0 ? (profit / totalMyr) * 100 : 0;

    return {
      currency,
      totalAmount,
      totalMyr,
      averagePrice,
      currentValue,
      profit,
      roiPercentage,
    };
  };

  const metrics = calculateMetrics();

  // Group transactions by year
  const getTransactionsByYear = (): YearlyBreakdown => {
    const groupedByYear: YearlyBreakdown = {};

    transactions.forEach((tx) => {
      const date = tx.date.split(", ")[0];
      const year = date!.split("/")[2];

      if (!year) return;

      groupedByYear[year] ??= {
        transactions: [],
        totalAmount: 0,
        totalMyr: 0,
      };

      groupedByYear[year].transactions.push(tx);
      groupedByYear[year].totalAmount += tx.amount;
      groupedByYear[year].totalMyr += tx.myr;
    });

    return groupedByYear;
  };

  const transactionsByYear = getTransactionsByYear();

  return (
    <div className="mx-auto max-w-6xl rounded-lg bg-white p-6 shadow">
      <h1 className="mb-6 text-center text-2xl font-bold text-blue-700">
        Cryptocurrency Investment Calculator
      </h1>

      {/* Currency Selection */}
      <div className="mb-6 rounded-lg bg-blue-50 p-4 shadow">
        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <div className="mb-4 md:mb-0 md:w-1/3">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Currency
            </label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value.toUpperCase())}
              className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="ETH, BTC, etc."
            />
          </div>
          <div className="text-sm text-gray-600 md:w-2/3">
            <p>
              Enter the cryptocurrency code (e.g., ETH, BTC) to filter
              transactions. The calculator will only process transactions for
              the selected currency.
            </p>
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <FileUploadSection
        transactions={transactions}
        isLoading={isLoading}
        error={error}
        handleFileUpload={handleFileUpload}
      />

      {transactions.length > 0 && (
        <>
          {/* Summary Card */}
          <SummarySection metrics={metrics} />

          {/* ROI Calculator */}
          <ROICalculator
            currentPrice={currentPrice}
            setCurrentPrice={setCurrentPrice}
            metrics={metrics}
          />

          {/* Yearly Breakdown */}
          <YearlyBreakdownSection
            transactionsByYear={transactionsByYear}
            currentPrice={currentPrice}
            currency={currency}
          />

          {/* Transaction History */}
          <TransactionHistory
            transactions={transactions}
            showAllTransactions={showAllTransactions}
            setShowAllTransactions={setShowAllTransactions}
            currency={currency}
          />
        </>
      )}

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>
          {transactions.length > 0
            ? "Data from uploaded CSV file"
            : "Upload your transaction data to get started"}
        </p>
        <p className="mt-2">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              const element = document.createElement("a");
              const file = new Blob([generateSampleCSV()], {
                type: "text/csv",
              });
              element.href = URL.createObjectURL(file);
              element.download = "sample_luno_transactions.csv";
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
            className="text-blue-500 hover:underline"
          >
            Download Sample CSV Format
          </a>
        </p>
      </footer>
    </div>
  );
};

export default LunoInvestmentCalculator;
