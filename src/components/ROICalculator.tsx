"use client";

import type { Metrics } from "./types";
import { formatNumber } from "./utils";

type ROICalculatorProps = {
  currentPrice: number;
  setCurrentPrice: (price: number) => void;
  metrics: Metrics;
};

const ROICalculator = ({
  currentPrice,
  setCurrentPrice,
  metrics,
}: ROICalculatorProps) => {
  return (
    <div className="mb-8 rounded-lg bg-green-50 p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold text-green-800">
        Return on Investment
      </h2>
      <div className="mb-4">
        <div className="mb-4 w-full md:w-1/2">
          <label className="mb-1 block text-2xl font-bold text-gray-700">
            Current {metrics.currency} Price (MYR)
          </label>
          <input
            type="number"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(Number(e.target.value))}
            className="w-full rounded border-2 border-gray-500 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded bg-white p-4 shadow">
            <h3 className="text-sm font-medium text-gray-500">Current Value</h3>
            <p className="text-2xl font-bold text-green-600">
              MYR {formatNumber(metrics.currentValue)}
            </p>
          </div>
          <div className="rounded bg-white p-4 shadow">
            <h3 className="text-sm font-medium text-gray-500">Profit/Loss</h3>
            <p
              className={`text-2xl font-bold ${metrics.profit >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              MYR {formatNumber(metrics.profit)}
            </p>
          </div>
          <div className="rounded bg-white p-4 shadow">
            <h3 className="text-sm font-medium text-gray-500">ROI</h3>
            <p
              className={`text-2xl font-bold ${metrics.roiPercentage >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {formatNumber(metrics.roiPercentage)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;
