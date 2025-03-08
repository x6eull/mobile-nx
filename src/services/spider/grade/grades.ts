import type { Grade } from '@/models/Grade'

import { requestCredential } from '@/interop/credential'
import { ZjuamService } from '@/interop/zjuam'
import { Term } from '@/models/shared'

interface RawGrade {
  cj: string              // 成绩，如'93'
  jd: string              // 绩点，如'4.0'
  kcmc: string            // 课程名称，如'高等数学'
  xf: string              // 学分，如'3.0'
  xkkh: string            // 选课号，如'(2023-2024-2)-031E0011-0017170-2'
}

export class GradeSpider {

  private zdbkGradeUrl = `http://zdbk.zju.edu.cn/jwglxt/cxdy/xscjcx_cxXscjIndex.html?doType=query&gnmkdm=N508301`
  private grades: Grade[] = [] // 存储处理后的成绩信息
  private zjuamService = new ZjuamService(
    {
      service: 'http://zdbk.zju.edu.cn/jwglxt/xtgl/login_ssologin.html',
    },
    60 * 30,
  )
  constructor() {
  }

  // 接收成绩数据，使用其他数据源时使用相同接口
  public async GetGrade(): Promise<Grade[]> {
    const items = await this.GetGradeFromZdbk()
    return items.map((item) => this.processGrade(item))
  }

  // 从浙江大学教务系统获取成绩数据
  private async GetGradeFromZdbk(): Promise<RawGrade[]> {
    const { username } = await requestCredential(this.zjuamService)
    const params = new URLSearchParams()
    params.append('queryModel.showCount', '5000')
    const response = await this.zjuamService.nxFetch.postUrlEncoded(
      `${this.zdbkGradeUrl}&su=${username}`,
      {
        body: params,
      },
    )
    const data = (await response.json()) as { items: RawGrade[] }
    return data.items
  }

  // 处理单个成绩数据
  private processGrade(rawGrade: RawGrade): Grade {
    return {
      course: {
        semester: { year: Number(rawGrade.xkkh.slice(1, 5)),
                    term: rawGrade.xkkh.slice(11, 12) === '1' ? Term.AutumnWinter : Term.SpringSummer },
        id: rawGrade.xkkh,
        name: rawGrade.kcmc,
        credit: Number(rawGrade.xf),
      },
      rawScore: rawGrade.cj,
      rawGradePoint: rawGrade.jd,
      isAborted: rawGrade.cj === '弃修',
    }
  }
}