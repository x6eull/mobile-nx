export interface CourseTodoInfo {
  todos: CourseTodo[]
}

export interface CourseTodo {
  endAt: Date
  /**待办名称 */
  title: string
  type: XzzdTodoType
}

export interface XzzdTodo {
  /**选课号 */
  courseCode: string
  /**学在浙大系统内部数字id，目前无用 */
  courseId: number
  /**学在浙大显示的课程名称 */
  courseName: string
  endAt: Date
  /**todo标题，不含课程名，如'第一讲作业' */
  title: string
  type: XzzdTodoType
}
export type XzzdTodoType = 'homework' | 'exam' | 'questionnaire'
