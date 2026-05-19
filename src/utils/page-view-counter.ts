export function isPageViewsEnabled(value: string | undefined): boolean {
  return value === "true"
}

export function formatPageViewCount(count: number): string {
  return new Intl.NumberFormat("zh-CN").format(count)
}
