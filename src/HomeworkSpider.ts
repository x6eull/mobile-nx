/**学在浙大日程获取
 * 只能获取未提交且为截止的作业
 */
import { ZjuamService } from './interop/zjuam'
/** 学在浙大作业
 *  courseCode:课程代码
    courseId:学在浙大特色课程id
    deadline:截止日期
    title:作业名字
    type:类型homework/exam/questionnaire
*/
interface Schedule {
  courseCode: string
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
  private homework: {//存储所需数据
    courseCode: string,
    courseId: number,
    deadline: string,
    title: string,
    type: string,
  }[] = []
  zjuamService: ZjuamService
  constructor() {//登录
    this.zjuamService = new ZjuamService(
      { follow: 'https://courses.zju.edu.cn/user/index' },
      60 * 10,
    )
  }
  /**获取所有作业
   @return Promise<Schedule[]>
    {
      courseCode: string
      courseId: number
      deadline: string
      title: string
      type: string
  }[]
  */
  async fetchHomework(): Promise<Schedule[] | undefined> {
    const url: string = 'https://courses.zju.edu.cn/api/todos'
    const response = await this.zjuamService.nxFetch.get(url)
    const data: XzzdToDoList[] =
      (await (response.json() as Promise<XZZDApiResponse>)).todo_list
    this.homework = data.map(value=>({
      courseCode: value.course_code,
      courseId: value.course_id,
      deadline: value.end_time,
      title: value.title,
      type: value.type,
    }))
    return this.homework
  }
}
//使用实例
//const homeworkSpider = new HomeworkSpider()
//console.log(await homeworkSpider.fetchHomework())
