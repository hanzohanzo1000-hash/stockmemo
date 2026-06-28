export type AiSummaryContent = {
  summary: string;
  bullCase: string;
  bearCase: string;
  keyRisks: string[];
  whatToWatch: string[];
};

export type StockSummaryResponse = AiSummaryContent & {
  generatedAt: string;
  model: string;
  cached: boolean;
};

export type SummaryContext = {
  symbol: string;
  name: string;
  exchange: string;
  sector: string | null;
  industry: string | null;
  price: number;
  change: number;
  changePercent: number;
  news: Array<{
    title: string;
    source: string;
    summary: string;
  }>;
};

export type GeneratedSummaryPayload = AiSummaryContent & {
  model: string;
};
