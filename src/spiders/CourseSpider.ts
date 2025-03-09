import { DayOfWeek, Term, WeekType } from '../models/shared'
import { Course, ClassArrangement } from '../models/Course'
import { ZjuamService } from '../interop/zjuam'
import { requestCredential } from '../interop/credential'

/**课程表中的课程信息，无学分、考试 */
type CourseInSchedule = Omit<Course, 'credit' | 'exams'>
type RawCourseResp = {
  kbList: {
    kcb: string
    dsz: string
    djj: string
    xqj: number
    xxq: string
    xkkh: string
    skcd: string
  }[]
  xnm: string
}

export class CourseSpider {
  private zjuamService = new ZjuamService(
    { service: 'http://zdbk.zju.edu.cn/jwglxt/xtgl/login_ssologin.html' },
    60 * 30,
  )
  constructor() {}

  /**查询指定年份区间的课表。未查短学期的课，未查实践课。 */
  public async getCourses(
    /** 起始学年（靠前的，如2024 - 2025请传2024） */
    xnmStart: number,
    /** 结束学年（靠前的，如2024 - 2025请传2024）*/
    xnmEnd: number,
  ): Promise<CourseInSchedule[]> {
    const { username: zjuId } = await requestCredential(this.zjuamService)
    const cMap = new Map<string, CourseInSchedule[]>()
    for (let curYear = xnmStart; curYear <= xnmEnd; curYear++) {
      const semesters = [
        { xqm: '1|秋', xqmmc: '秋' },
        { xqm: '1|冬', xqmmc: '冬' },
        { xqm: '2|春', xqmmc: '春' },
        { xqm: '2|夏', xqmmc: '夏' },
      ]
      for (const { xqm, xqmmc } of semesters) {
        const params = new URLSearchParams({
          xnm: `${curYear}-${curYear + 1}`,
          xqm,
          xqmmc,
          xxqf: '0',
          xxfs: '0',
        })
        const response = await this.zjuamService.nxFetch.postUrlEncoded(
          `http://zdbk.zju.edu.cn/jwglxt/kbcx/xskbcx_cxXsKb.html?gnmkdm=N253508&su=${zjuId}`,
          { body: params },
        )

        const { xnm: respXnm, kbList } =
          (await response.json()) as RawCourseResp
        for (const { kcb, dsz, djj, xqj, xxq, xkkh: rawXkkh, skcd } of kbList) {
          const kcbItem = kcb.split('<br>')
          const name = kcbItem[0]
          const teacher = kcbItem[2]
          const location = kcbItem[3].replace(/zwf.*/, '').trim()

          const termIdMap = {
            春: Term.Spring,
            夏: Term.Summer,
            秋: Term.Autumn,
            冬: Term.Winter,
            短: Term.Short,
          }
          let termId = 0
          for (const xxqChar of xxq)
            if (xxqChar in termIdMap)
              termId |= termIdMap[xxqChar as keyof typeof termIdMap]
            else throw new Error('学期匹配失败')

          // 对实验课进行合并
          const xkkh = rawXkkh.replace(/-(\d+)[A]$/, '-$1')
          cMap.pushValue(xkkh, {
            semester: {
              year: Number(respXnm.split('-')[0]),
              term: termId,
            },
            id: xkkh,
            name: name,
            teacherName: teacher,
            classes: [
              {
                weekType: dsz === '0' ? 'odd' : dsz === '1' ? 'even' : 'every',
                dayOfWeek: xqj as DayOfWeek,
                startSection: Number(djj),
                sectionCount: Number(skcd),
                location: location,
              },
            ],
          })
        }
      }
    }
    return [...cMap.values()].map((courses) => ({
      ...courses[0], // 首项必定存在，课程名称、教师等均取自首项
      classes: this.mergeClasses(courses.map((c) => c.classes).flat(1)),
    }))
  }

  /**
   * 合并课程安排。
   * 对于地点、周数完全相同的，合并至上课节数不相交，连续的节数也合并为一项；
   * 地点/周数不一样的不合并。
   */
  private mergeClasses(classes: ClassArrangement[]): ClassArrangement[] {
    const weekMap = new Map<WeekType, Map<DayOfWeek, Map<string, number>>>()
    classes.forEach((c) => {
      const { weekType, dayOfWeek, location, startSection, sectionCount } = c
      const dayMap = weekMap.ensure(weekType, () => new Map())
      const locMap = dayMap.ensure(dayOfWeek, () => new Map())
      /**把已有的位域（默认0）和当前的startSection、sectionCount段进行合并 */
      function mergeSection(prevSections = 0) {
        for (let sec = startSection; sec < startSection + sectionCount; sec++)
          prevSections |= 0b1 << sec
        //示例：第1、2、4节有课，位域应为0b10110（最低位保留）
        return prevSections
      }
      locMap.ensure(location, mergeSection, mergeSection)
    })
    return [...weekMap]
      .map(([week, dayMap]) =>
        [...dayMap].map(([day, locMap]) =>
          [...locMap].map(([loc, secFlags]) => {
            const sections = [] as ClassArrangement[]
            secFlags >>= 1 //最低位保留，右移掉以减少一次循环
            let curSec = 1,
              startSec = 0,
              secCount = 0
            /**把当前的startSec、secCount以及其它变量合成为ClassArrangement并加到数组中 */
            function finishCurSection() {
              sections.push({
                weekType: week,
                dayOfWeek: day,
                location: loc,
                startSection: startSec,
                sectionCount: secCount,
              })
            }
            while (secFlags != 0) {
              const curSecValid = Boolean(secFlags & 0b1)
              if (curSecValid) {
                //当前sec有课
                if (startSec === 0) startSec = curSec
                secCount++
              } else if (startSec !== 0) {
                finishCurSection()
                startSec = 0
                secCount = 0
              }
              secFlags >>= 1
              curSec++
            }
            if (startSec != 0) finishCurSection()
            return sections
          }),
        ),
      )
      .flat(3)
  }
}
