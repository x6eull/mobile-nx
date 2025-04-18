/**学年和学期 */
export interface Semester {
  /**学年，取区间较小者。如此处2024表示2024-2025学年 */
  year: number
  /**学期 */
  term: Term
}

/**使用整数表示的紧凑学年学期。低8位为学期；右移8位即为学年 */
export type SemesterNumber = number
export function toSemesterNumber(semester: Semester) {
  return (semester.year << 8) | semester.term
}
export function fromSemesterNumber(semesterNumber: SemesterNumber): Semester {
  return {
    year: semesterNumber >> 8,
    term: semesterNumber & 0xff,
  }
}

/**拆分为单学期。秋冬=>[秋,冬] */
export function toSingleSemesters(semester: Semester): Semester[] {
  const result: Semester[] = []
  if (semester.term & Term.Spring)
    result.push({ year: semester.year, term: Term.Spring })
  if (semester.term & Term.Summer)
    result.push({ year: semester.year, term: Term.Summer })
  if (semester.term & Term.Autumn)
    result.push({ year: semester.year, term: Term.Autumn })
  if (semester.term & Term.Winter)
    result.push({ year: semester.year, term: Term.Winter })
  return result
}

/**学期，支持：春/夏/秋/冬/短/春夏/秋冬。 */
export enum Term {
  Spring = 0b1,
  Summer = 0b10,
  Autumn = 0b100,
  Winter = 0b1000,
  Short = 0b10000, // 短学期

  SpringSummer = Spring | Summer, // 0b11
  AutumnWinter = Autumn | Winter, // 0b1100
}
export const termNames = new Map<Term, string>([
  [Term.Spring, '春'],
  [Term.Summer, '夏'],
  [Term.Autumn, '秋'],
  [Term.Winter, '冬'],
  [Term.Short, '短'],
  [Term.SpringSummer, '春夏'],
  [Term.AutumnWinter, '秋冬'],
])

/**获取所在的长学期。短学期目前统一返回秋冬 */
export function toLongTerm(term: Term) {
  switch (term) {
    case Term.Spring:
    case Term.Summer:
    case Term.SpringSummer:
      return Term.SpringSummer
    case Term.Autumn:
    case Term.Winter:
    case Term.AutumnWinter:
    case Term.Short:
      return Term.AutumnWinter
    default:
      throw new Error('Unknown long term for: ' + (term as number))
  }
}
/**秋冬=>冬，春夏=>夏，单个学期原样返回，其他报错 */
export function toEndTerm(term: Term) {
  if (term === Term.SpringSummer) return Term.Summer
  if (term === Term.AutumnWinter) return Term.Winter
  if ((term & (term - 1)) === 0) return term //单个学期
  throw new Error('Unknown end term for: ' + term)
}
