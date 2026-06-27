export type Stock = {
  id: string;
  symbol: string;
  exchange: string;
  name: string;
  sector: string | null;
  industry: string | null;
  country: string;
  currency: string;
  created_at: string;
  updated_at: string;
};

export type AiStockSummary = {
  id: string;
  stock_id: string;
  summary: string;
  bull_case: string;
  bear_case: string;
  key_risks: string[];
  what_to_watch: string[];
  source_snapshot_hash: string;
  generated_at: string;
  model: string;
};

export type Database = {
  public: {
    Tables: {
      stocks: {
        Row: Stock;
        Insert: {
          id?: string;
          symbol: string;
          exchange: string;
          name: string;
          sector?: string | null;
          industry?: string | null;
          country?: string;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["stocks"]["Insert"]>;
        Relationships: [];
      };
      ai_stock_summaries: {
        Row: AiStockSummary;
        Insert: {
          id?: string;
          stock_id: string;
          summary: string;
          bull_case: string;
          bear_case: string;
          key_risks?: string[];
          what_to_watch?: string[];
          source_snapshot_hash: string;
          generated_at?: string;
          model: string;
        };
        Update: Partial<Database["public"]["Tables"]["ai_stock_summaries"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
