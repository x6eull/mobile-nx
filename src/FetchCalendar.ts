import { ZjuamService } from './interop/zjuam'
/** 学在浙大作业
    deadline:截止日期
    title:作业名字
    isClosed:作业是否截止
    submitted:用户是否提交
 */
interface Schedule {
  deadline: string
  title: string
  isClosed: boolean
  submitted: boolean
}
async function fetchCalendar(
  service: ZjuamService,
): Promise<Schedule[] | undefined> {
  const url: string = 'https://courses.zju.edu.cn/api/my-courses'
  let calendar: Schedule[] = []
  try {
    const response = await service.nxFetch.get(url)
    const data = await response.json()
    for (let i: number = 0; i < data.courses.length; i++) {
      if (data.courses[i].is_closed === true) continue
      let url2: string =
        'https://courses.zju.edu.cn/api/courses/' +
        String(data.courses[i].id) +
        '/homework-activities'
      const homework = await fetchSpecificCalendar(service, url2)
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
async function fetchSpecificCalendar(
  service: ZjuamService,
  url: string,
): Promise<Schedule[] | undefined> {
  let homework: Schedule[] = []
  try {
    const response = await service.nxFetch.get(url)
    const data = await response.json()
    for (let i = 0; i < data.homework_activities.length; i++) {
      const value = data.homework_activities[i]
      if (value.is_closed === true) continue
      homework.push({
        deadline: value.deadline,
        title: value.title,
        isClosed: value.is_closed,
        submitted: value.submitted,
      })
    }

    return homework
  } catch (error) {
    console.error('请求错误:', error)
  }
}

//Fetch_calendar(service)

export { fetchCalendar }
