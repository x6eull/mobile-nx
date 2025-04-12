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
  dayOfWeek: DayOfWeek
  /**从第几节开始 =djj */
  startSection: number
  /**持续节数 =kccd */
  sectionCount: number
  /**地点 =skdd */
  location: string
}
