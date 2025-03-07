import { DayOfWeek, Semester, Term } from './models/shared'
import { Course, ClassArrangement } from './models/Course'
import { ZjuamService } from './interop/zjuam'

type CourseSp = Pick<
  Course,
  'id' | 'name' | 'teacherName' | 'classes' | 'semester'
>

interface ApiResponse {
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

/*课表相关，请调用getTimetable方法获取课程表信息*/
class GetCourse {
  private zjuamService: ZjuamService

  constructor() {
    this.zjuamService = new ZjuamService(
      { service: 'http://zdbk.zju.edu.cn/jwglxt/xtgl/login_ssologin.html' },
      60 * 30,
    )
  }
  /** 合并连续且重名课程的函数
   * 返回内容按照coursesp的定义进行
   * 合并原则1：当且仅当两课程ID相同且时间连续的情况下会进行合并，否则会保留ID相同的可成
   * 合并原则2：对于内容完全相同的两个COURSE仅会保留一个
   */
  private mergeCourses(courseList: CourseSp[]): CourseSp[] {
    // 使用稳定的比较函数
    courseList.sort((a, b) => {
      // 按照课程ID排序
      if (a.id < b.id) return -1
      if (a.id > b.id) return 1

      // 如果ID相同，按照星期几排序
      if (a.classes[0].dayOfWeek < b.classes[0].dayOfWeek) return -1
      if (a.classes[0].dayOfWeek > b.classes[0].dayOfWeek) return 1

      // 如果星期几相同，按照开始节次排序
      return a.classes[0].startSection - b.classes[0].startSection
    })

    const mergedCourses: CourseSp[] = []
    const seenCourses = new Set<string>() // 用于存储已经处理过的课程的唯一标识

    for (let i = 0; i < courseList.length; i++) {
      const currentCourse = courseList[i]
      const currentCourseInfo = currentCourse.classes[0]

      // 检查是否与下一个课程完全相同
      while (
        i + 1 < courseList.length &&
        currentCourse.id === courseList[i + 1].id &&
        currentCourseInfo.location === courseList[i + 1].classes[0].location &&
        currentCourseInfo.dayOfWeek ===
          courseList[i + 1].classes[0].dayOfWeek &&
        currentCourseInfo.weekType === courseList[i + 1].classes[0].weekType &&
        currentCourseInfo.startSection + currentCourseInfo.sectionCount ===
          courseList[i + 1].classes[0].startSection
      ) {
        // 合并连续的课程
        currentCourseInfo.sectionCount +=
          courseList[i + 1].classes[0].sectionCount
        i++
      }

      // 生成课程的唯一标识
      const courseKey = `${currentCourse.id}-${currentCourseInfo.dayOfWeek}-${currentCourseInfo.startSection}-${currentCourseInfo.location}-${currentCourseInfo.weekType}-${currentCourseInfo.sectionCount}`

      // 如果这个课程还没有被处理过，则加入到结果中
      if (!seenCourses.has(courseKey)) {
        seenCourses.add(courseKey)
        mergedCourses.push(currentCourse)
      }
    }

    return mergedCourses
  }

  // 去重函数
  private removeDuplicates(courseList: CourseSp[]): CourseSp[] {
    const uniqueCourses: CourseSp[] = []
    const seenCourses = new Set<string>()

    courseList.forEach((course) => {
      const course0 = course.classes[0]
      const courseKey = `${course.id}-${course0.dayOfWeek}-${course0.startSection}-${course0.location}-${course0.weekType}-${course0.sectionCount}`
      if (!seenCourses.has(courseKey)) {
        seenCourses.add(courseKey)
        uniqueCourses.push(course)
      }
    })

    return uniqueCourses
  }

  /** 提取课程信息的函数，主要作用是对返回的数据进行处理，并转换成我们需要的course格式  */
  private extractClassInfo(data: ApiResponse): CourseSp[] {
    const classInfo: CourseSp[] = []

    if (!data || !data.kbList || !Array.isArray(data.kbList)) {
      throw new Error('Invalid data format or missing kbList:')
    }

    const kbList = data.kbList

    for (let i = 0; i < kbList.length; i++) {
      const item = kbList[i]
      const { kcb, dsz, djj, xqj, xxq, xkkh, skcd } = item

      if (!kcb) {
        throw new Error('kcb field is missing in one of the items')
      }

      const kcbItem = kcb.split('<br>')
      const className = kcbItem[0]
      const classTeacherName = kcbItem[2]
      let classLocation = kcbItem[3]

      classLocation = classLocation.replace(/zwf.*/, '').trim()

      const termIdMap = {
        春: Term.Spring,
        夏: Term.Summer,
        秋: Term.Autumn,
        冬: Term.Winter,
        短: Term.Short,
      }
      let termId = 0
      for (let j = 0; j < xxq.length; j++) {
        const season = xxq[j]
        if (season in termIdMap) {
          termId |= termIdMap[season as keyof typeof termIdMap]
        } else {
          throw new Error(`学期匹配失败`)
        }
      }

      const semester: Semester = {
        year: parseInt(data.xnm.split('-')[0], 10),
        term: termId,
      }

      const weekType = dsz === '0' ? 'odd' : dsz === '1' ? 'even' : 'every'

      const classArrangement: ClassArrangement = {
        weekType,
        dayOfWeek: xqj as DayOfWeek,
        startSection: parseInt(djj, 10),
        sectionCount: parseInt(skcd, 10),
        location: classLocation,
      }

      const course: CourseSp = {
        semester,
        id: xkkh,
        name: className,
        teacherName: classTeacherName,
        classes: [classArrangement],
      }

      classInfo.push(course)
    }

    return classInfo
  }

  /**获取指定学号在指定学年范围内的所有课程表信息*/
  async getTimetable(
    /** 学号  */
    userid: string,
    /** 起始学年（靠前的，如2024-2025请传2024）请传字符串！！！ */
    xnmStart: string,
    /** 结束学年（靠前的，如2024-2025请传2024） 请传字符串！！！*/
    xnmEnd: string,
  ): Promise<CourseSp[]> {
    const url = `http://zdbk.zju.edu.cn/jwglxt/kbcx/xskbcx_cxXsKb.html?gnmkdm=N253508&su=${userid}`

    // 定义所有学期的映射关系
    const semesters = [
      { xqm: '1|秋', xqmmc: '秋' },
      { xqm: '1|冬', xqmmc: '冬' },
      { xqm: '2|春', xqmmc: '春' },
      { xqm: '2|夏', xqmmc: '夏' },
      { xqm: '2|短', xqmmc: '长' }, //教务网有两个短，现在将秋冬学期的称为短学期，春夏学期的称为长学期
      { xqm: '1|短', xqmmc: '短' },
      { xqm: '1|暑', xqmmc: '暑' },
    ]

    let allCourses: CourseSp[] = []

    // 遍历学年范围
    for (let xnm = parseInt(xnmStart); xnm <= parseInt(xnmEnd); xnm++) {
      const yearCode = `${xnm}-${xnm + 1}` // 构造学年码，如2024-2025

      // 遍历所有学期
      for (const { xqm, xqmmc } of semesters) {
        const params = new URLSearchParams({
          xnm: yearCode,
          xqm,
          xqmmc,
          xxqf: '0',
          xxfs: '0',
        })

        const response = await this.zjuamService.nxFetch.postUrlEncoded(url, {
          body: params,
        })

        if (!response.ok) {
          throw new Error(
            `Failed to fetch data for ${yearCode} ${xqmmc}. Status: ${response.status}`,
          )
        }

        const responseData: ApiResponse = await response.json()

        const classInfo = this.extractClassInfo(responseData)
        const uniqueClassInfo = this.removeDuplicates(classInfo)

        // 合并课程信息
        allCourses = this.mergeCourses([...allCourses, ...uniqueClassInfo])
      }
    }

    return allCourses
  }
}

export { GetCourse }
