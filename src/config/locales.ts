export const LOCALES = [
  "zh",
  "en",
  "fr",
  "es",
  "ru",
  "ja",
  "ko",
  "pt",
  "de",
  "id",
  "ar",
] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "en"

export type LocaleMeta = {
  code: Locale
  nativeName: string
  label: string
  ogLocale: string
  dir: "ltr" | "rtl"
  searchHint: string
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  zh: {
    code: "zh",
    nativeName: "中文",
    label: "Chinese",
    ogLocale: "zh_CN",
    dir: "ltr",
    searchHint: "使用空格分隔关键词可提升检索效果。",
  },
  en: {
    code: "en",
    nativeName: "English",
    label: "English",
    ogLocale: "en_US",
    dir: "ltr",
    searchHint: "Search across posts and pages.",
  },
  fr: {
    code: "fr",
    nativeName: "Français",
    label: "French",
    ogLocale: "fr_FR",
    dir: "ltr",
    searchHint: "Rechercher dans les articles.",
  },
  es: {
    code: "es",
    nativeName: "Español",
    label: "Spanish",
    ogLocale: "es_ES",
    dir: "ltr",
    searchHint: "Buscar en artículos y páginas.",
  },
  ru: {
    code: "ru",
    nativeName: "Русский",
    label: "Russian",
    ogLocale: "ru_RU",
    dir: "ltr",
    searchHint: "Поиск по публикациям.",
  },
  ja: {
    code: "ja",
    nativeName: "日本語",
    label: "Japanese",
    ogLocale: "ja_JP",
    dir: "ltr",
    searchHint: "キーワードを空白で区切ると検索しやすくなります。",
  },
  ko: {
    code: "ko",
    nativeName: "한국어",
    label: "Korean",
    ogLocale: "ko_KR",
    dir: "ltr",
    searchHint: "게시글과 페이지를 검색합니다.",
  },
  pt: {
    code: "pt",
    nativeName: "Português",
    label: "Portuguese",
    ogLocale: "pt_PT",
    dir: "ltr",
    searchHint: "Pesquisar artigos e páginas.",
  },
  de: {
    code: "de",
    nativeName: "Deutsch",
    label: "German",
    ogLocale: "de_DE",
    dir: "ltr",
    searchHint: "Artikel und Seiten durchsuchen.",
  },
  id: {
    code: "id",
    nativeName: "Indonesia",
    label: "Indonesian",
    ogLocale: "id_ID",
    dir: "ltr",
    searchHint: "Cari artikel dan halaman.",
  },
  ar: {
    code: "ar",
    nativeName: "العربية",
    label: "Arabic",
    ogLocale: "ar_AR",
    dir: "rtl",
    searchHint: "ابحث في المقالات والصفحات.",
  },
}

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale)
}

export function getLocaleMeta(locale: Locale): LocaleMeta {
  return LOCALE_META[locale]
}
