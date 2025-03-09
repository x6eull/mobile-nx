import { DayOfWeek, Semester, Term } from '../models/shared'
import { Course, ClassArrangement } from '../models/Course'
import { ZjuamService } from '../interop/zjuam'

/**
 * 只需要部分的course中的内容
 */
type CourseSp = Pick<
  Course,
  'id' | 'name' | 'teacherName' | 'classes' | 'semester'
>

interface ApiRe_Course {
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

// 比较两个 ClassArrangement 是否完全相同
function isClassSame(a: ClassArrangement, b: ClassArrangement) {
  return (
    a.dayOfWeek === b.dayOfWeek &&
    a.startSection === b.startSection &&
    a.sectionCount === b.sectionCount &&
    a.location === b.location &&
    a.weekType === b.weekType
  )
}

// 合并连续的 ClassArrangement
function mergeContinuousClasses(classes: ClassArrangement[]) {
  const result: ClassArrangement[] = []
  for (const currentClass of classes) {
    let merged = false
    for (const mergedClass of result) {
      if (
        mergedClass.dayOfWeek === currentClass.dayOfWeek &&
        mergedClass.weekType === currentClass.weekType &&
        mergedClass.location === currentClass.location &&
        mergedClass.startSection + mergedClass.sectionCount ===
          currentClass.startSection
      ) {
        mergedClass.sectionCount += currentClass.sectionCount
        merged = true
        break
      }
    }
    if (!merged) {
      result.push({ ...currentClass })
    }
  }
  return result
}

export class CourseSpider {
  private zjuamService: ZjuamService

  constructor() {
    this.zjuamService = new ZjuamService(
      { service: 'http://zdbk.zju.edu.cn/jwglxt/xtgl/login_ssologin.html' },
      60 * 30,
    )
  }

  /**
   * 合并课程并去重的函数
   * 合并原则：
   * 1. 当且仅当两课程ID相同且时间连续时，会进行合并。
   * 2. 对于内容完全相同的课程，仅保留一个。
   * 3. 对于ID相同但时间不连续或地点不同的课程，将它们合并到同一个课程对象的classes数组中。
   */
  private mergeAndDeduplicateCourses(courseList: CourseSp[]): CourseSp[] {
    const courseMap = new Map<string, CourseSp>()

    // 统一去重和收集课程安排
    for (const currentCourse of courseList) {
      const courseId = currentCourse.id
      if (!courseMap.has(courseId)) {
        courseMap.set(courseId, { ...currentCourse, classes: [] })
      }
      const existingCourse = courseMap.get(courseId)!
      for (const currentClass of currentCourse.classes) {
        let isDuplicate = false
        for (const existingClass of existingCourse.classes) {
          if (isClassSame(currentClass, existingClass)) {
            isDuplicate = true
            break
          }
        }
        if (!isDuplicate) {
          existingCourse.classes.push({ ...currentClass })
        }
      }
    }

    const mergedCourses: CourseSp[] = []
    for (const course of courseMap.values()) {
      // 对每个课程的 classes 按 startSection 排序
      course.classes.sort((a, b) => a.startSection - b.startSection)
      course.classes = mergeContinuousClasses(course.classes)
      mergedCourses.push(course)
    }

    return mergedCourses
  }

  /**
   * 提取课程信息的函数，主要作用是对返回的数据进行处理，并转换成我们需要的 course 格式
   */
  private extractClassInfo(data: ApiRe_Course): CourseSp[] {
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

  /**
   * 获取指定学号在指定学年范围内的所有课程表信息
   */
  async getTimetable(
    /** 学号  */
    userid: string,
    /** 起始学年（靠前的，如2024 - 2025请传2024） */
    xnmStart: number,
    /** 结束学年（靠前的，如2024 - 2025请传2024）*/
    xnmEnd: number,
  ): Promise<CourseSp[]> {
    const url = `http://zdbk.zju.edu.cn/jwglxt/kbcx/xskbcx_cxXsKb.html?gnmkdm=N253508&su= ${userid}`

    const semesters = [
      { xqm: '1|秋', xqmmc: '秋' },
      { xqm: '1|冬', xqmmc: '冬' },
      { xqm: '2|春', xqmmc: '春' },
      { xqm: '2|夏', xqmmc: '夏' },
      { xqm: '2|短', xqmmc: '短' },
    ]

    let allCourses: CourseSp[] = []

    for (let xnm = xnmStart; xnm <= xnmEnd; xnm++) {
      const yearCode = `${xnm}-${xnm + 1}`

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

        const responseData = (await response.json()) as ApiRe_Course

        const classInfo = this.extractClassInfo(responseData)
        allCourses = allCourses.concat(classInfo) // 收集所有课程
      }
    }

    // 在所有课程收集完成后，统一进行去重和合并
    return this.mergeAndDeduplicateCourses(allCourses)
  }
}
