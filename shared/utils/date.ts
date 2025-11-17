export const yearToTimestamp = (year: number, align: 'end' | 'start' = 'start'): number => {
  const timestamp = new Date(year, align === 'start' ? 0 : 11, align === 'start' ? 1 : 31).getTime()

  // Adjust for year 0 absence in Gregorian calendar
  return year < 0 ? timestamp + 31539600000 : timestamp
}

export const hasOverlap = (
  one: { end: number; start: number },
  two: { end: number; start: number }
) => {
  return !(one.start > two.end || one.end < two.start)
}
