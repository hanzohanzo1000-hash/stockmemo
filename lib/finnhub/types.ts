export type FinnhubQuote = {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
};

export type FinnhubCandleResponse = {
  c: number[];
  h: number[];
  l: number[];
  o: number[];
  t: number[];
  v: number[];
  s: "ok" | "no_data";
};

export type ChartRange = "1W" | "1M" | "3M" | "6M" | "1Y";

export type ChartPoint = {
  timestamp: number;
  close: number;
};

export type StockQuote = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  updatedAt: number;
};

export type StockChart = {
  symbol: string;
  range: ChartRange;
  points: ChartPoint[];
};

export type FinnhubNewsItem = {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
};

export type StockNewsArticle = {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: number;
  summary: string;
};
