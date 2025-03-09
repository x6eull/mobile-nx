import { ExamArrangement } from '@/models/Course'
import { Semester } from '@/models/shared'
import { ZjuamService } from '@/interop/zjuam'

import { parseZDBKDate } from '@/utils/parseZDBKDate'
import { prepareSemesterString } from '@/utils/prepareSemesterString'

export interface fullExamDataItem {
  courseId: string
  type: 'midterm' | 'final'
  startAt: Date
  endAt: Date
  location: string
  seat: number
}

interface QueryModel {
  currentPage: number
  currentResult: number
  entityOrField: boolean
  limit: number
  offset: number
  pageNo: number
  pageSize: number
  showCount: number
  sorts: never[]
  totalCount: number
  totalPage: number
  totalResult: number
}

interface UserModel {
  monitor: boolean
  roleCount: number
  roleKeys: string
  roleValues: string
  status: number
  usable: boolean
}

interface UpstreamType_examData {
  jgpxzd: string
  kcmc: string
  kssj?: string
  qzkssj?: string
  qzjsmc?: string
  qzzwxh?: string
  jsmc?: string
  zwxh?: string
  listnav: boolean
  localeKey: string
  pageable: boolean
  queryModel: QueryModel
  rangeable: boolean
  row_id: string
  totalResult: string
  userModel: UserModel
  xf: string
  xkkh: string
  xm: string
  xxq: string
}

function trimExamDataItem(x: fullExamDataItem): ExamArrangement {
  return {
    type: x.type,
    startAt: x.startAt,
    endAt: x.endAt,
    location: x.location,
    seat: x.seat,
  }
}

export class ExamSpider {
  #service: ZjuamService
  // #_examData: fullExamDataItem[] = [];
  constructor() {
    this.#service = new ZjuamService(
      {
        service: 'http://zdbk.zju.edu.cn/jwglxt/xtgl/login_ssologin.html',
      },
      60 * 30,
    )
  }
  async getExamData(Semester: Semester): Promise<ExamArrangement[]> {
    const [xxq, xnxq] = prepareSemesterString(Semester)
    const body = new URLSearchParams()
    body.append('queryModel.showCount', '1024')
    body.append('queryModel.currentPage', '1')
    body.append('queryModel.sortName', 'xxq')
    body.append('queryModel.sortOrder', 'asc')
    body.append('xxq', xxq)
    body.append('xnxq', xnxq)
    const response: Response = await this.#service.nxFetch(
      'http://zdbk.zju.edu.cn/jwglxt/xskscx/kscx_cxXsgrksIndex.html?doType=query&gnmkdm=N509070',
      {
        body: body,
        method: 'POST',
      },
    )
    const data = (await response.json())! as { items: UpstreamType_examData[] }
    const resx: fullExamDataItem[] = []

    data.items.forEach((item) => {
      if (item.qzkssj /* 期中考试时间 */) {
        resx.push({
          courseId: item.xkkh,
          type: 'midterm',
          ...parseZDBKDate(item.qzkssj),
          location: item.qzjsmc || '',
          seat: Number(item.qzzwxh || 0),
        })
      }
      if (item.kssj /* 期末考试时间 */) {
        resx.push({
          courseId: item.xkkh,
          type: 'final',
          ...parseZDBKDate(item.kssj),
          location: item.jsmc || '',
          seat: Number(item.zwxh || 0),
        })
      }
    })
    return resx.map(trimExamDataItem)
  }
}
