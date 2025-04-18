import { CourseBase } from '@/models/CourseBase'
import { CourseTodoInfo } from './CourseTodoInfo'
import { CourseGradeInfo } from './CourseGradeInfo'
import { CourseExamInfo } from './CourseExamInfo'
import { CourseClassInfo } from './CourseClassInfo'
import { Maybe } from '@/utils/type'

export type DataOrigin = 'class' | 'exam' | 'grade' | 'xzzdTodo'
/**从课程表、考试、成绩、学在浙大多方来源合并的课程信息。
 *
 * 注意：如果没有来自'class'的信息（如实践课），则学期可能不准确（单个学期的课可能被解析为长学期）
 */
export type CourseCombined = CourseBase &
  Maybe<CourseClassInfo> &
  Maybe<CourseExamInfo> &
  Maybe<CourseGradeInfo> &
  Maybe<CourseTodoInfo> & { origin: DataOrigin[] }
