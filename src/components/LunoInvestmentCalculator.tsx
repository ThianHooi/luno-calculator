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

            const currencyFromFile =
              results.data[0]?.Currency === "XBT"
                ? "BTC"
                : results.data[0]?.Currency;
            setCurrency(currencyFromFile ?? "BTC");

            const allTransactions = results.data;

            if (allTransactions.length === 0) {
              setError(`No ${currency} transactions found in the CSV file`);
              setIsLoading(false);
              return;
            }

            // Group transactions by reference ID to combine main transactions with their fees
            const groupedByReference: Record<string, CSVRow[]> = {};
            allTransactions.forEach((row) => {
              const reference = row.Reference ?? "";
              groupedByReference[reference] ??= [];
              groupedByReference[reference].push(row);
            });

            // Process each transaction group to combine main transactions with their fees
            const mappedTransactions: Transaction[] = [];

            Object.entries(groupedByReference).forEach(([reference, group]) => {
              // Find main transaction and fee transactions in this group
              const mainTx = group.find(
                (row) => !row.Description?.includes("Trading fee"),
              );
              const feeTxs = group.filter((row) =>
                row.Description?.includes("Trading fee"),
              );

              if (mainTx) {
                // Format the date
                let formattedDate = "";
                if (mainTx["Timestamp (UTC)"]) {
                  const date = new Date(mainTx["Timestamp (UTC)"]);
                  formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}, ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
                }

                // Calculate total fees
                const feeAmountCrypto = feeTxs.reduce(
                  (sum, tx) => sum + (tx["Balance delta"] ?? 0),
                  0,
                );
                const feeAmountMYR = feeTxs.reduce(
                  (sum, tx) => sum + (tx["Value amount"] ?? 0),
                  0,
                );

                // Determine if it's a buy or sell transaction
                const mainAmount = mainTx["Balance delta"] ?? 0;
                const isBuy = mainAmount > 0;
                const isSell = mainAmount < 0;

                // Create processed transaction with fees incorporated
                mappedTransactions.push({
                  date: formattedDate,
                  description: mainTx.Description ?? "Transaction",
                  amount: mainAmount + feeAmountCrypto, // Incorporate fee amount
                  myr: isBuy
                    ? (mainTx["Value amount"] ?? 0) + feeAmountMYR // For buys: add fee to cost
                    : -1 * (mainTx["Value amount"] ?? 0) - feeAmountMYR, // For sells: negate proceeds and subtract fee
                  type: isBuy ? "buy" : isSell ? "sell" : "other",
                  reference: reference,
                });
              } else if (group.length > 0) {
                // Handle orphaned fee or other transaction types
                const tx = group[0]!;
                let formattedDate = "";

                if (tx["Timestamp (UTC)"]) {
                  const date = new Date(tx["Timestamp (UTC)"]);
                  formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}, ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
                }

                mappedTransactions.push({
                  date: formattedDate,
                  description: tx.Description ?? "Transaction",
                  amount: tx["Balance delta"] ?? 0,
                  myr: tx["Value amount"] ?? 0,
                  type: tx.Description?.includes("Trading fee")
                    ? "fee"
                    : "other",
                  reference: reference,
                });
              }
            });

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

    // Get the display currency (show BTC instead of XBT for consistency)
    const displayCurrency = currency.toUpperCase() === "XBT" ? "BTC" : currency;

    // Sum up the amounts and costs
    const totalAmount = transactions.reduce(
      (total, tx) => total + tx.amount,
      0,
    );
    const totalMyr = transactions.reduce((total, tx) => total + tx.myr, 0);

    // Calculate the average cost basis
    const averagePrice = totalAmount !== 0 ? totalMyr / totalAmount : 0;

    // Current portfolio value
    const currentValue = totalAmount * currentPrice;

    // Profit/loss
    const profit = currentValue - totalMyr;

    // ROI
    const roiPercentage = totalMyr !== 0 ? (profit / totalMyr) * 100 : 0;

    return {
      currency: displayCurrency,
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
      const year = date?.split("/")[2];

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
    <div className="mx-auto max-w-7xl rounded-lg bg-white p-6 shadow">
      <h1 className="mb-6 text-center text-2xl font-bold text-blue-700">
        Cryptocurrency Investment Calculator - LUNO
      </h1>

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
