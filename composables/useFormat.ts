const WEEKDAYS_DE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
const WEEKDAYS_DE_SHORT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
const MONTHS_DE = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
]

export const useFormat = () => {
  function weekday(d: Date | string): string {
    return WEEKDAYS_DE[new Date(d).getDay()]
  }

  function weekdayShort(d: Date | string): string {
    return WEEKDAYS_DE_SHORT[new Date(d).getDay()]
  }

  function dayMonth(d: Date | string): string {
    const date = new Date(d)
    return `${date.getDate()}. ${MONTHS_DE[date.getMonth()]}`
  }

  function dayMonthShort(d: Date | string): string {
    const date = new Date(d)
    return `${date.getDate()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.`
  }

  function time(d: Date | string): string {
    const date = new Date(d)
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  function timeRange(start: string, end?: string): string {
    if (!end) return time(start)
    return `${time(start)} – ${time(end)}`
  }

  function isToday(d: Date | string): boolean {
    const date = new Date(d)
    const now = new Date()
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    )
  }

  function dateRangeLabel(start: Date, end: Date): string {
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()}. – ${end.getDate()}. ${MONTHS_DE[end.getMonth()]} ${end.getFullYear()}`
    }
    return `${dayMonth(start)} – ${dayMonth(end)} ${end.getFullYear()}`
  }

  return { weekday, weekdayShort, dayMonth, dayMonthShort, time, timeRange, isToday, dateRangeLabel }
}
