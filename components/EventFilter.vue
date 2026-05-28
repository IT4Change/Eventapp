<template>
  <div class="event-filter mb-12">
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <span class="text-[12px] tracking-[2px] uppercase text-ink-soft font-medium mr-1">
        Kategorien:
      </span>
      <button
        v-for="cat in categories"
        :key="cat.key"
        class="filter-pill"
        :class="[
          `pill-${cat.gradient}`,
          { active: selectedCategories.includes(cat.key) },
        ]"
        @click="toggleCategory(cat.key)"
      >
        {{ cat.shortLabel }}
      </button>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <span class="text-[12px] tracking-[2px] uppercase text-ink-soft font-medium mr-1">
        Ort:
      </span>
      <select v-model="selectedLocationId" class="location-select">
        <option value="">Alle Orte</option>
        <option v-for="loc in locations" :key="loc.id" :value="loc.id">
          {{ loc.city }} — {{ loc.name }}
        </option>
      </select>
      <button
        v-if="selectedCategories.length || selectedLocationId"
        class="clear-btn"
        @click="clearFilters"
      >
        Filter zurücksetzen
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  categories,
  locations,
  selectedCategories,
  selectedLocationId,
  toggleCategory,
  clearFilters,
} = useEvents()
</script>

<style scoped>
.filter-pill {
  padding: 7px 16px;
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

.pill-warm     { border-color: var(--coral); color: var(--coral); }
.pill-rainbow  { border-color: var(--orange); color: var(--orange); }
.pill-ceremony { border-color: var(--teal); color: var(--teal); }
.pill-cool     { border-color: var(--blue); color: var(--blue); }
.pill-nature   { border-color: var(--green); color: var(--green); }

.pill-warm.active     { background: var(--grad-warm); color: #fff; border-color: transparent; }
.pill-rainbow.active  { background: var(--grad-rainbow); color: #fff; border-color: transparent; }
.pill-ceremony.active { background: linear-gradient(120deg, var(--orange), var(--teal)); color: #fff; border-color: transparent; }
.pill-cool.active     { background: var(--grad-cool); color: #fff; border-color: transparent; }
.pill-nature.active   { background: linear-gradient(120deg, var(--green), var(--teal)); color: #fff; border-color: transparent; }

.location-select {
  padding: 7px 16px;
  border-radius: 999px;
  font-size: 13px;
  border: 1.5px solid var(--ink-soft);
  background: #fff;
  color: var(--ink);
  cursor: pointer;
  font-family: inherit;
  min-width: 220px;
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
}
.clear-btn:hover { color: var(--coral); }
</style>
