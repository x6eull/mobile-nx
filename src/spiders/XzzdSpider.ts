import { XzzdTodo, XzzdTodoType } from '@/models/CourseTodoInfo'
import { ZjuamService } from '../services/ZjuamService'

export class XzzdSpider {
  zjuamService = new ZjuamService(
    {
      follow() {
        //TODO ts似乎为可选参数；某些zhCN或许也可以不传
        return `
https://identity.zju.edu.cn/auth/realms/zju/protocol/cas/login?ui_locales=zh-CN&service=https%3A//courses.zju.edu.cn/user/index&locale=zh_CN&ts=${(Date.now() / 1000).toFixed(0)}`
      },
    },
    60 * 10,
  )

  /**
   * 学在浙大日程获取。
   * 只能获取未提交且未截止的作业。
   */
  async getTodos(): Promise<XzzdTodo[]> {
    const response = await this.zjuamService.nxFetch.get(
      'https://courses.zju.edu.cn/api/todos',
    )
    const { todo_list } = (await response.json()) as {
      todo_list: {
        course_code: string
        course_id: number
        course_name: string
        course_type: number
        end_time: string //示例：'2025-04-09T16:00:00Z'
        id: number
        is_locked: boolean
        is_student: boolean
        prerequisites: string[]
        title: string
        type: XzzdTodoType
      }[]
    }
    return todo_list.map((v) => ({
      courseCode: v.course_code,
      courseId: v.course_id,
      courseName: v.course_name,
      endAt: new Date(v.end_time),
      title: v.title,
      type: v.type,
    }))
  }
}
