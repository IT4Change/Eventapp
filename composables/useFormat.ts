const WEEKDAYS = {
  de: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
}
const WEEKDAYS_SHORT = {
  de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
}
const MONTHS = {
  de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
}
const MONTHS_SHORT = {
  de: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
}

type Lang = 'de' | 'en'

export const useFormat = () => {
  const { locale } = useI18n()
  const lang = (): Lang => (locale.value === 'en' ? 'en' : 'de')

  function weekday(d: Date | string): string {
    return WEEKDAYS[lang()][new Date(d).getDay()]
  }

  function weekdayShort(d: Date | string): string {
    return WEEKDAYS_SHORT[lang()][new Date(d).getDay()]
  }

  function monthShort(d: Date | string): string {
    return MONTHS_SHORT[lang()][new Date(d).getMonth()]
  }

  function dayMonth(d: Date | string): string {
    const date = new Date(d)
    // EN: "June 9" · DE: "9. Juni"
    return lang() === 'en'
      ? `${MONTHS.en[date.getMonth()]} ${date.getDate()}`
      : `${date.getDate()}. ${MONTHS.de[date.getMonth()]}`
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
    const l = lang()
    if (start.getMonth() === end.getMonth()) {
      return l === 'en'
        ? `${MONTHS.en[end.getMonth()]} ${start.getDate()} – ${end.getDate()}, ${end.getFullYear()}`
        : `${start.getDate()}. – ${end.getDate()}. ${MONTHS.de[end.getMonth()]} ${end.getFullYear()}`
    }
    return `${dayMonth(start)} – ${dayMonth(end)} ${end.getFullYear()}`
  }

  return { weekday, weekdayShort, monthShort, dayMonth, dayMonthShort, time, timeRange, isToday, dateRangeLabel }
}
