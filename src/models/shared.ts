/**星期几，1-7；注意与Date.prototype.getDay()的不同 */
export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7
/**1=>一，...，0或7=>日，其它throw。支持1-7表示周一-周日；也支持0=周日，1-6表示周一-周六 */
export function toChineseDay(from: number) {
  switch (from) {
    case 1:
      return '一'
    case 2:
      return '二'
    case 3:
      return '三'
    case 4:
      return '四'
    case 5:
      return '五'
    case 6:
      return '六'
    case 7:
    case 0:
      return '日'
    default:
      throw new Error('Invalid day of week')
  }
}

/**学期中的第几周，1-16 */
export type WeekOfSemester =
  | (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8)
  | (9 | 10 | 11 | 12 | 13 | 14 | 15 | 16)
/**使用位域表示长学期中的多个周，第n周为2^n，最低位保留。如1、4周表示为0b10010 */
export type MultipleWeeksOfSemester = number
/**表示单双周/每周/学期中特定的几周。 */
export type WeekType = 'odd' | 'even' | 'every' | MultipleWeeksOfSemester

/**学期，支持：春/夏/秋/冬/短/春夏/秋冬 */
export enum Term {
  Spring = 0b1,
  Summer = 0b10,
  Autumn = 0b100,
  Winter = 0b1000,
  Short = 0b10000, // 短学期

  SpringSummer = Spring | Summer, // 0b11
  AutumnWinter = Autumn | Winter, // 0b1100
}
export interface Semester {
  /**学年，取区间较小者。如此处2024表示2024-2025学年 */
  year: number
  /**学期 */
  term: Term
}
