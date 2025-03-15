import { Course } from '@/models/Course'
import { parseZdbkDate } from '@/utils/stringUtils'
import { Maybe } from '@/utils/type'
import { sharedZjuamService } from './sharedZjuamService'

export class ExamSpider {
  private readonly zjuamService = sharedZjuamService

  /**一次性获取全部考试信息。 */
  async getAllExams(): Promise<Pick<Course, 'id' | 'name' | 'exams'>[]> {
    const { items } = (await (
      await this.zjuamService.nxFetch.postUrlEncoded(
        'http://zdbk.zju.edu.cn/jwglxt/xskscx/kscx_cxXsgrksIndex.html?doType=query&gnmkdm=N509070',
        {
          body: new URLSearchParams({
            _search: 'false',
            nd: String(Date.now()),
            'queryModel.showCount': '5000',
            'queryModel.currentPage': '1',
            'queryModel.sortName': 'xkkh',
            'queryModel.sortOrder': 'asc',
            time: '0',
          }),
        },
      )
    ).json()) as {
      items: ({
        /**选课号 */
        xkkh: string
        /**课程名称 */
        kcmc: string
        /**期末考试时间，如2024年01月11日(08:00-10:00) */
        kssj: string
        /**期末考试教室，如紫金港西2-217(录播研)# */
        jsmc?: string
        /**期末考试座位号，座位号是string */
        zwxh?: string
      } & Maybe<{
        /**期中考试时间 */
        qzkssj: string
        /**期中考试教室 */
        qzjsmc?: string
        /**期中考试座位号 */
        qzzwxh?: string
      }>)[]
    }

    return items.map((item) => {
      const course = {
        id: item.xkkh,
        name: item.kcmc,
        exams: [],
      } as Pick<Course, 'id' | 'name' | 'exams'>
      if ('qzkssj' in item)
        course.exams.push({
          type: 'midterm',
          ...parseZdbkDate(item.qzkssj),
          location: item.qzjsmc,
          seat: item.qzzwxh,
        })
      if ('kssj' in item)
        //有时候期末考试也不存在
        course.exams.push({
          type: 'final',
          ...parseZdbkDate(item.kssj),
          location: item.jsmc,
          seat: item.zwxh,
        })
      return course
    })
  }
}
