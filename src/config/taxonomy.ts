import type { Locale } from "./locales"

type LocalizedText = Record<Locale, string>

export type TaxonomyItem = {
  slug: string
  order: number
  labelByLocale: LocalizedText
  descriptionByLocale: LocalizedText
}

const localized = (text: LocalizedText): LocalizedText => text

export const TAXONOMY = {
  categories: [
    {
      slug: "startup",
      order: 0,
      labelByLocale: localized({
        zh: "创业",
        en: "Startup",
        fr: "Startup",
        es: "Startup",
        ru: "Стартап",
        ja: "スタートアップ",
        ko: "스타트업",
        pt: "Startup",
        de: "Startup",
        id: "Startup",
        ar: "الشركات الناشئة",
      }),
      descriptionByLocale: localized({
        zh: "从零到一，产品、团队与系统的持续打造。",
        en: "From zero to one: products, teams, and systems.",
        fr: "De zéro à un : produits, équipes et systèmes.",
        es: "De cero a uno: productos, equipos y sistemas.",
        ru: "От нуля к единице: продукты, команды и системы.",
        ja: "ゼロからイチへ。プロダクト、チーム、システム。",
        ko: "제로에서 일로: 제품, 팀, 시스템.",
        pt: "Do zero ao um: produtos, equipes e sistemas.",
        de: "Von null auf eins: Produkte, Teams und Systeme.",
        id: "Dari nol ke satu: produk, tim, dan sistem.",
        ar: "من الصفر إلى الواحد: المنتجات والفرق والأنظمة.",
      }),
    },
    {
      slug: "invest",
      order: 1,
      labelByLocale: localized({
        zh: "投资",
        en: "Invest",
        fr: "Investir",
        es: "Invertir",
        ru: "Инвестировать",
        ja: "投資",
        ko: "투자",
        pt: "Investir",
        de: "Investieren",
        id: "Investasi",
        ar: "الاستثمار",
      }),
      descriptionByLocale: localized({
        zh: "捕捉价值的艺术，资本与产业的双重逻辑。",
        en: "The art of capturing value, the dual logic of capital and industry",
        fr: "L'art de capter la valeur, entre logique du capital et logique industrielle.",
        es: "El arte de capturar valor, entre la lógica del capital y la industria.",
        ru: "Искусство улавливать ценность: двойная логика капитала и отрасли.",
        ja: "価値を捉える技術、資本と産業の二重の論理。",
        ko: "가치를 포착하는 기술, 자본과 산업의 이중 논리.",
        pt: "A arte de capturar valor, entre a lógica do capital e da indústria.",
        de: "Die Kunst, Wert zu erfassen, zwischen Kapital- und Industrielogik.",
        id: "Seni menangkap nilai, dengan logika ganda modal dan industri.",
        ar: "فن اقتناص القيمة بين منطق رأس المال ومنطق الصناعة.",
      }),
    },
    {
      slug: "life",
      order: 3,
      labelByLocale: localized({
        zh: "生活",
        en: "Life",
        fr: "Vie",
        es: "Vida",
        ru: "Жизнь",
        ja: "生活",
        ko: "생활",
        pt: "Vida",
        de: "Leben",
        id: "Kehidupan",
        ar: "الحياة",
      }),
      descriptionByLocale: localized({
        zh: "生活札记与随笔。",
        en: "Personal notes and essays.",
        fr: "Notes personnelles et essais.",
        es: "Notas personales y ensayos.",
        ru: "Личные заметки и эссе.",
        ja: "個人のメモとエッセイ。",
        ko: "개인 메모와 에세이.",
        pt: "Notas pessoais e ensaios.",
        de: "Persönliche Notizen und Essays.",
        id: "Catatan pribadi dan esai.",
        ar: "ملاحظات شخصية ومقالات قصيرة.",
      }),
    },
  ],
  tags: [
    {
      slug: "strategy",
      order: 1,
      labelByLocale: localized({
        zh: "策略",
        en: "Strategy",
        fr: "Stratégie",
        es: "Estrategia",
        ru: "Стратегия",
        ja: "戦略",
        ko: "전략",
        pt: "Estratégia",
        de: "Strategie",
        id: "Strategi",
        ar: "استراتيجية",
      }),
      descriptionByLocale: localized({
        zh: "策略思考。",
        en: "Strategic thinking.",
        fr: "Pensée stratégique.",
        es: "Pensamiento estratégico.",
        ru: "Стратегическое мышление.",
        ja: "戦略的思考。",
        ko: "전략적 사고.",
        pt: "Pensamento estratégico.",
        de: "Strategisches Denken.",
        id: "Pemikiran strategis.",
        ar: "تفكير استراتيجي.",
      }),
    },
    {
      slug: "risk",
      order: 2,
      labelByLocale: localized({
        zh: "风险",
        en: "Risk",
        fr: "Risque",
        es: "Riesgo",
        ru: "Риск",
        ja: "リスク",
        ko: "위험",
        pt: "Risco",
        de: "Risiko",
        id: "Risiko",
        ar: "مخاطر",
      }),
      descriptionByLocale: localized({
        zh: "风险与韧性。",
        en: "Risk and resilience.",
        fr: "Risque et résilience.",
        es: "Riesgo y resiliencia.",
        ru: "Риск и устойчивость.",
        ja: "リスクとレジリエンス。",
        ko: "위험과 회복력.",
        pt: "Risco e resiliência.",
        de: "Risiko und Resilienz.",
        id: "Risiko dan ketahanan.",
        ar: "المخاطر والمرونة.",
      }),
    },
    {
      slug: "market",
      order: 3,
      labelByLocale: localized({
        zh: "市场",
        en: "Market",
        fr: "Marché",
        es: "Mercado",
        ru: "Рынок",
        ja: "市場",
        ko: "시장",
        pt: "Mercado",
        de: "Markt",
        id: "Pasar",
        ar: "السوق",
      }),
      descriptionByLocale: localized({
        zh: "市场观察。",
        en: "Market observations.",
        fr: "Observations de marché.",
        es: "Observaciones de mercado.",
        ru: "Наблюдения за рынком.",
        ja: "市場観察。",
        ko: "시장 관찰.",
        pt: "Observações de mercado.",
        de: "Marktbeobachtungen.",
        id: "Pengamatan pasar.",
        ar: "ملاحظات حول السوق.",
      }),
    },
    {
      slug: "reflect",
      order: 4,
      labelByLocale: localized({
        zh: "反思",
        en: "Reflect",
        fr: "Réflexion",
        es: "Reflexión",
        ru: "Размышление",
        ja: "省察",
        ko: "성찰",
        pt: "Refletir",
        de: "Nachdenken",
        id: "Merenung",
        ar: "تأمل",
      }),
      descriptionByLocale: localized({
        zh: "反思札记。",
        en: "Reflective notes.",
        fr: "Notes réflexives.",
        es: "Notas reflexivas.",
        ru: "Рефлексивные заметки.",
        ja: "省察のメモ。",
        ko: "성찰 노트.",
        pt: "Notas reflexivas.",
        de: "Reflektierende Notizen.",
        id: "Catatan reflektif.",
        ar: "ملاحظات تأملية.",
      }),
    },
    {
      slug: "media",
      order: 5,
      labelByLocale: localized({
        zh: "媒体",
        en: "Media",
        fr: "Médias",
        es: "Medios",
        ru: "Медиа",
        ja: "メディア",
        ko: "미디어",
        pt: "Mídia",
        de: "Medien",
        id: "Media",
        ar: "إعلام",
      }),
      descriptionByLocale: localized({
        zh: "媒体与发布。",
        en: "Media and publishing.",
        fr: "Médias et publication.",
        es: "Medios y publicación.",
        ru: "Медиа и публикация.",
        ja: "メディアと発信。",
        ko: "미디어와 출판.",
        pt: "Mídia e publicação.",
        de: "Medien und Veröffentlichung.",
        id: "Media dan penerbitan.",
        ar: "الإعلام والنشر.",
      }),
    },
    {
      slug: "roam",
      order: 6,
      labelByLocale: localized({
        zh: "行走",
        en: "Roam",
        fr: "Errance",
        es: "Recorridos",
        ru: "Странствия",
        ja: "旅",
        ko: "여행",
        pt: "Percursos",
        de: "Unterwegs",
        id: "Mengembara",
        ar: "ترحال",
      }),
      descriptionByLocale: localized({
        zh: "行走与见闻。",
        en: "Travel and movement.",
        fr: "Voyages et déplacements.",
        es: "Viajes y movimiento.",
        ru: "Путешествия и движение.",
        ja: "旅と見聞。",
        ko: "여행과 이동.",
        pt: "Viagens e movimento.",
        de: "Reisen und Bewegung.",
        id: "Perjalanan dan pergerakan.",
        ar: "السفر والحركة.",
      }),
    },
    {
      slug: "allocation",
      order: 7,
      labelByLocale: localized({
        zh: "配置",
        en: "Allocation",
        fr: "Allocation",
        es: "Asignación",
        ru: "Распределение",
        ja: "配分",
        ko: "할당",
        pt: "Alocação",
        de: "Allokation",
        id: "Alokasi",
        ar: "تخصيص",
      }),
      descriptionByLocale: localized({
        zh: "资产配置。",
        en: "Capital allocation.",
        fr: "Allocation du capital.",
        es: "Asignación de capital.",
        ru: "Распределение капитала.",
        ja: "資本配分。",
        ko: "자본 배분.",
        pt: "Alocação de capital.",
        de: "Kapitalallokation.",
        id: "Alokasi modal.",
        ar: "تخصيص رأس المال.",
      }),
    },
    {
      slug: "innovation",
      order: 8,
      labelByLocale: localized({
        zh: "创新",
        en: "Innovation",
        fr: "Innovation",
        es: "Innovación",
        ru: "Инновация",
        ja: "革新",
        ko: "혁신",
        pt: "Inovação",
        de: "Innovation",
        id: "Inovasi",
        ar: "ابتكار",
      }),
      descriptionByLocale: localized({
        zh: "创新与产品。",
        en: "Innovation and products.",
        fr: "Innovation et produits.",
        es: "Innovación y productos.",
        ru: "Инновации и продукты.",
        ja: "革新とプロダクト。",
        ko: "혁신과 제품.",
        pt: "Inovação e produtos.",
        de: "Innovation und Produkte.",
        id: "Inovasi dan produk.",
        ar: "الابتكار والمنتجات.",
      }),
    },
    {
      slug: "model",
      order: 9,
      labelByLocale: localized({
        zh: "模型",
        en: "Model",
        fr: "Modèle",
        es: "Modelo",
        ru: "Модель",
        ja: "モデル",
        ko: "모델",
        pt: "Modelo",
        de: "Modell",
        id: "Model",
        ar: "نموذج",
      }),
      descriptionByLocale: localized({
        zh: "模型与框架。",
        en: "Models and frameworks.",
        fr: "Modèles et cadres.",
        es: "Modelos y marcos.",
        ru: "Модели и фреймворки.",
        ja: "モデルとフレームワーク。",
        ko: "모델과 프레임워크.",
        pt: "Modelos e estruturas.",
        de: "Modelle und Frameworks.",
        id: "Model dan kerangka kerja.",
        ar: "النماذج والأطر.",
      }),
    },
    {
      slug: "management",
      order: 10,
      labelByLocale: localized({
        zh: "管理",
        en: "Management",
        fr: "Gestion",
        es: "Gestión",
        ru: "Управление",
        ja: "管理",
        ko: "관리",
        pt: "Gestão",
        de: "Management",
        id: "Manajemen",
        ar: "إدارة",
      }),
      descriptionByLocale: localized({
        zh: "管理与运营。",
        en: "Management and operations.",
        fr: "Gestion et opérations.",
        es: "Gestión y operaciones.",
        ru: "Управление и операционная работа.",
        ja: "管理と運営。",
        ko: "관리와 운영.",
        pt: "Gestão e operações.",
        de: "Management und Betrieb.",
        id: "Manajemen dan operasional.",
        ar: "الإدارة والتشغيل.",
      }),
    },
  ],
} as const

const PRIMARY_CATEGORY_SLUGS = ["startup", "invest", "life"] as const

const TAGS_BY_CATEGORY: Record<
  (typeof PRIMARY_CATEGORY_SLUGS)[number],
  string[]
> = {
  startup: ["innovation", "model", "management"],
  invest: ["strategy", "risk", "allocation"],
  life: ["reflect", "media", "roam"],
}

export function getCategory(slug: string): TaxonomyItem | undefined {
  return TAXONOMY.categories.find((item) => item.slug === slug)
}

export function getTag(slug: string): TaxonomyItem | undefined {
  return TAXONOMY.tags.find((item) => item.slug === slug)
}

const normalizeKey = (value: string): string =>
  value.trim().toLowerCase().replace(/[\s_]+/g, "-")

const categoryAliases: Record<string, string> = {
  build: "startup",
  "建设": "startup",
  building: "startup",
  bauen: "startup",
  "construire": "startup",
  "construir": "startup",
  "строить": "startup",
  "構築": "startup",
  "구축": "startup",
  "membangun": "startup",
  "البناء": "startup",
  startup: "startup",
  startups: "startup",
  "start-up": "startup",
  entrepreneurship: "startup",
  entrepreneuriat: "startup",
  emprendimiento: "startup",
  empreendedorismo: "startup",
  "предпринимательство": "startup",
  unternehmertum: "startup",
  kewirausahaan: "startup",
  "起業家精神": "startup",
  "기업가 정신": "startup",
  "ريادة الأعمال": "startup",
  "スタートアップ": "startup",
  "스타트업": "startup",
  "стартап": "startup",
  "стартапы": "startup",
  "démarrage": "startup",
  "puesta-en-marcha": "startup",
  memulai: "startup",
  comece: "startup",
  inicio: "startup",
  "gründung": "startup",
  "بدء-التشغيل": "startup",
  "شركة-ناشئة": "startup",
  "شركات-ناشئة": "startup",
  investment: "invest",
  investissement: "invest",
  "inversión": "invest",
  investimento: "invest",
  investition: "invest",
  "инвестиции": "invest",
  "استثمار": "invest",
  "人生": "life",
  "인생": "life",
  hidup: "life",
  "حياة": "life",
}

const tagAliases: Record<string, string> = {}

function buildTaxonomyLookup(
  items: readonly TaxonomyItem[],
  aliases: Record<string, string>
): Map<string, string> {
  const lookup = new Map<string, string>()

  for (const item of items) {
    lookup.set(normalizeKey(item.slug), item.slug)
    for (const label of Object.values(item.labelByLocale)) {
      lookup.set(normalizeKey(label), item.slug)
    }
  }

  for (const [alias, slug] of Object.entries(aliases)) {
    lookup.set(normalizeKey(alias), slug)
  }

  return lookup
}

const categoryLookup = buildTaxonomyLookup(TAXONOMY.categories, categoryAliases)
const tagLookup = buildTaxonomyLookup(TAXONOMY.tags, tagAliases)

export function normalizeCategorySlug(value: string): string {
  return categoryLookup.get(normalizeKey(value)) ?? normalizeKey(value)
}

export function normalizeTagSlug(value: string): string {
  return tagLookup.get(normalizeKey(value)) ?? normalizeKey(value)
}

export function getPrimaryCategories(): TaxonomyItem[] {
  return PRIMARY_CATEGORY_SLUGS.map((slug) => getCategory(slug)).filter(
    (item): item is TaxonomyItem => Boolean(item)
  )
}

export function getTagsForCategory(slug: string): TaxonomyItem[] {
  const tagSlugs =
    TAGS_BY_CATEGORY[slug as (typeof PRIMARY_CATEGORY_SLUGS)[number]] ?? []
  return tagSlugs
    .map((tagSlug) => getTag(tagSlug))
    .filter((item): item is TaxonomyItem => Boolean(item))
}
