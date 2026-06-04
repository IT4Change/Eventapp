<template>
  <div>
    <HeroSection
      variant="medium"
      :image="event.image"
      :eyebrow="`${category?.label} · ${weekday(event.start)}, ${dayMonth(event.start)}`"
      :title="event.title"
    />

    <!-- Fakten -->
    <section class="bg-off py-14 sm:py-20 lg:py-[80px]">
      <div class="container-w max-w-[820px]">
        <dl class="facts grid sm:grid-cols-2 gap-x-10 gap-y-7">
          <div class="fact">
            <dt>{{ t.event.dateTime }}</dt>
            <dd>{{ dateTimeValue }}</dd>
          </div>
          <div class="fact">
            <dt>{{ t.event.location }}</dt>
            <dd>
              {{ location?.city }} · {{ location?.name }}
              <a
                v-if="event.mapsUrl"
                :href="event.mapsUrl"
                target="_blank"
                rel="noopener"
                class="maps-link"
              >{{ t.event.directions }} →</a>
            </dd>
          </div>
          <div class="fact">
            <dt>{{ t.event.category }}</dt>
            <dd class="flex items-center gap-2.5 flex-wrap">
              <span class="fact-pill" :class="`pill-${category?.accent}`">{{ category?.shortLabel }}</span>
              <span v-if="event.subcategory">{{ event.subcategory }}</span>
            </dd>
          </div>
          <div v-if="registrationLabel" class="fact">
            <dt>{{ t.event.registration }}</dt>
            <dd>{{ registrationLabel }}</dd>
          </div>
          <div v-if="event.price" class="fact">
            <dt>{{ t.event.price }}</dt>
            <dd>{{ event.price }}</dd>
          </div>
          <div v-if="event.organizer" class="fact">
            <dt>Veranstalter</dt>
            <dd>{{ event.organizer }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- Beschreibung -->
    <RichTextSection
      :title="t.event.descriptionHeading"
      :paragraphs="descriptionParagraphs"
    />

    <!-- Veranstalter & Kontakt -->
    <section v-if="hasContact" class="bg-mist py-14 sm:py-20 lg:py-[80px]">
      <div class="container-w max-w-[820px] text-center">
        <h2 class="section-title">{{ t.event.contactHeading }}</h2>
        <div class="flex gap-3 sm:gap-4 flex-col sm:flex-row sm:flex-wrap justify-center mt-8">
          <a v-if="event.url" :href="event.url" target="_blank" rel="noopener" class="btn">{{ t.event.website }}</a>
          <a v-if="event.email" :href="`mailto:${event.email}`" class="btn btn-outline">{{ t.event.email }}</a>
          <a v-if="event.phone" :href="`tel:${event.phone.replace(/\s+/g, '')}`" class="btn btn-outline">{{ t.event.phone }}</a>
        </div>
      </div>
    </section>

    <!-- Hinweis / Zurück -->
    <section class="bg-off py-12 sm:py-16">
      <div class="container-w max-w-[820px]">
        <p v-if="event.aggregatorNote" class="event-note">
          <strong class="block mb-1 not-italic text-ink/80">{{ t.event.disclaimerHeading }}</strong>
          {{ event.aggregatorNote }}
        </p>
        <p v-if="event.source" class="event-source">Quelle: {{ event.source }}</p>
        <NuxtLink to="/" class="back-link">← {{ t.event.back }}</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getEventByUuid, slugify, eventPath } from '~/composables/useEvents'
import { categoryByKey } from '~/data/categories'
import { locationById } from '~/data/locations'

const t = useContent()
const route = useRoute()
const { weekday, dayMonth, time, timeRange, dateRangeLabel } = useFormat()

const event = getEventByUuid(route.params.uuid as string)
if (!event) {
  throw createError({ statusCode: 404, statusMessage: 'Event nicht gefunden', fatal: true })
}

// kanonischer Slug erzwingen (Redirect bei falschem/veraltetem Slug)
if (route.params.slug !== slugify(event.title)) {
  await navigateTo(eventPath(event), { redirectCode: 301, replace: true })
}

const category = computed(() => categoryByKey[event!.category])
const location = computed(() => locationById[event!.locationId])

const dateTimeValue = computed(() => {
  const start = new Date(event!.start)
  const end = event!.end ? new Date(event!.end) : null
  const multiDay = !!end && start.toDateString() !== end.toDateString()
  const dateLabel = multiDay && end
    ? dateRangeLabel(start, end)
    : `${weekday(start)}, ${dayMonth(start)} ${start.getFullYear()}`
  const timeText = multiDay ? `ab ${time(start)} Uhr` : timeRange(event!.start, event!.end)
  return `${dateLabel} · ${timeText}`
})

const REG_LABEL: Record<string, string> = {
  ja: 'Erforderlich',
  empfohlen: 'Empfohlen',
  nein: 'Nicht erforderlich',
}
const registrationLabel = computed(() =>
  event!.registration ? REG_LABEL[event!.registration] ?? event!.registration : '',
)

const descriptionParagraphs = computed(() => {
  const text = event!.detailedDescription || event!.description || ''
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g)
  if (!sentences || sentences.length <= 3) return [text.trim()]
  const per = Math.ceil(sentences.length / 3)
  const paras: string[] = []
  for (let i = 0; i < sentences.length; i += per) {
    paras.push(sentences.slice(i, i + per).join('').trim())
  }
  return paras
})

const hasContact = computed(() => !!(event!.url || event!.email || event!.phone))

useHead({
  title: `${t.brand.name} · ${event.title}`,
  meta: [
    { name: 'description', content: event.description },
    { property: 'og:title', content: event.title },
    { property: 'og:description', content: event.description },
    ...(event.image ? [{ property: 'og:image', content: event.image }] : []),
  ],
})
</script>

<style scoped>
.facts .fact dt {
  font-size: 12px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--coral);
  font-weight: 600;
  margin-bottom: 4px;
}
.facts .fact dd {
  font-size: 17px;
  color: var(--ink);
  line-height: 1.5;
  font-weight: 300;
}
.fact-pill {
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 500;
  color: #fff;
  padding: 4px 13px;
  border-radius: 999px;
}
.pill-coral { background: var(--coral); }
.pill-orange { background: var(--orange); }
.pill-gold { background: var(--gold); }
.pill-teal { background: var(--teal); }
.pill-blue { background: var(--blue); }
.pill-green { background: var(--green); }
.maps-link {
  display: inline-block;
  margin-top: 4px;
  font-size: 14px;
  color: var(--ink-soft);
  text-decoration: none;
  border-bottom: 1.5px solid var(--ink-soft);
  padding-bottom: 1px;
}
.maps-link:hover { color: var(--coral); border-color: var(--coral); }
.event-note {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-soft);
  line-height: 1.7;
  border-top: 1px solid rgba(46, 90, 87, 0.12);
  padding-top: 18px;
}
.event-source {
  font-size: 12px;
  color: var(--ink-soft);
  opacity: 0.75;
  margin-top: 10px;
}
.back-link {
  display: inline-block;
  margin-top: 22px;
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 500;
  color: var(--ink);
  text-decoration: none;
}
.back-link:hover { color: var(--coral); }
</style>
