import type { Grade } from './models/Grade'
import { config } from 'dotenv'
config({ path: '.env.local' })

import { requestCredential } from './interop/credential'
import { ZjuamService } from './interop/zjuam'

export class GradeSpider {
  private grades: Grade[] = [] // 存储处理后的成绩信息
  private zjuamService = new ZjuamService(
    {
      service: 'http://zdbk.zju.edu.cn/jwglxt/xtgl/login_ssologin.html',
    },
    60 * 30,
  )
  private items: any[] = []
  constructor() {}
  // 接收成绩数据
  async getGrade() {
    const { username } = await requestCredential(null as any)
    const response = await this.zjuamService.nxFetch.postJson(
      `http://zdbk.zju.edu.cn/jwglxt/cxdy/xscjcx_cxXscjIndex.html?doType=query&gnmkdm=N5083&${username}`,
      {
        body: {
          doType: 'query',
          gnmkdm: 'N5083',
          su: username,
        },
      },
    )
    const data = await response.json()
    this.items = data.items
  }
  // 解析课程信息并添加到 `grades` 列表
  private addItem(item: any) {
    let txkkh = item.xkkh
    let tYear = Number(txkkh.slice(1, 5))
    let tTerm = Number(txkkh.slice(11, 12))
    let courseIdSuffix = txkkh.slice(14) // 取后半部分用于去重检查
    let isAborted = false
    // 检查是否已有相同后缀的课程，决定 `isAborted`
    if (item.cj === '弃修') isAborted = true

    this.grades.push({
      course: {
        semester: { year: tYear, term: tTerm },
        id: txkkh,
        name: item.kcmc,
        credit: Number(item.xf),
      },
      rawScore: item.cj,
      rawGradePoint: item.jd,
      isAborted: isAborted,
    })
  }

  // 处理所有课程数据
  public async processGrades(): Promise<Grade[]> {
    await this.getGrade()
    // console.log(this.items)
    this.items.forEach((item) => this.addItem(item))
    return this.grades
  }
}

// 创建 `GradeManager` 实例并处理数据
const gradeSpider = new GradeSpider()
console.log(await gradeSpider.processGrades())
