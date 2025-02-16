import { Course, ExamArrangement } from '@/models/Course';
import { Term, Semester } from '@/models/enums';
import store from '@/store/store.ts';
import { ZjuamService } from '../base/zjuam';
import 'dotenv/config';
import { setUser } from '@/store/user';

interface fullExamDataItem {
  courseId: string;
  type: 'midterm' | 'final';
  startAt: Date;
  endAt: Date;
  location: string;
  seat: number;
}

/**
 *
 * @param str looks like '2025年01月04日(14:00-16:00)'
 */
const parseZDBKDate = (str: string) => {
  const slice = str
    .split(/年|月|日|\(|\)|:|-/)
    .filter((v: any) => v)
    .map(Number);
  return {
    startAt: new Date(
      slice[0],
      slice[1] - 1,
      slice[2],
      slice[3],
      slice[4],
      0,
      0,
    ),
    endAt: new Date(slice[0], slice[1] - 1, slice[2], slice[5], slice[6], 0, 0),
  };
};

/**
 * @param custom_fetch WIP, a fetch function that handles cookies automatically
 * @param xnxq xxq 学年学期 小学期. false means the param is not speciific, when we want to filter the both semester in a term
 */
const implement = async (
  custom_fetch: (url: string, options?: RequestInit) => Promise<Response>,
  xnxq: string | false,
  xxq: string | false,
): Promise<fullExamDataItem[]> => {
  const formdata = new FormData();
  formdata.append('queryModel.showCount', '1024');
  formdata.append('queryModel.currentPage', '1');
  formdata.append('queryModel.sortName', 'xxq');
  formdata.append('queryModel.sortOrder', 'asc');
  xxq && formdata.append('xxq', xxq);
  xnxq && formdata.append('xnxq', xnxq);
  const data = await custom_fetch(
    'http://zdbk.zju.edu.cn/jwglxt/xskscx/kscx_cxXsgrksIndex.html?doType=query&gnmkdm=N509070',
    {
      body: formdata,
      method: 'POST',
    },
  )
    .then((res) => res.json())
    .catch(Promise.reject);
  const resx: fullExamDataItem[] = [];
  data.items.forEach((item: any) => {
    if (item.qzkssj /* 期中考试时间 */) {
      resx.push({
        courseId: item.xkkh,
        type: 'midterm',
        ...parseZDBKDate(item.qzkssj),
        location: item.qzjsmc || '',
        seat: Number(item.qzzwxh || 0),
      });
    }
    if (item.qmksrq /* 期末考试时间 */) {
      resx.push({
        courseId: item.xkkh,
        type: 'final',
        ...parseZDBKDate(item.qmksrq),
        location: item.jsmc || '',
        seat: Number(item.qzzwxh || 0),
      });
    }
  });
  return resx;
};

const prepareSemesterString = (
  Semester: Semester,
): [string | false, string | false] => {
  if (Semester.term & 0b10000) {
    return [`(${Semester.year}-${Semester.year + 1}-1)-`, '短'];
  }
  const t = Semester.term & 0b1111;
  return [
    `(${Semester.year}-${Semester.year + 1}-${
      // 愉快的位运算。
      (Number(!!(t & 12)) * 1 + Number(!!(t & 3)) * 2) % 3 ||
      (() => {
        throw new Error('查询不能横跨多个半学年');
      })()
    })-`,
    ((m) => (m[1] ? false : m[0][1]))(
      Object.entries({
        0b1: '春',
        0b10: '夏',
        0b100: '秋',
        0b1000: '冬',
      }).filter((a) => t & Number(a[0])),
    ),
  ];
};

/**
 * Fetch exam arrangements from zdbk.zju.edu.cn.
 *
 * Note that if location and seat are empty in upstream data,
 * they will be set to empty string and 0 respectively.
 *
 * @param Semester Semester to query.
 * @returns Promise<ExamArrangement[]> List of exam arrangements
 * @author Locean<locean@5dbwat4.top>
 */
// export default (Semester: Semester) =>
//   implement(fetch, ...prepareSemesterString(Semester));
// export default async function exam_spider(Semester: Semester) {
//   const zdbk = new ZDBK(
//     new ZJUAM(process.env.username!, process.env.password!),
//   );
//   const fetch = zdbk.fetch;
//   // const service = new ZjuamService({
//   //   service: 'http://zdbk.zju.edu.cn/jwglxt/xtgl/login_ssologin.html',
//   // });

//   // const fetch = service.nxFetch;

//   return implement(
//     fetch as (arg0: string, arg1?: RequestInit) => Promise<Response>,
//     ...prepareSemesterString(Semester),
//   );
// }

// if (process.env.debug == 'EXAM_SPIDER') {
//   console.log(
//     await exam_spider({
//       year: 2024,
//       term: Term.Winter,
//     }),
//   );
// }

function trimExamDataItem(x: fullExamDataItem): ExamArrangement {
  return {
    type: x.type,
    startAt: x.startAt,
    endAt: x.endAt,
    location: x.location,
    seat: x.seat,
  };
}

export default class {
  #_fetch: Function;
  #_examData: {
    courseId: string;
    type: 'midterm' | 'final';
    startAt: Date;
    endAt: Date;
    location: string;
    seat: number;
  }[] = [];
  constructor(zjuam: ZjuamService) {
    this.#_fetch = new ZjuamService(
      {
        service: 'http://zdbk.zju.edu.cn/jwglxt/xtgl/login_ssologin.html',
      },
      60 * 30,
    ).nxFetch;
  }
  async getExamData(Semester: Semester) {
    this.#_examData = await implement(
      this.#_fetch as (arg0: string, arg1?: RequestInit) => Promise<Response>,
      ...prepareSemesterString(Semester),
    );
    return this.#_examData.map(trimExamDataItem);
  }
  async getExamDataFromCourse(course: Course): Promise<ExamArrangement[]> {
    if (!this.#_examData.length) {
      await this.getExamData(course.semester);
    }
    return this.#_examData
      .filter((exam) => exam.location == course.classes[0].location)
      .map(trimExamDataItem);
  }
}
