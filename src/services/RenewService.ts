import { CourseBase } from '@/models/CourseBase'
import { CourseTodoInfo } from '@/models/CourseTodoInfo'
import { Semester, Term } from '@/models/shared'
import { CourseSpider } from '@/spiders/CourseSpider'
import { ExamSpider } from '@/spiders/ExamSpider'
import { GradeSpider } from '@/spiders/GradeSpider'
import { XzzdSpider } from '@/spiders/XzzdSpider'
import { toSemester } from '@/utils/stringUtils'
import { CourseCombined, DataOrigin } from '../models/CourseCombined'

/**批量获取并解析所有上游数据的服务。 */
export class RenewService {
  courseSpider = new CourseSpider()
  examSpider = new ExamSpider()
  gradeSpider = new GradeSpider()
  xxzdSpider = new XzzdSpider()

  /**立即重新获取所有数据并解析。若任何步骤发生致命错误将reject。 */
  async renewAll(): Promise<CourseCombined[]> {
    /** 对term做按位交，合并两个Semester */
    function combineSemester(sem1: Semester, sem2: Semester): Semester {
      const { year: year1, term: term1 } = sem1,
        { year: year2, term: term2 } = sem2
      if (year1 !== year2) throw new Error('尝试跨学年合并学期')
      if (term1 === Term.Short || term2 === Term.Short)
        //如果含短学期，总是返回短学期
        return { year: year1, term: Term.Short }
      const term = term1 & term2
      if (term === 0) throw new Error('欲合并的学期无交集')
      return { year: year1, term }
    }
    /** 返回一个函数。该函数将`append`与接收到的首个参数进行课程信息合并。直接修改接收到的参数，不返回值。 */
    function combineF(
      append: Omit<CourseCombined, 'origin'>,
      origin: DataOrigin,
    ): (base: CourseCombined) => void {
      return (base) => {
        //合并课程信息。除了semester取区间较短者（秋 总覆盖 秋冬），其它全部后出现者覆盖
        const { semester: appendSemester } = append,
          { semester: baseSemester, origin: baseOrigin } = base
        if (!baseOrigin.includes(origin)) baseOrigin.push(origin)
        Object.assign(base, {
          ...append,
          semester: combineSemester(baseSemester, appendSemester),
        })
      }
    }
    const [courses, exams, grades, todos] = await Promise.all([
      this.courseSpider.getAllCourses(),
      this.examSpider.getAllExams(),
      this.gradeSpider.getAllGrades(),
      this.xxzdSpider.getTodos(),
    ])
    const r: Map<CourseBase['id'], CourseCombined> = new Map()
    courses.forEach((item) =>
      r.ensure(
        item.id,
        () => ({ ...item, origin: ['class'] }),
        combineF(item, 'class'),
      ),
    )
    exams.forEach((item) =>
      r.ensure(
        item.id,
        () => ({ ...item, origin: ['exam'] }),
        combineF(item, 'exam'),
      ),
    )
    grades.forEach((item) =>
      r.ensure(
        item.id,
        () => ({ ...item, origin: ['grade'] }),
        combineF(item, 'grade'),
      ),
    )
    todos.forEach((item) =>
      r.ensure(
        item.courseCode,
        () => {
          return {
            semester: toSemester(item.courseCode),
            id: item.courseCode,
            name: item.courseName,
            todos: [item],
            origin: ['xzzdTodo'],
          }
        },
        (prevItem: CourseCombined & Partial<CourseTodoInfo>) => {
          if (!prevItem.todos) {
            prevItem.todos = []
            prevItem.origin.push('xzzdTodo')
          }
          prevItem.todos.push(item)
        },
      ),
    )
    const coll = new Intl.Collator('zh-Hans-CN', {
      usage: 'sort',
      sensitivity: 'variant',
    })
    return [...r.values()].sort((a, b) => coll.compare(a.id, b.id))
  }
}
