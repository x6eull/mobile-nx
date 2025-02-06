import { DayOfWeek, Semester, WeekOfSemester, Term } from './models/shared'
import { Course, ClassArrangement, ExamArrangement } from './models/Course'
import { ZjuamService } from './interop/zjuam' // 引入nxFetch和ZjuamService

// 合并课程的函数
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

// 提取课程信息的函数
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
    const { kcb, dsz, djj, xqj, xxq, sfqd, jszgh, xkkh, skcd, skjc, skdd } =
      item

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

// 获取课程表的函数
export async function getTimetable(
  userid: string,
  data: Record<string, any>,
): Promise<Course[]> {
  const url = `http://zdbk.zju.edu.cn/jwglxt/kbcx/xskbcx_cxXsKb.html?gnmkdm=N253508&su=${userid}`

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

/*
;(async () => {
  try {
    const classInfo = await getTimetable(testUserId, testData)
    console.log('Merged Class Info:', classInfo)
  } catch (error) {
    console.error('Error fetching timetable:', error)
  }
})()*/
