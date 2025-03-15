import { DayOfWeek, Semester, WeekType } from './shared'

/**课程信息，对于同一课程代码，多次选课（弃修、重修）为不同的实例。 */
export interface Course {
  /**学年&学期 */
  semester: Semester
  /**选课号 如(2024-2025-1)-761T0060-0017687-4 */
  id: string
  /**课程名称（中文） */
  name: string
  /**学分 */
  credit: number
  /**教师姓名 */
  teacherName: string
  /**上课时间地点 */
  classes: ClassArrangement[]
  /**考试 */
  exams: ExamArrangement[]
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

export type ExamType = 'midterm' | 'final'
/**单场考试安排 */
export interface ExamArrangement {
  type: ExamType
  startAt: Date
  endAt: Date
  /**考试地点，可空 */
  location?: string
  /**座位号，可空，原样保留上游结果，不需要转Number再转字符串 */
  seat?: string
}
