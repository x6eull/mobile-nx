import { DayOfWeek, Term, WeekType } from '../models/shared'
import { CourseBase } from '../models/CourseBase'
import { ClassArrangement, CourseClassInfo } from '@/models/CourseClassInfo'
import { parseCourseSelectionId } from '@/utils/stringUtils'
import { sharedZjuamService } from './sharedZjuamService'

/**课程表中的课程信息 */
type CourseWithClassInfo = CourseBase & CourseClassInfo
type RawCourseResp = {
  /**显示在课表的课，与实践课相对 */
  kbList: {
    /**选课课号 */
    xkkh: string
    /**例：'面向对象程序设计<br>春夏{第1-8周|1节/周}<br>教师名<br>上课地点zwf期末时间zwf' */
    kcb: string
    /**单双周表示，0 1 2（字符串）分别代表单周 双周 每周 */
    dsz: string
    /**第几节课开始 */
    djj: string
    /**上课长度，包括djj */
    skcd: string
    /**星期几 */
    xqj: number
    /**学期区，春/夏/秋/冬/春夏/秋冬 */
    xxq: string
  }[]
}

export class CourseSpider {
  private readonly zjuamService = sharedZjuamService

  /**一次性获取全部课程信息。未查短学期的课，未查实践课。 */
  public async getAllCourses(): Promise<CourseWithClassInfo[]> {
    const cMap = new Map<string, CourseWithClassInfo[]>()
    const response = await this.zjuamService.nxFetch.postUrlEncoded(
      'http://zdbk.zju.edu.cn/jwglxt/kbcx/xskbcx_cxXsKb.html?gnmkdm=N253508',
      {
        body: new URLSearchParams({
          xxqf: '0',
          xsfs: '0',
          xnm: '',
          xqm: '',
          xqmmc: '',
        }),
      },
    )

    const { kbList } = (await response.json()) as RawCourseResp
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
      const { yearStart } = parseCourseSelectionId(xkkh)
      cMap.pushValue(xkkh, {
        semester: {
          year: yearStart,
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
            while (secFlags !== 0) {
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
            if (startSec !== 0) finishCurSection()
            return sections
          }),
        ),
      )
      .flat(3)
  }
}
