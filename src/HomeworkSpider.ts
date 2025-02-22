import { ZjuamService } from './interop/zjuam'

/** 学在浙大作业
    courseId:课程id
    deadline:截止日期
    title:作业名字
    type:日程类型homework/exam/questionnaire
 */
export interface Schedule {
  courseId: number
  deadline: string
  title: string
  type: string
}
export class HomeworkSpider {
  zjuamService: ZjuamService
  constructor() {
    this.zjuamService = new ZjuamService(
      { follow: 'https://courses.zju.edu.cn/user/index' },
      60 * 10,
    )
  }
  private homework: Schedule[] = []
  /**获取所有作业和考试*/
  async fetchHomework(): Promise<Schedule[] | undefined> {
    let url: string = 'https://courses.zju.edu.cn/api/todos'
    const response = await this.zjuamService.nxFetch.get(url)
    const data = await response.json()
    for (let i = 0; i < data.todo_list.length; i++) {
      const value = data.todo_list[i]
      console.log(value)
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

//const homeworkSpider = new HomeworkSpider()
//console.log(await homeworkSpider.fetchHomework())
