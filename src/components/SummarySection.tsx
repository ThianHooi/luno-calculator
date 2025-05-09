"use client";

import type { Metrics } from "./types";
import { formatNumber } from "./utils";

type SummarySectionProps = {
  metrics: Metrics;
};

const SummarySection = ({ metrics }: SummarySectionProps) => {
  return (
    <div className="mb-8 rounded-lg bg-blue-50 p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold text-blue-800">
        Investment Summary
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded bg-white p-4 shadow">
          <h3 className="text-sm font-medium text-gray-500">Total {metrics.currency}</h3>
          <p className="text-2xl font-bold text-blue-600">
            {formatNumber(metrics.totalAmount, 8)} {metrics.currency}
          </p>
        </div>
        <div className="rounded bg-white p-4 shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Total Investment
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            MYR {formatNumber(metrics.totalMyr)}
          </p>
        </div>
        <div className="rounded bg-white p-4 shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Average Purchase Price
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            MYR {formatNumber(metrics.averagePrice)}/{metrics.currency}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummarySection;