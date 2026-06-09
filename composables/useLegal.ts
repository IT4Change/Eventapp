interface LegalBlock {
  p?: string
  sub?: string
  list?: string[]
}
interface LegalSection {
  heading: string
  blocks: LegalBlock[]
}

/**
 * Löst die verschachtelten Rechtstext-Sektionen (sections[].blocks[].{p|sub|list})
 * aus dem Message-Store in einfache Objekte auf — damit LegalPage.vue plain Strings
 * rendern kann. Reaktiv auf die aktive Sprache.
 */
export function useLegalSections(prefix: string) {
  const { tm, rt, locale } = useI18n()

  return computed<LegalSection[]>(() => {
    void locale.value
    return (tm(`${prefix}.sections`) as any[]).map((section) => ({
      heading: rt(section.heading),
      blocks: (section.blocks as any[]).map((block) => {
        const out: LegalBlock = {}
        if (block.p !== undefined) out.p = rt(block.p)
        if (block.sub !== undefined) out.sub = rt(block.sub)
        if (block.list !== undefined) out.list = (block.list as any[]).map((x) => rt(x))
        return out
      }),
    }))
  })
}
