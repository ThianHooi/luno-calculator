/**
 * Format number with commas and specified decimal places
 */
export const formatNumber = (number: number, decimals = 2): string => {
  return number.toLocaleString("en-MY", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Generate a sample CSV content for download
 */
export const generateSampleCSV = (): string => {
  return [
    "Wallet ID,Row,Timestamp (UTC),Description,Currency,Balance delta,Available balance delta,Balance,Available balance,Cryptocurrency transaction ID,Cryptocurrency address,Value currency,Value amount,Reference",
    '9061778909545963731,1,2021-11-18T16:46:00Z,"Bought 0.0119 ETH/MYR @ 17,140",ETH,0.0119,0.0119,0.0119,0.0119,,,MYR,203.96,',
    "9061778909545963731,2,2021-11-18T16:46:00Z,Trading fee,ETH,-0.00002975,-0.00002975,0.01187025,0.01187025,,,MYR,0.51,",
    '9061778909545963731,3,2021-11-18T16:46:00Z,"Bought 0.0172 ETH/MYR @ 17,140",ETH,0.0172,0.0172,0.02907025,0.02907025,,,MYR,294.80,',
    "9061778909545963731,4,2021-11-18T16:46:00Z,Trading fee,ETH,-0.000043,-0.000043,0.02902725,0.02902725,,,MYR,0.74,",
    '9061778909545963731,5,2021-12-29T23:21:00Z,"Bought 0.0322 ETH/MYR @ 15,480",ETH,0.0322,0.0322,0.06122725,0.06122725,,,MYR,498.45,',
    "9061778909545963731,6,2021-12-29T23:21:00Z,Trading fee,ETH,-0.0000805,-0.0000805,0.06114675,0.06114675,,,MYR,1.25,",
    '9061778909545963731,7,2022-01-25T16:17:00Z,"Bought 0.0242 ETH/MYR @ 10,299",ETH,0.0242,0.0242,0.08534675,0.08534675,,,MYR,249.23,',
  ].join("\n");
};
