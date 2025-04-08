import { Semester } from './shared'

/**课程最基础的识别信息。选课课号为唯一标识符。
 *
 * 某些上游不返回学期字段，此时semester字段通过选课课号解析，可能不准确（如实际秋学期的课，该字段为秋冬）。
 */
export interface CourseBase {
  /**学年&学期 */
  semester: Semester
  /**选课号 如(2024-2025-1)-761T0060-0017687-4 */
  id: string
  /**课程名称（中文） */
  name: string
}
