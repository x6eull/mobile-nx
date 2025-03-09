import { ExamArrangement } from '@/models/Course'
import { Semester } from '@/models/shared'
import { ZjuamService } from '@/interop/zjuam'
import 'dotenv/config'

export interface fullExamDataItem {
  courseId: string
  type: 'midterm' | 'final'
  startAt: Date
  endAt: Date
  location: string
  seat: number
}

import { parseZDBKDate } from '@/utils/parseZDBKDate'
import { prepareSemesterString } from '@/utils/prepareSemesterString'

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
  constructor(zjuam: ZjuamService) {
    this.#service = zjuam
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await this.#service
      .nxFetch(
        'http://zdbk.zju.edu.cn/jwglxt/xskscx/kscx_cxXsgrksIndex.html?doType=query&gnmkdm=N509070',
        {
          body: body,
          method: 'POST',
        },
      )
      .then((v) => v.json())
    const resx: fullExamDataItem[] = []

    /* eslint-disable @typescript-eslint/no-unsafe-call */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    data.items.forEach((item: { [key: string]: string }) => {
      if (item.qzkssj /* 期中考试时间 */) {
        resx.push({
          courseId: item.xkkh,
          type: 'midterm',
          ...parseZDBKDate(item.qzkssj),
          location: item.qzjsmc || '',
          seat: Number(item.qzzwxh || 0),
        })
      }
      if (item.ksrq /* 期末考试时间 */) {
        resx.push({
          courseId: item.xkkh,
          type: 'final',
          ...parseZDBKDate(item.ksrq),
          location: item.jsmc || '',
          seat: Number(item.zwxh || 0),
        })
      }
    })
    return resx.map(trimExamDataItem)
  }
}
