/**处理某些固定格式的字符串。 */

import { Term } from '@/models/shared'

export type CourseSelectionIdFields = {
  yearStart: number
  yearEnd: number
  /**从选课号解析的学期只有1/2两种，故只能为秋冬/春夏 */
  term: Term
  /**课程id，如031E0011 */
  courseId: string
  /**教师职工号 */
  teacherId: string
  /**选课号最后一项，一般为1，实验课可能为1A等。 */
  subId: string
}
/**解析选课号，如(2023-2024-2)-031E0011-0017170-2。若格式无效将抛TypeError。 */
export function parseCourseSelectionId(from: string): CourseSelectionIdFields {
  const { yearStart, yearEnd, term, courseId, teacherId, subId } = from.match(
    /^\((?<yearStart>\d+)-(?<yearEnd>\d+)-(?<term>\d+)\)-(?<courseId>\w+)-(?<teacherId>\w+)-(?<subId>\w+)/,
  )!.groups!
  return {
    yearStart: Number(yearStart),
    yearEnd: Number(yearEnd),
    term: term === '1' ? Term.AutumnWinter : Term.SpringSummer,
    courseId,
    teacherId,
    subId,
  }
}

/**解析部分日期，如2025年01月04日(14:00-16:00) */
export function parseZdbkDate(from: string) {
  const { day, year, month, startHour, startMinute, endHour, endMinute } =
    from.match(
      /(?<year>\d+)年(?<month>\d+)月(?<day>\d+)日\((?<startHour>\d+):(?<startMinute>\d+)-(?<endHour>\d+):(?<endMinute>\d+)\)/,
    )!.groups!
  return {
    startAt: new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(startHour),
      Number(startMinute),
    ),
    endAt: new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(endHour),
      Number(endMinute),
    ),
  }
}
