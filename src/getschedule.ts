import { nxFetch } from './interop/fetch.ts'
import { config } from 'dotenv'

/** 学在浙大作业
    deadline:截止日期
    title:作业名字
    is_closed:作业是否截止
    submitted:用户是否提交
 */
interface Schedule {
  deadline: string
  title: string
  is_closed: boolean
  submitted: boolean
}
async function Fetch_calendar(service: any): Promise<Schedule[] | undefined> {
  const url: string = 'https://courses.zju.edu.cn/api/my-courses'
  let calendar: Schedule[] = []
  try {
    const response = await service.nxFetch.get(url)
    const data = await response.json()
    for (let i: number = 0; i < data.courses.length; i++) {
      let url2: string =
        'https://courses.zju.edu.cn/api/courses/' +
        String(data.courses[i].id) +
        '/homework-activities'
      const homework = await Fetch_specific_calendar(service, url2)
      if (homework !== undefined) {
        calendar = calendar.concat(homework)
      }
    }
    console.log(calendar)
    return calendar
  } catch (error) {
    console.error('请求错误:', error)
  }
}
async function Fetch_specific_calendar(
  service: any,
  url: string,
): Promise<Schedule[] | undefined> {
  let homework: Schedule[] = []
  try {
    const response = await service.nxFetch.get(url)
    const data = await response.json()
    for (let i = 0; i < data.homework_activities.length; i++) {
      const value = data.homework_activities[i]
      homework.push({
        deadline: value.deadline,
        title: value.title,
        is_closed: value.is_closed,
        submitted: value.submitted,
      })
    }

    return homework
  } catch (error) {
    console.error('请求错误:', error)
  }
}
//Fetch_calendar(service)

export { Fetch_calendar }