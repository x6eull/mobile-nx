import { CourseBase } from '@/models/CourseBase'
import { CourseTodoInfo } from './CourseTodoInfo'
import { CourseGradeInfo } from './CourseGradeInfo'
import { CourseExamInfo } from './CourseExamInfo'
import { CourseClassInfo } from './CourseClassInfo'
import { Maybe } from '@/utils/type'
import { fromSemesterNumber, Semester, toSemesterNumber } from './Semester'
import { toArray } from '@/utils/func'

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

/**
 * 对于一系列课程，获取其提及的学年学期列表。
 * @param courses 课程数组
 * @param customMapper 对每个课程，返回的其提及的学期/学期数组/null。
 * 由于获取提及的学年学期会遍历课程数组，该函数内也可以执行遍历的逻辑。
 */
export function getMentionedSemesters(
  courses: CourseCombined[],
  customMapper: (
    course: CourseCombined,
    index: number,
    array: CourseCombined[],
  ) => Semester | Semester[] | null = (c) => c.semester,
  thisArg?: unknown,
): Semester[] {
  const mentionedSemesterNumbers = courses
    .map((c, index, array) => {
      const ret = customMapper.call(thisArg, c, index, array)
      if (!ret) return []
      return toArray(ret).map(toSemesterNumber)
    })
    .flat(1)
  const mentionedSemesters = new Set(mentionedSemesterNumbers) // 去重
  return mentionedSemesters.values().map(fromSemesterNumber).toArray() // number转换回学期对象
}
