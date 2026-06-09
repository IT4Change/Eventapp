import { categories as rawCategories } from '~/data/categories'
import type { CategoryKey, LocalizedCategory } from '~/data/types'

/**
 * Verbindet die strukturellen Kategorie-Daten (Gradient, Bild, Akzentfarbe)
 * mit den lokalisierten Texten aus dem Message-Store (categories.items.<key>).
 * Reaktiv auf die aktive Sprache.
 */
export function useCategories() {
  const { t, tm, rt, locale } = useI18n()

  const categories = computed<LocalizedCategory[]>(() => {
    void locale.value // Abhängigkeit für die Locale-Reaktivität
    return rawCategories.map((c) => ({
      ...c,
      label: t(`categories.items.${c.key}.label`),
      shortLabel: t(`categories.items.${c.key}.shortLabel`),
      description: t(`categories.items.${c.key}.description`),
      includes: (tm(`categories.items.${c.key}.includes`) as unknown[]).map((x) => rt(x as never)),
    }))
  })

  const categoryByKey = computed(
    () =>
      Object.fromEntries(categories.value.map((c) => [c.key, c])) as Record<
        CategoryKey,
        LocalizedCategory
      >,
  )

  return { categories, categoryByKey }
}
