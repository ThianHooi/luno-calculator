"use client";

import type { ChangeEvent } from "react";
import type { Transaction } from "./types";

type FileUploadSectionProps = {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  handleFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
};

const FileUploadSection = ({
  transactions,
  isLoading,
  error,
  handleFileUpload,
}: FileUploadSectionProps) => {
  return (
    <div className="mb-8 rounded-lg bg-gray-50 p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">
        Upload Your Data
      </h2>
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <div className="w-full">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Upload your transaction CSV file
          </label>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <label className="flex h-12 w-full cursor-pointer appearance-none items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-white px-4 transition hover:border-blue-500 focus:outline-none">
                <span className="text-sm text-gray-600">
                  {isLoading
                    ? "Processing..."
                    : "Choose a file or drag and drop"}
                </span>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                />
              </label>
            </div>
          </div>
          {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
          <div className="mt-2 text-sm text-gray-500">
            <p>
              {transactions.length > 0
                ? `${transactions.length} transactions loaded`
                : "No data loaded yet. Please upload a CSV file."}
            </p>
            <p>
              CSV should include columns: Timestamp (UTC), Description,
              Currency, Balance delta, Value amount
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadSection;
