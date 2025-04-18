import { WeekType, DayOfWeek } from './shared'

/**课程教学信息，包括教师和上课时间地点。 */
export interface CourseClassInfo {
  /**教师姓名 */
  teacherName: string
  /**上课时间地点 */
  classes: ClassArrangement[]
}
/**相对于学期的上课时间、地点 */

export interface ClassArrangement {
  /**上课周次 */
  weekType: WeekType
  /**星期几上课 */
  dayOfWeek: DayOfWeek
  /**从第几节开始 =djj */
  startSection: number
  /**持续节数 =kccd */
  sectionCount: number
  /**地点 =skdd */
  location: string
}

/**把一个区间用位域表示。应保留最低位，from从1开始。
 *
 * 如from=2,count=3 返回0b11100 */
function rangeToBitFlag(from: number, count: number) {
  let flag = 0
  for (let i = from; i < from + count; i++) flag |= 0b1 << i
  return flag
}

/**把位域转换为区间。保留最低位。
 *
 * 如flag=0b10100 返回[2,1],[4,1]。注意：第二个元素表示长度，不是上界 */
function bitFlagToRanges(flag: number): [number, number][] {
  const result: [number, number][] = []
  let curIndice = 1,
    startAt = 0,
    lastFor = 0
  flag >>= 1 //最低位保留，右移掉以减少一次循环
  while (flag) {
    if (flag & 0b1) {
      //当前位有效（2^curIndice）
      if (startAt === 0) startAt = curIndice
      lastFor++
    } else if (startAt !== 0) {
      result.push([startAt, lastFor])
      startAt = 0
      lastFor = 0
    }
    flag >>= 1
    curIndice++
  }
  if (startAt !== 0)
    // 最后一段
    result.push([startAt, lastFor])
  return result
}

/**
 * 合并上课安排。
 *
 * 对于地点、周数完全相同的，合并至上课节数不相交；连续的节数合并为一项；
 * 地点/周数不一样的不合并（不合并单周2节、双周3节的课）。
 */
export function mergeClasses(classes: ClassArrangement[]): ClassArrangement[] {
  const weekMap = new Map<WeekType, Map<DayOfWeek, Map<string, number>>>()
  classes.forEach((c) => {
    const { weekType, dayOfWeek, location, startSection, sectionCount } = c
    const dayMap = weekMap.ensure(weekType, () => new Map())
    const locMap = dayMap.ensure(dayOfWeek, () => new Map())
    const curArrangeFlag = rangeToBitFlag(startSection, sectionCount)
    locMap.ensureSet(
      location,
      () => curArrangeFlag,
      (prevFlag) => prevFlag | curArrangeFlag,
    )
  })
  return [...weekMap]
    .map(([weekType, dayMap]) =>
      [...dayMap].map(([dayOfWeek, locMap]) =>
        [...locMap].map(([location, secFlags]) =>
          bitFlagToRanges(secFlags).map(([startSection, sectionCount]) => ({
            weekType,
            dayOfWeek,
            startSection,
            sectionCount,
            location,
          })),
        ),
      ),
    )
    .flat(3)
}
