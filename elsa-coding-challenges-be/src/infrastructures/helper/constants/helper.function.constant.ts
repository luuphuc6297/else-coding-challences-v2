import * as ms from 'ms'

type TimeUnit = 'ms' | 's' | 'm' | 'h' | 'd' | 'y'
type StringValue = `${number}${TimeUnit}` | '0'

export function seconds(msValue: StringValue): number {
  return ms(msValue) / 1000
}
