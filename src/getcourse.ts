import { DayOfWeek, Semester, WeekOfSemester, Term } from './models/shared'
import { Course, ClassArrangement, ExamArrangement } from './models/Course'
import { ZjuamService } from './interop/zjuam'

/*课表相关，请调用getTimetable方法获取课程表信息*/
class getCourse {
  private zjuamService: ZjuamService

  constructor() {
    this.zjuamService = new ZjuamService(
      { service: 'http://zdbk.zju.edu.cn/jwglxt/xtgl/login_ssologin.html' },
      60 * 30,
    )
  }
  /** 合并连续且重名课程的函数
   * 返回内容按照course的定义进行
   * 合并原则：当且仅当两课程ID相同且时间连续的情况下会进行合并，否则会保留ID相同的可成
   */
  private async mergeCourses(courseList: Course[]): Promise<Course[]> {
    courseList.sort((a, b) => {
      if (a.id !== b.id) return a.id.localeCompare(b.id)
      if (a.classes[0].dayOfWeek !== b.classes[0].dayOfWeek)
        return a.classes[0].dayOfWeek - b.classes[0].dayOfWeek
      return a.classes[0].startSection - b.classes[0].startSection
    })
    const mergedCourses: Course[] = []
    for (let i = 0; i < courseList.length; i++) {
      let currentCourse = courseList[i]
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
        currentCourse.classes[0].sectionCount +=
          courseList[i + 1].classes[0].sectionCount
        i++
      }
      mergedCourses.push(currentCourse)
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
      /*传递了一串具体的课程信息，后续需要处理来获得需要内容*/
      kcb: string
      /*单双周表示，0 1 2分别代表单周 双周 每周*/
      dsz: string
      /*第几节课开始*/
      djj: string
      /*星期几*/
      xqj: number
      /*学期区，用汉字标注了经过那几个学期*/
      xxq: string
      /*选课课号，也就是课程ID*/
      xkkh: string
      /*上课长度，用数字标注了上课的长度*/
      skcd: string
    }[]
    /*学年名,如2021-2022，后续仅保留前面即可*/
    xnm: string
  }): Promise<Course[]> {
    const classInfo: Course[] = []
    const termIdMap = { 春: 'Spring', 夏: 'Summer', 秋: 'Autumn', 冬: 'Winter' }

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

      let termId = 0
      for (let j = 0; j < xxq.length; j++) {
        const season = xxq[j]
        if (termIdMap[season]) {
          termId |= Term[termIdMap[season]]
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
        credit: 0,
        teacherName: classTeacherName,
        classes: [classArrangement],
        exams: [],
      }

      classInfo.push(course)
    }

    return classInfo
  }

  /** 获取课程表的主函数，并返回一个course.ts所定义的元素内容，注意，course中的credit和exams无法通过此函数获取，credit无法计算，exams需要从其他方式获取（课程信息中有但不全）*/
  async getTimetable(
    /** 用户的学号 */
    userid: string,
    /** 需要查询的学期信息，具体需传递共3个变量xnm,xqm,xqmmc,具体可看变量说明，剩余两个参数一般情况下默认为0，无需改变 */
    data: {
      /**学年码 如2024-2025*/
      xnm: string
      /**学期码 这里目前只有4种，分别是1|秋，1|冬，2|春，2|夏 ，但是还有长短暑没有处理，并且这一部分传参均为1|？*/
      xqm: string
      /**学期名称 一个汉字，为春，夏，秋，冬，长，短，暑中的一种*/
      xqmmc: string
      /**无法判断该变量的作用，但经测试传'0'即可获取所有的信息，故不予处理，默认为0，可不传*/
      xxqf?: string
      /**无法判断该变量的作用，但经测试传'0'即可获取所有的信息，故不予处理，默认为0，可不传*/
      xxfs?: string
    },
  ): Promise<Course[]> {
    const url = `http://zdbk.zju.edu.cn/jwglxt/kbcx/xskbcx_cxXsKb.html?gnmkdm=N253508&su= ${userid}`

    const { xnm, xqm, xqmmc, xxqf = '0', xxfs = '0' } = data

    try {
      const params = new URLSearchParams(data)
      const response = await this.zjuamService.nxFetch.postUrlEncoded(url, {
        body: params,
      })

      if (!response.ok) {
        throw new Error(
          `Network response was not ok. Status: ${response.status}`,
        )
      }
      const responseData = await response.json()
      const classInfo = await this.extractClassInfo(responseData)
      const uniqueClassInfo = this.removeDuplicates(classInfo)
      return this.mergeCourses(uniqueClassInfo)
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      )
      throw error
    }
  }
}

export { getCourse }
