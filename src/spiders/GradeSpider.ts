import type { CourseBase } from '@/models/CourseBase'
import type { CourseGradeInfo } from '@/models/CourseGradeInfo'

import { toSemester } from '@/utils/stringUtils'
import { sharedZjuamService } from './sharedZjuamService'

interface RawGrade {
  /** 成绩，如'93' */
  cj: string
  /** 绩点，如'4.0' */
  jd: string
  /** 课程名称，如'高等数学' */
  kcmc: string
  /** 学分，如'3.0' */
  xf: string
  /** 选课号，如'(2023-2024-2)-031E0011-0017170-2' */
  xkkh: string
}

type CourseWithGradeInfo = CourseBase & CourseGradeInfo

export class GradeSpider {
  private readonly zjuamService = sharedZjuamService

  /**一次性获取全部成绩信息。 */
  public async getAllGrades() {
    const items = await this.fetchGrades()
    return items.map((item) => this.processGrade(item))
  }

  private async fetchGrades() {
    const response = await this.zjuamService.nxFetch.postUrlEncoded(
      'http://zdbk.zju.edu.cn/jwglxt/cxdy/xscjcx_cxXscjIndex.html?doType=query&gnmkdm=N508301',
      { body: new URLSearchParams({ 'queryModel.showCount': '5000' }) },
    )
    const { items } = (await response.json()) as { items: RawGrade[] }
    return items
  }

  // 处理单个成绩数据
  private processGrade(rawGrade: RawGrade): CourseWithGradeInfo {
    return {
      semester: toSemester(rawGrade.xkkh),
      id: rawGrade.xkkh,
      name: rawGrade.kcmc,
      credit: Number(rawGrade.xf),
      rawScore: rawGrade.cj,
      rawGradePoint: rawGrade.jd,
    }
  }
}
