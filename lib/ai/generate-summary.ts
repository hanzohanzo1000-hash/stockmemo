import type { GeneratedSummaryPayload, SummaryContext } from "@/lib/ai/types";

const DEFAULT_MODEL = "gpt-4o-mini";

type OpenAiChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export function isOpenAiConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

function getOpenAiApiKey(): string {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  return apiKey;
}

function getModelName(): string {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;
}

function buildPrompt(context: SummaryContext): string {
  const newsBlock =
    context.news.length > 0
      ? context.news
          .map(
            (item, index) =>
              `${index + 1}. [${item.source}] ${item.title}\n   ${item.summary}`,
          )
          .join("\n")
      : "関連ニュースはありません。";

  return [
    "以下の銘柄情報をもとに、投資リサーチ向けの要約を日本語で作成してください。",
    "",
    `銘柄: ${context.symbol} (${context.name})`,
    `取引所: ${context.exchange}`,
    `セクター: ${context.sector ?? "不明"}`,
    `業種: ${context.industry ?? "不明"}`,
    `現在株価: $${context.price.toFixed(2)}`,
    `前日比: ${context.change >= 0 ? "+" : ""}${context.change.toFixed(2)} (${context.changePercent >= 0 ? "+" : ""}${context.changePercent.toFixed(2)}%)`,
    "",
    "関連ニュース:",
    newsBlock,
    "",
    "JSON形式のみで返してください。",
  ].join("\n");
}

function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function parseGeneratedSummary(content: string, model: string): GeneratedSummaryPayload {
  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("OpenAI returned invalid JSON.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("OpenAI returned an invalid summary payload.");
  }

  const record = parsed as Record<string, unknown>;

  const summary = typeof record.summary === "string" ? record.summary.trim() : "";
  const bullCase =
    typeof record.bull_case === "string"
      ? record.bull_case.trim()
      : typeof record.bullCase === "string"
        ? record.bullCase.trim()
        : "";
  const bearCase =
    typeof record.bear_case === "string"
      ? record.bear_case.trim()
      : typeof record.bearCase === "string"
        ? record.bearCase.trim()
        : "";

  if (!summary || !bullCase || !bearCase) {
    throw new Error("OpenAI returned incomplete summary fields.");
  }

  return {
    summary,
    bullCase,
    bearCase,
    keyRisks: parseStringArray(record.key_risks ?? record.keyRisks),
    whatToWatch: parseStringArray(record.what_to_watch ?? record.whatToWatch),
    model,
  };
}

export async function generateStockSummary(
  context: SummaryContext,
): Promise<GeneratedSummaryPayload> {
  const model = getModelName();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getOpenAiApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "stock_summary",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              summary: { type: "string" },
              bull_case: { type: "string" },
              bear_case: { type: "string" },
              key_risks: {
                type: "array",
                items: { type: "string" },
              },
              what_to_watch: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["summary", "bull_case", "bear_case", "key_risks", "what_to_watch"],
          },
        },
      },
      messages: [
        {
          role: "system",
          content:
            "You are a financial research assistant for StockMemo. Write concise, balanced investment research in Japanese. Do not give buy/sell recommendations. Focus on facts and plausible scenarios.",
        },
        {
          role: "user",
          content: buildPrompt(context),
        },
      ],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}.`);
  }

  const data = (await response.json()) as OpenAiChatResponse;
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  return parseGeneratedSummary(content, model);
}
