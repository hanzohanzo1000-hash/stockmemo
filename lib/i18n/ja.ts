export const ja = {
  common: {
    brand: "StockMemo",
    tagline: "読む時間を、60秒に。",
  },
  waitlist: {
    emailLabel: "メールアドレス",
    emailPlaceholder: "you@example.com",
    submit: "先行登録する",
    submitting: "登録中...",
    hint: "早期アクセス開始予定。スパムは送りません。",
    success: "登録が完了しました。公開時にお知らせします。",
    errorGeneric: "エラーが発生しました。もう一度お試しください。",
    errorInvalidEmail: "有効なメールアドレスを入力してください。",
  },
  marketing: {
    nav: {
      product: "機能",
      customers: "利用者",
      research: "銘柄検索",
      waitlist: "無料で先行登録",
    },
    hero: {
      badge: "先行登録受付中",
      title: "決算資料を読む時間を、60秒に。",
      subtitle:
        "長い決算資料をAIが要約。投資判断に必要なポイントだけを瞬時に把握。",
      openApp: "銘柄を検索する",
    },
    preview: {
      windowTitle: "stockmemo.io / AAPL Q1 FY26",
      summaryLabel: "要約",
      summaryText:
        "売上は予想を2.1%上回った。サービス事業の成長が加速。通期ガイダンスを上方修正。ミックス改善による利益率拡大がポイント — 次四半期の注目点。",
      metricsLabel: "主要指標",
      revenue: "売上高",
      revenueValue: "+8.2%",
      eps: "EPS",
      epsValue: "予想超え",
      guidance: "ガイダンス",
      guidanceValue: "上方修正",
    },
    proof: {
      label: "本気の投資家に選ばれています",
      audiences: [
        "ファミリーオフィス",
        "バイサイドアナリスト",
        "個人投資家",
        "リサーチチーム",
        "アセットオーナー",
      ],
    },
    valueProps: [
      {
        stat: "12時間+",
        label: "決算シーズンごとに時間を節約",
        detail: "長文資料の精読から解放。要点だけを一気に把握。",
      },
      {
        stat: "60秒",
        label: "読む量は減らし、理解は深く",
        detail: "膨大な開示資料を、投資テーゼに効く情報だけに凝縮。",
      },
      {
        stat: "100%",
        label: "確信を持つための設計",
        detail: "ニュースフィードではなく、意思決定に使える構造化された出力。",
      },
    ],
    testimonials: {
      label: "利用者の声",
      title: "読む量は減らし、理解は深く。",
      items: [
        {
          quote:
            "決算日は銘柄ごとに2時間確保していた。StockMemoなら数分で、深さを落とさず把握できる。",
          role: "ポートフォリオマネージャー",
          firm: "マルチストラテジー運用",
        },
        {
          quote:
            "Bull / Bear の整理だけでも価値がある。自分の見方を検証する一貫した枠組みが手に入った。",
          role: "個人投資家",
          firm: "投資歴14年",
        },
        {
          quote:
            "シンプルで速い、機関投資家レベルの体験。2026年の決算ワークフローはこうあるべきだ。",
          role: "リサーチアナリスト",
          firm: "ロングショート・エクイティ",
        },
      ],
    },
    features: {
      label: "機能",
      title: "決算後に必要なすべてを、ひとつに。",
      subtitle:
        "スピード、明瞭さ、確信のために設計されたワークフローで、決算シーズンの時間を大幅に節約。",
      items: [
        {
          title: "決算サマリー",
          description:
            "株価に効いた要点だけを抽出 — 売上、ガイダンス、サプライズをわかりやすく。",
        },
        {
          title: "Bull / Bear 分析",
          description:
            "判断前に両面を確認。賛否それぞれの論点を構造化して、ノイズを排除。",
        },
        {
          title: "主要指標の追跡",
          description:
            "四半期を通じて重要な数字を追跡。利益率、成長率、ガイダンスを一覧で。",
        },
        {
          title: "AI投資メモ",
          description:
            "次の決算まで保存・共有・再確認できる、簡潔な投資メモを生成。",
        },
      ],
    },
    cta: {
      label: "本気の投資家に選ばれています",
      title: "80ページの資料を読むのは、もう終わりに。",
      subtitle: "先行登録して、次の決算シーズンにいち早くアクセス。",
    },
    footer: {
      tagline: "読む時間を、60秒に。",
    },
  },
  platform: {
    metadata: {
      title: "リサーチ",
      description: "StockMemo 投資リサーチプラットフォーム",
    },
    header: {
      home: "トップ",
      login: "ログイン",
    },
    dashboard: {
      label: "リサーチプラットフォーム",
      title: "銘柄を検索",
      subtitle: "ティッカーまたは社名で検索。銘柄ページで詳細を確認できます。",
      searchLabel: "銘柄検索",
      searchPlaceholder: "AAPL または Apple Inc.",
      searchHint: "2文字以上で候補を表示",
      searching: "検索中...",
      noResults: "該当する銘柄が見つかりません。",
      searchError: "検索に失敗しました。",
      dbNotConfigured: "Supabase が未設定のため検索できません。",
      resultsLabel: "検索結果",
      popularLabel: "人気銘柄",
      dbPending: "Supabase 接続後に銘柄一覧を表示します。",
      dbEmpty: "銘柄データがありません。SQL マイグレーションを実行してください。",
    },
    stock: {
      comingSoon: "チャート・ニュース・AI要約は Phase 1d 以降で追加します。",
      notFound: "銘柄が見つかりません。",
    },
  },
  api: {
    stocks: {
      notConfigured: "Supabase が設定されていません。",
      fetchFailed: "銘柄の取得に失敗しました。",
    },
  },
} as const;

export type JaDictionary = typeof ja;
