import { config } from 'dotenv'
import { ZjuamService } from './interop/zjuam'

/** 学在浙大作业
    courseId:课程id
    deadline:截止日期
    title:作业名字
    type:类型homework/exam/questionnaire
 */
interface Schedule {
  courseId: number
  deadline: string
  title: string
  type: string
}
interface XzzdToDoList {
  course_code: string
  course_id: number
  course_name: string
  course_type: number
  end_time: string
  id: number
  is_locked: boolean
  is_student: boolean
  prerequisites: string[]
  title: string
  type: string
}
/**学在浙大作业fetch到的类型*/
interface XZZDApiResponse {
  todo_list: XzzdToDoList[]
}
/**学在浙大作业相关，请调用fetchHomework()获取作业相关信息*/
export class HomeworkSpider {
  private homework: Schedule[] = []
  zjuamService: ZjuamService
  constructor() {
    //获取zjuam
    this.zjuamService = new ZjuamService(
      { follow: 'https://courses.zju.edu.cn/user/index' },
      60 * 10,
    )
  }
  /**获取所有作业
   @return Promise<Schedule[]>
   {
      courseId: number
      deadline: string
      title: string
      type: string
  }[]
  */
  async fetchHomework(): Promise<Schedule[] | undefined> {
    const url: string = 'https://courses.zju.edu.cn/api/todos'
    const response = await this.zjuamService.nxFetch.get(url)
    const data: XZZDApiResponse =
      await (response.json() as Promise<XZZDApiResponse>)
    for (let i = 0; i < data.todo_list.length; i++) {
      const value = data.todo_list[i]
      this.homework.push({
        courseId: value.course_id,
        deadline: value.end_time,
        title: value.title,
        type: value.type,
      })
    }
    return this.homework
  }
}
//使用实例
//const homeworkSpider = new HomeworkSpider()
//console.log(await homeworkSpider.fetchHomework())
