import { config } from 'dotenv'
config({ path: '.env.local' })

import { ZjuamService } from './src/interop/zjuam'

/** 学在浙大作业
    courseid:课程id
    deadline:截止日期
    title:作业名字
    isClosed:作业是否截止
    submitted:用户是否提交
 */
export interface Schedule {
  courseId: number
  deadline: string
  title: string
  isClosed: boolean
  submitted: boolean
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
  /**获取所有作业*/
  async fetchHomework(): Promise<Schedule[] | undefined> {
    const url: string = 'https://courses.zju.edu.cn/api/my-courses'
    const response = await this.zjuamService.nxFetch.get(url)
    const data = await response.json()
    for (let i: number = 0; i < data.courses.length; i++) {
      if (data.courses[i].is_closed === true) continue
      let url2: string =
        'https://courses.zju.edu.cn/api/courses/' +
        String(data.courses[i].id) +
        '/homework-activities'
      await this.fetchHomeworkByEachId(url2, data.courses[i].id)
    }
    return this.homework
  }
  /**获取单个课程下的所有作业,id为该课程在学在浙大的id*/
  async fetchHomeworkByEachId(
    url: string,
    id: number,
  ): Promise<Schedule[] | undefined> {
    let homework: Schedule[] = []
    const response = await this.zjuamService.nxFetch.get(url)
    const data = await response.json()
    for (let i = 0; i < data.homework_activities.length; i++) {
      const value = data.homework_activities[i]
      if (value.is_closed === true) continue
      this.homework.push({
        courseId: id,
        deadline: value.deadline,
        title: value.title,
        isClosed: value.is_closed,
        submitted: value.submitted,
      })
    }

    return homework
  }
}

//const homeworkSpider = new HomeworkSpider()
//console.log(await homeworkSpider.fetchHomework())