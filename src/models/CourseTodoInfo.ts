import { XzzdTodoType } from '@/spiders/XzzdSpider'

export interface CourseTodoInfo {
  todos: CourseTodo[]
}

export interface CourseTodo {
  endAt: Date
  /**待办名称 */
  title: string
  type: XzzdTodoType
}
