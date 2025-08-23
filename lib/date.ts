import { TZDate } from '@date-fns/tz'

const timeZone = 'Asia/Jakarta'

export function formatLocal(date: Date | string, timezone: string = timeZone) {
  return new TZDate(new Date(date), timezone)
}
