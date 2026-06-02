<template>
  <div class="event-filter mb-12">
    <div class="filter-row mb-4">
      <span class="filter-label">Kategorien</span>
      <div class="filter-controls">
        <button
          v-for="cat in categories"
          :key="cat.key"
          class="filter-pill"
          :class="[
            `pill-${cat.accent}`,
            { active: selectedCategories.includes(cat.key) },
          ]"
          @click="toggleCategory(cat.key)"
        >
          {{ cat.shortLabel }}
        </button>
      </div>
    </div>
    <div class="filter-row mb-4">
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
    <div class="filter-row">
      <span class="filter-label">Ort</span>
      <div class="filter-controls">
        <select v-model="selectedLocationId" class="location-select">
          <option value="">Alle Orte</option>
          <option v-for="loc in locations" :key="loc.id" :value="loc.id">
            {{ loc.city }} — {{ loc.name }}
          </option>
        </select>
        <button
          v-if="hasActiveFilters"
          class="clear-btn"
          @click="clearFilters"
        >
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

const hasActiveFilters = computed(
  () =>
    selectedCategories.value.length > 0 ||
    selectedLocationId.value !== '' ||
    dateFrom.value !== '' ||
    dateTo.value !== '',
)
</script>

<style scoped>
.event-filter {
  background: var(--off);
  padding: 24px 28px;
  border-radius: 18px;
  border: 1px solid rgba(46, 90, 87, 0.08);
}

/* Mobile-first: Label über den Controls gestapelt; ab md zweispaltig. */
.filter-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  align-items: center;
}
.filter-label {
  font-size: 12px;
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

.filter-pill {
  padding: 9px 16px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 1.5px;
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

/* einfarbig: Outline in Palettenfarbe, Aktiv-Zustand als Vollfarbe (kein Verlauf) */
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
  padding: 9px 12px;
  border-radius: 999px;
  font-size: 13px;
  border: 1.5px solid var(--ink-soft);
  background: #fff;
  color: var(--ink);
  font-family: inherit;
  cursor: pointer;
}
.date-input:focus {
  outline: none;
  border-color: var(--teal);
}

.location-select {
  padding: 9px 16px;
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
  padding: 0 8px;
}
.clear-btn:hover { color: var(--coral); }

/* md ≥ 768px (Tablet/Desktop — entspricht bisherigem Layout) */
@media (min-width: 768px) {
  .filter-row {
    grid-template-columns: 110px 1fr;
    gap: 18px;
  }
  .location-select {
    width: auto;
    min-width: 240px;
  }
}
</style>
