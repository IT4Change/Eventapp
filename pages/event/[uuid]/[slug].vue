<template>
  <article class="bg-off">
    <div class="container-w py-4 sm:py-6">
      <div class="max-w-[820px]">
      <NuxtLinkLocale to="/" class="back-link">← {{ $t('event.back') }}</NuxtLinkLocale>

      <!-- Kompakter Kopf -->
      <header class="ev-head">
        <span class="fact-pill" :class="`pill-${category?.accent}`">{{ category?.shortLabel }}</span>
        <h1 class="event-title">{{ event.title }}</h1>
        <p v-if="event.description" class="lead">{{ event.description }}</p>
      </header>

      <!-- Fakten (kompakt) -->
      <dl class="event-facts">
        <div class="row">
          <dt>{{ $t('event.dateTime') }}</dt>
          <dd>{{ dateTimeValue }}</dd>
        </div>
        <div class="row">
          <dt>{{ $t('event.location') }}</dt>
          <dd>
            {{ location?.city }} · {{ location?.name }}
            <a
              v-if="event.mapsUrl"
              :href="event.mapsUrl"
              target="_blank"
              rel="noopener"
              class="maps-link"
            >{{ $t('event.directions') }} →</a>
          </dd>
        </div>
        <div v-if="registrationLabel" class="row">
          <dt>{{ $t('event.registration') }}</dt>
          <dd>{{ registrationLabel }}</dd>
        </div>
        <div v-if="event.price" class="row">
          <dt>{{ $t('event.price') }}</dt>
          <dd>{{ event.price }}</dd>
        </div>
        <div v-if="event.organizer" class="row">
          <dt>{{ $t('event.organizer') }}</dt>
          <dd>{{ event.organizer }}</dd>
        </div>
        <div v-if="event.url" class="row">
          <dt>{{ $t('event.websiteLabel') }}</dt>
          <dd><a :href="event.url" target="_blank" rel="noopener" class="fact-link">{{ websiteDisplay }}</a></dd>
        </div>
        <div v-if="event.email" class="row">
          <dt>{{ $t('event.emailLabel') }}</dt>
          <dd><a :href="`mailto:${event.email}`" class="fact-link">{{ event.email }}</a></dd>
        </div>
        <div v-if="event.phone" class="row">
          <dt>{{ $t('event.phoneLabel') }}</dt>
          <dd><a :href="`tel:${event.phone.replace(/\s+/g, '')}`" class="fact-link">{{ event.phone }}</a></dd>
        </div>
      </dl>

      <!-- Beschreibung -->
      <section class="block">
        <h2 class="block-heading">{{ $t('event.descriptionHeading') }}</h2>
        <p v-for="(p, i) in descriptionParagraphs" :key="i" class="body-p">{{ p }}</p>
      </section>

      <!-- Eigenständiges Bild (natürliche Auflösung, nicht gestreckt) -->
      <figure v-if="event.image" class="event-figure">
        <img
          :src="event.image"
          :alt="event.title"
          class="event-image"
          loading="lazy"
          width="512"
          height="512"
        />
      </figure>

      <!-- Kontakt-Buttons ganz unten -->
      <div v-if="hasContact" class="contact-actions">
        <a v-if="event.url" :href="event.url" target="_blank" rel="noopener" class="btn">{{ $t('event.website') }}</a>
        <a v-if="event.email" :href="`mailto:${event.email}`" class="btn btn-outline">{{ $t('event.email') }}</a>
        <a v-if="event.phone" :href="`tel:${event.phone.replace(/\s+/g, '')}`" class="btn btn-outline">{{ $t('event.phone') }}</a>
      </div>

      <!-- Hinweis + Quelle -->
      <footer class="event-foot">
        <p v-if="event.aggregatorNote" class="event-note">
          <strong>{{ $t('event.disclaimerHeading') }}:</strong> {{ event.aggregatorNote }}
        </p>
        <p v-if="event.source" class="event-source">{{ $t('event.sourceLabel') }}: {{ event.source }}</p>
      </footer>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { slugify, eventPath } from '~/composables/useEvents'
import type { Event } from '~/data/types'

const { t, te } = useI18n()
const route = useRoute()
const { weekday, dayMonth, time, timeRange, dateRangeLabel } = useFormat()
const { categoryByKey } = useCategories()
const { getLocationFor } = useEvents()

// Einzel-Event aus dem Backend (Nitro /api/event → Baikal/CalDAV).
const { data: eventData } = await useFetch<Event | null>('/api/event', {
  query: { uuid: route.params.uuid },
  key: `event-${route.params.uuid}`,
  default: () => null,
})
const event = eventData.value
if (!event) {
  throw createError({ statusCode: 404, statusMessage: t('event.notFound'), fatal: true })
}

// kanonischer Slug erzwingen (Redirect bei falschem/veraltetem Slug)
if (route.params.slug !== slugify(event.title)) {
  await navigateTo(eventPath(event), { redirectCode: 301, replace: true })
}

const category = computed(() => categoryByKey.value[event!.category])
const location = computed(() => getLocationFor(event!))

const dateTimeValue = computed(() => {
  const start = new Date(event!.start)
  const end = event!.end ? new Date(event!.end) : null
  const multiDay = !!end && start.toDateString() !== end.toDateString()
  const dateLabel = multiDay && end
    ? dateRangeLabel(start, end)
    : `${weekday(start)}, ${dayMonth(start)} ${start.getFullYear()}`
  const timeText = multiDay ? t('event.fromTime', { time: time(start) }) : timeRange(event!.start, event!.end)
  return `${dateLabel} · ${timeText}`
})

const websiteDisplay = computed(() =>
  (event!.url || '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
)

const registrationLabel = computed(() => {
  if (!event!.registration) return ''
  const key = `event.registrationValues.${event!.registration}`
  return te(key) ? t(key) : event!.registration
})

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
  title: `${t('brand.name')} · ${event.title}`,
  meta: [
    { name: 'description', content: event.description },
    { property: 'og:title', content: event.title },
    { property: 'og:description', content: event.description },
    ...(event.image ? [{ property: 'og:image', content: event.image }] : []),
  ],
})
</script>

<style scoped>
.back-link {
  display: inline-block;
  font-size: 13px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-weight: 500;
  color: var(--ink-soft);
  text-decoration: none;
}
.back-link:hover { color: var(--coral); }

.ev-head {
  margin-top: 12px;
  margin-bottom: 18px;
}
.event-title {
  font-family: 'Helvetica Neue', sans-serif;
  font-weight: 200;
  color: var(--ink);
  line-height: 1.1;
  font-size: 22px;
  margin-top: 10px;
}
.lead {
  margin-top: 8px;
  font-size: 15px;
  line-height: 1.45;
  color: var(--ink-soft);
  font-weight: 300;
  max-width: 640px;
}

.fact-pill {
  display: inline-block;
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 500;
  color: #fff;
  padding: 4px 12px;
  border-radius: 999px;
}
.pill-coral { background: var(--coral); }
.pill-orange { background: var(--orange); }
.pill-gold { background: var(--gold); }
.pill-teal { background: var(--teal); }
.pill-blue { background: var(--blue); }
.pill-green { background: var(--green); }

/* Fakten — kompakte Zeilen */
.event-facts {
  border-top: 1px solid rgba(46, 90, 87, 0.12);
}
.event-facts .row {
  display: grid;
  grid-template-columns: 124px 1fr;
  gap: 14px;
  padding: 7px 0;
  border-bottom: 1px solid rgba(46, 90, 87, 0.1);
}
.event-facts dt {
  font-size: 11px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--coral);
  font-weight: 600;
  padding-top: 2px;
}
.event-facts dd {
  font-size: 15px;
  color: var(--ink);
  line-height: 1.4;
  font-weight: 300;
}
.maps-link {
  display: inline-block;
  margin-left: 6px;
  font-size: 13px;
  color: var(--ink-soft);
  text-decoration: none;
  border-bottom: 1px solid var(--ink-soft);
}
.maps-link:hover { color: var(--coral); border-color: var(--coral); }
.fact-link {
  color: var(--ink);
  text-decoration: none;
  border-bottom: 1px solid rgba(46, 90, 87, 0.3);
  word-break: break-word;
}
.fact-link:hover { color: var(--coral); border-color: var(--coral); }

.block { margin-top: 22px; }
.block-heading {
  font-family: Georgia, serif;
  font-size: 19px;
  color: var(--ink);
  font-weight: 400;
  margin-bottom: 8px;
}
.body-p {
  font-size: 15px;
  line-height: 1.6;
  color: var(--ink-soft);
  font-weight: 300;
  margin-bottom: 10px;
}

.event-figure {
  margin-top: 22px;
  text-align: center;
}
.event-image {
  display: block;
  margin: 0 auto;
  width: 100%;
  max-width: 460px;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 8px 28px rgba(46, 90, 87, 0.1);
}

.contact-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}
.contact-actions .btn {
  padding: 10px 22px;
  font-size: 11px;
}

.event-foot {
  margin-top: 22px;
  border-top: 1px solid rgba(46, 90, 87, 0.12);
  padding-top: 14px;
}
.event-note {
  font-size: 12.5px;
  font-style: italic;
  color: var(--ink-soft);
  line-height: 1.6;
}
.event-note strong {
  font-style: normal;
  color: var(--ink);
}
.event-source {
  font-size: 12px;
  color: var(--ink-soft);
  opacity: 0.7;
  margin-top: 8px;
}

@media (min-width: 640px) {
  .event-title { font-size: 27px; }
  .lead { font-size: 16px; }
  .block { margin-top: 26px; }
  .block-heading { font-size: 21px; }
  .body-p { font-size: 16px; }
}
@media (min-width: 1024px) {
  .event-title { font-size: 30px; }
}
</style>
