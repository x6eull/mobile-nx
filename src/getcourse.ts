import { DayOfWeek, Semester, Term } from './models/shared'
import { Course, ClassArrangement } from './models/Course'
import { ZjuamService } from './interop/zjuam'

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
   * 返回内容按照course的定义进行
   * 合并原则1：当且仅当两课程ID相同且时间连续的情况下会进行合并，否则会保留ID相同的可成
   * 合并原则2：对于内容完全相同的两个COURSE仅会保留一个
   */
  private mergeCourses(courseList: Course[]): Course[] {
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

    const mergedCourses: Course[] = []
    const seenCourses = new Set<string>() // 用于存储已经处理过的课程的唯一标识

    for (let i = 0; i < courseList.length; i++) {
      let currentCourse = courseList[i]

      // 检查是否与下一个课程完全相同
      while (
        i + 1 < courseList.length &&
        currentCourse.id === courseList[i + 1].id &&
        currentCourse.classes[0].location ===
          courseList[i + 1].classes[0].location &&
        currentCourse.classes[0].dayOfWeek ===
          courseList[i + 1].classes[0].dayOfWeek &&
        currentCourse.classes[0].weekType ===
          courseList[i + 1].classes[0].weekType &&
        currentCourse.classes[0].startSection +
          currentCourse.classes[0].sectionCount ===
          courseList[i + 1].classes[0].startSection
      ) {
        // 合并连续的课程
        currentCourse.classes[0].sectionCount +=
          courseList[i + 1].classes[0].sectionCount
        i++
      }

      // 生成课程的唯一标识
      const courseKey = `${currentCourse.id}-${currentCourse.classes[0].dayOfWeek}-${currentCourse.classes[0].startSection}-${currentCourse.classes[0].location}-${currentCourse.classes[0].weekType}-${currentCourse.classes[0].sectionCount}`

      // 如果这个课程还没有被处理过，则加入到结果中
      if (!seenCourses.has(courseKey)) {
        seenCourses.add(courseKey)
        mergedCourses.push(currentCourse)
      }
    }

    return mergedCourses
  }

  // 去重函数
  private removeDuplicates(courseList: Course[]): Course[] {
    const uniqueCourses: Course[] = []
    const seenCourses = new Set<string>()

    courseList.forEach((course) => {
      const courseKey = `${course.id}-${course.classes[0].dayOfWeek}-${course.classes[0].startSection}-${course.classes[0].location}-${course.classes[0].weekType}-${course.classes[0].sectionCount}`
      if (!seenCourses.has(courseKey)) {
        seenCourses.add(courseKey)
        uniqueCourses.push(course)
      }
    })

    return uniqueCourses
  }

  /** 提取课程信息的函数，主要作用是对返回的数据进行处理，并转换成我们需要的course格式  */
  private async extractClassInfo(data: {
    kbList: {
      /**传递了一串具体的课程信息，后续需要处理来获得需要内容*/
      kcb: string
      /**单双周表示，0 1 2分别代表单周 双周 每周*/
      dsz: string
      /**第几节课开始*/
      djj: string
      /**星期几*/
      xqj: number
      /**学期区，用汉字标注了经过那几个学期*/
      xxq: string
      /**选课课号，也就是课程ID*/
      xkkh: string
      /**上课长度，用数字标注了上课的长度*/
      skcd: string
    }[]
    /*学年名,如2021-2022，后续仅保留前面即可*/
    xnm: string
  }): Promise<Course[]> {
    const classInfo: Course[] = []

    if (!data || !data.kbList || !Array.isArray(data.kbList)) {
      console.error('Invalid data format or missing kbList:', data)
      return classInfo
    }

    const kbList = data.kbList

    for (let i = 0; i < kbList.length; i++) {
      const item = kbList[i]
      const { kcb, dsz, djj, xqj, xxq, xkkh, skcd } = item

      if (!kcb) {
        console.error('kcb field is missing in one of the items:', item)
        continue
      }

      const kcbItem = kcb.split('<br>')
      const className = kcbItem[0]
      const classTeacherName = kcbItem[2]
      let classLocation = kcbItem[3]

      if (classLocation.includes('zwf')) {
        classLocation = classLocation.split('zwf')[0].trim()
      }

      const termIdMap = {
        春: Term.Spring,
        夏: Term.Summer,
        秋: Term.Autumn,
        冬: Term.Winter,
        长: Term.Long,
        短: Term.Short,
        暑: Term.Vacation,
      }
      let termId = 0
      for (let j = 0; j < xxq.length; j++) {
        const season = xxq[j]
        if (season in termIdMap) {
          termId |= termIdMap[season as keyof typeof termIdMap]
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

      const course: Course = {
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
    /** 起始学年（靠前的，如2024-2025请传2025）请传字符串！！！ */
    xnmStart: string,
    /** 结束学年（靠前的，如2024-2025请传2025） 请传字符串！！！*/
    xnmEnd: string,
  ): Promise<Course[]> {
    const url = `http://zdbk.zju.edu.cn/jwglxt/kbcx/xskbcx_cxXsKb.html?gnmkdm=N253508&su=${userid}`

    // 定义所有学期的映射关系
    const semesters = [
      { xqm: '1|秋', xqmmc: '秋' },
      { xqm: '1|冬', xqmmc: '冬' },
      { xqm: '2|春', xqmmc: '春' },
      { xqm: '2|夏', xqmmc: '夏' },
      { xqm: '1|长', xqmmc: '长' },
      { xqm: '1|短', xqmmc: '短' },
      { xqm: '1|暑', xqmmc: '暑' },
    ]

    let allCourses: Course[] = []

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
          console.warn(
            `Failed to fetch data for ${yearCode} ${xqmmc}. Status: ${response.status}`,
          )
          continue
        }

        const responseData = await response.json()
        const classInfo = await this.extractClassInfo(responseData)
        const uniqueClassInfo = this.removeDuplicates(classInfo)

        // 合并课程信息
        allCourses = await this.mergeCourses([
          ...allCourses,
          ...uniqueClassInfo,
        ])
      }
    }

    return allCourses
  }
}

export { GetCourse }
