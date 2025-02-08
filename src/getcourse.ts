import { DayOfWeek, Semester, WeekOfSemester, Term } from './models/shared'
import { Course, ClassArrangement, ExamArrangement } from './models/Course'
import { ZjuamService } from './interop/zjuam' // 引入nxFetch和ZjuamService

/** 合并连续且重名课程的函数
 * 返回内容按照course的定义进行
 * 合并原则：当且仅当两课程ID相同且时间连续的情况下会进行合并，否则会保留ID相同的可成
 */
async function mergeCourses(courseList: Course[]): Promise<Course[]> {
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
function removeDuplicates(courseList: Course[]): Course[] {
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

/**  提取课程信息的函数，主要作用是对返回的数据进行处理，并转换成我们需要的course格式  */
async function extractClassInfo(data: {
  kbList: any[]
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
    //之前测试的时候有且仅有一次出现过kcb丢失的情况，故做此，若后续没有的话会删除
    if (!kcb) {
      console.error('kcb field is missing in one of the items:', item)
      continue
    }

    //对课程表进行分割，从中获取地点等信息
    //其实zwf隔开的最后一项表示考试的地点，但似乎只有期末考试不全，加之非本代码实现的功能，故暂不做处理
    const kcbItem = kcb.split('<br>')
    const className = kcbItem[0]
    const classTeacherName = kcbItem[2]
    let classLocation = kcbItem[3]

    if (classLocation.includes('zwf')) {
      classLocation = classLocation.split('zwf')[0].trim()
    }

    //课程所在学期的标注转换，转换到通过course定义的以二进制定义的内容
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

    //单双周的处理，教务网用0 1 2表示单双周，我们用odd even every表示
    const weekType = dsz === '0' ? 'odd' : dsz === '1' ? 'even' : 'every'

    //将变量转化成classarrangement的需求，并将部分string变脸转化为int/number
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

/**获取课程表的主函数，并返回一个course.ts所定义的元素内容，注意，course中的credit和exams无法通过此函数获取，credit无法计算，exams需要从其他方式获取（课程信息中有但不全）*/
export async function getTimetable(
  /** 用户的学号 */
  userid: string,
  /** 需要查询的学期信息，具体需传递共3个变量xnm,xqm,xqmmc,具体可看变量说明，剩余两个参数一般情况下默认为0，无需改变 */
  data: {
    /**学年码 如2024-2025*/
    xnm: string // 学年码
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
  const url = `http://zdbk.zju.edu.cn/jwglxt/kbcx/xskbcx_cxXsKb.html?gnmkdm=N253508&su=${userid}`

  //为xxqf,xxfs设置了默认值（但不确定格式是否正确），因为根据测试这两个值暂时不影响返回结果
  const { xnm, xqm, xqmmc, xxqf = '0', xxfs = '0' } = data

  try {
    const service = new ZjuamService(
      { service: 'http://zdbk.zju.edu.cn/jwglxt/xtgl/login_ssologin.html' },
      60 * 30,
    )
    const params = new URLSearchParams(data)
    const response = await service.nxFetch.postUrlEncoded(url, {
      body: params,
    })

    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`)
    }
    const responseData = await response.json()
    const classInfo = await extractClassInfo(responseData)
    const uniqueClassInfo = removeDuplicates(classInfo)
    return mergeCourses(uniqueClassInfo)
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error)
    throw error
  }
}
