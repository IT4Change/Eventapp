<template>
  <div class="event-filter">
    <!-- Kategorien (immer sichtbar) + Toggle -->
    <div class="filter-pills">
      <button
        v-for="cat in categories"
        :key="cat.key"
        class="filter-pill"
        :class="[`pill-${cat.accent}`, { active: selectedCategories.includes(cat.key) }]"
        @click="toggleCategory(cat.key)"
      >
        {{ cat.shortLabel }}
      </button>

      <button
        class="more-toggle"
        :aria-expanded="expanded"
        @click="expanded = !expanded"
      >
        <svg class="filter-ic" viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
          <line x1="2.5" y1="4.5" x2="13.5" y2="4.5" />
          <line x1="4.5" y1="8" x2="11.5" y2="8" />
          <line x1="6.5" y1="11.5" x2="9.5" y2="11.5" />
        </svg>
        Weitere Filter
        <span v-if="advActive" class="dot" />
        <span class="chev">▾</span>
      </button>
    </div>

    <!-- Aufklappbar: Zeitraum + Ort -->
    <div class="more-wrap" :class="{ open: expanded }">
      <div class="more-inner">
        <div class="adv-row">
          <span class="filter-label">Zeitraum</span>
          <div class="filter-controls">
            <label class="date-field">
              <span>Von</span>
              <input v-model="dateFrom" type="date" class="date-input" />
            </label>
            <label class="date-field">
              <span>Bis</span>
              <input v-model="dateTo" type="date" class="date-input" />
            </label>
          </div>
        </div>
        <div class="adv-row">
          <span class="filter-label">Ort</span>
          <div class="filter-controls">
            <select v-model="selectedLocationId" class="location-select">
              <option value="">Alle Orte</option>
              <option v-for="loc in locations" :key="loc.id" :value="loc.id">
                {{ loc.city }} — {{ loc.name }}
              </option>
            </select>
          </div>
        </div>
        <button v-if="hasActiveFilters" class="clear-btn" @click="onClear">
          Filter zurücksetzen
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  categories,
  locations,
  selectedCategories,
  selectedLocationId,
  dateFrom,
  dateTo,
  toggleCategory,
  clearFilters,
} = useEvents()

const expanded = ref(false)

const advActive = computed(
  () => !!(dateFrom.value || dateTo.value || selectedLocationId.value),
)
const hasActiveFilters = computed(
  () => selectedCategories.value.length > 0 || advActive.value,
)

// Erweiterten Bereich offen halten, solange dort ein Filter aktiv ist
watch(advActive, (v) => { if (v) expanded.value = true })

function onClear() {
  clearFilters()
}
</script>

<style scoped>
.event-filter {
  margin-top: 2px;
}

.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.filter-pill {
  padding: 6px 13px;
  border-radius: 999px;
  font-size: 11px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  font-weight: 500;
  cursor: pointer;
  border: 1.5px solid transparent;
  background: transparent;
  color: var(--ink);
  transition: all 0.2s;
  font-family: inherit;
}
.filter-pill:hover { transform: translateY(-1px); }

.pill-coral  { border-color: var(--coral); color: var(--coral); }
.pill-orange { border-color: var(--orange); color: var(--orange); }
.pill-gold   { border-color: var(--gold); color: var(--gold); }
.pill-teal   { border-color: var(--teal); color: var(--teal); }
.pill-blue   { border-color: var(--blue); color: var(--blue); }
.pill-green  { border-color: var(--green); color: var(--green); }

.pill-coral.active  { background: var(--coral); color: #fff; border-color: transparent; }
.pill-orange.active { background: var(--orange); color: #fff; border-color: transparent; }
.pill-gold.active   { background: var(--gold); color: #fff; border-color: transparent; }
.pill-teal.active   { background: var(--teal); color: #fff; border-color: transparent; }
.pill-blue.active   { background: var(--blue); color: #fff; border-color: transparent; }
.pill-green.active  { background: var(--green); color: #fff; border-color: transparent; }

/* Toggle für die erweiterten Filter — gefüllt, hebt sich von den Outline-Tags ab */
.more-toggle {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-left: 4px;
  padding: 7px 15px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: var(--ink);
  color: #fff;
  font-size: 11px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
}
.more-toggle:hover {
  background: var(--ink-soft);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(46, 90, 87, 0.2);
}
.more-toggle .filter-ic {
  flex-shrink: 0;
  opacity: 0.9;
}
.more-toggle .chev {
  font-size: 12px;
  line-height: 1;
  transition: transform 0.3s ease;
}
.more-toggle[aria-expanded='true'] .chev { transform: rotate(180deg); }
.more-toggle .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--coral);
}

/* Slide-Animation via Grid-Rows (0fr → 1fr) */
.more-wrap {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  margin-top: 0;
  transition: grid-template-rows 0.32s ease, opacity 0.25s ease, margin-top 0.32s ease;
}
.more-wrap.open {
  grid-template-rows: 1fr;
  opacity: 1;
  margin-top: 16px;
}
.more-inner {
  overflow: hidden;
  min-height: 0;
}

.adv-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}
.filter-label {
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--ink-soft);
  font-weight: 500;
}
.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.date-field {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--ink-soft);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}
.date-input {
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 13px;
  border: 1.5px solid var(--ink-soft);
  background: #fff;
  color: var(--ink);
  font-family: inherit;
  cursor: pointer;
}
.date-input:focus { outline: none; border-color: var(--teal); }

.location-select {
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13px;
  border: 1.5px solid var(--ink-soft);
  background: #fff;
  color: var(--ink);
  cursor: pointer;
  font-family: inherit;
  width: 100%;
}
.clear-btn {
  font-size: 12px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--ink-soft);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  font-family: inherit;
  padding: 2px 0;
}
.clear-btn:hover { color: var(--coral); }

@media (min-width: 768px) {
  .adv-row {
    grid-template-columns: 84px 1fr;
    gap: 16px;
  }
  .location-select {
    width: auto;
    min-width: 260px;
  }
}
</style>
