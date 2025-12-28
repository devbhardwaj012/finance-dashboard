// src/lib/config/defaultDashboard.js

/**
 * Default dashboard configuration for new users
 * This provides a better UX by showing pre-configured widgets on first visit
 */
export const DEFAULT_DASHBOARD = {
  version: 1,
  dashboard: {
    widgets: [
      {
        id: "5a57d84d-0642-4afd-b9f5-dcc0378141df",
        name: "Groww Stock Price",
        url: "https://stock.indianapi.in/stock?name=Groww",
        apiKey: "",
        apiKeyHeader: "X-Api-Key",
        apiKeyPrefix: "",
        interval: 3600,
        type: "card",
        cardFields: [
          "companyName",
          "industry",
          "currentPrice.BSE",
          "currentPrice.NSE",
          "percentChange",
          "yearHigh",
          "yearLow"
        ],
        width: 423,
        height: 412
      },
      {
        id: "22620c82-79c9-4795-acf7-f74bd348ad26",
        name: "Tata Financials",
        url: "https://stock.indianapi.in/stock?name=Tata+Steel",
        apiKey: "",
        apiKeyHeader: "X-Api-Key",
        apiKeyPrefix: "",
        interval: 3600,
        type: "table",
        arrayPath: "financials",
        tableFields: [
          "Type",
          "EndDate",
          "FiscalYear"
        ],
        width: 545,
        height: 366
      },
      {
        id: "default-BTC-card",
        name: "Bitcoin Price Overview",
        url: "https://api.coinbase.com/v2/exchange-rates?currency=BTC",
        apiKey: "",
        apiKeyHeader: "X-Api-Key",
        apiKeyPrefix: "",
        interval: 20,
        type: "card",
        cardFields: [
          "data.currency",
          "data.rates.USD",
          "data.rates.EUR"
        ],
        width: 452,
        height: 335
      },
      {
        id: "default-ibm-chart",
        name: "IBM Daily High Chart",
        url: "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo",
        apiKey: "",
        apiKeyHeader: "X-Api-Key",
        apiKeyPrefix: "",
        interval: 30,
        type: "chart",
        seriesPath: "Time Series (Daily)",
        yField: "2. high",
        width: 646,
        height: 385
      },
      {
        id: "default-apple-chart",
        name: "Apple Weekly High Chart",
        url: "https://api.twelvedata.com/time_series?symbol=AAPL&interval=1week&apikey=demo",
        apiKey: "",
        apiKeyHeader: "X-Api-Key",
        apiKeyPrefix: "",
        interval: 30,
        type: "chart",
        seriesPath: "values",
        yField: "high",
        width: 581,
        height: 326
      }
    ],
    theme: "dark"
  }
};

/**
 * Check if user is visiting for the first time
 * @param {string} storageKey - The localStorage key to check
 * @returns {boolean}
 */
export function isFirstTimeUser(storageKey) {
  try {
    const stored = localStorage.getItem(storageKey);
    return !stored || stored === "[]" || JSON.parse(stored).length === 0;
  } catch (error) {
    console.error("Error checking first-time user:", error);
    return true;
  }
}

/**
 * Get initial widgets - either default or from localStorage
 * @param {string} storageKey - The localStorage key
 * @returns {Array}
 */
export function getInitialWidgets(storageKey) {
  try {
    const stored = localStorage.getItem(storageKey);
    
    if (!stored || stored === "[]") {
      // First time user - return default widgets
      return DEFAULT_DASHBOARD.dashboard.widgets;
    }
    
    const parsed = JSON.parse(stored);
    return parsed.length === 0 ? DEFAULT_DASHBOARD.dashboard.widgets : parsed;
  } catch (error) {
    console.error("Error loading widgets:", error);
    return DEFAULT_DASHBOARD.dashboard.widgets;
  }
}