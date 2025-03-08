import { GradeSpider } from './grades'
import type { Course } from '../../../models/Course'
interface AverageGrade {
  totalCredit: number
  mark5: number
  mark4: number
  mark4_3: number
}
interface semester {
  year: number
  term: number
}
interface semesterGrade {
  semester: semester
  totalCredit: number
  mark5: number
}
function mark5_4(mark5: string) {
  if (Number(mark5) >= 4.2) return 4.0
  return Number(mark5)
}
function mark5_4_3(mark5: string) {
  switch (mark5) {
    case '5':
      return 4.3
    case '4.8':
      return 4.2
    case '4.5':
      return 4.1
    case '4.2':
      return 4.0
  }
  return Number(mark5)
}
function rawGrades(originScore: string) {
  switch (originScore) {
    // 特殊情况
    case '弃修':
    case '缓考':
    case '零分':
    case '缺考':
    case '违纪':
      return 0

    // 二级制
    case '合格':
      return 75
    case '不合格':
      return 0

    // 五级制 - 文字
    case '优秀':
      return 90
    case '良好':
      return 80
    case '中等':
      return 70
    case '及格':
      return 60
    case '不及格':
      return 0

    // 五级制 - 字母
    case 'A+':
      return 100
    case 'A':
      return 90
    case 'A-':
      return 87
    case 'B+':
      return 83
    case 'B':
      return 80
    case 'B-':
      return 77
    case 'C+':
      return 74
    case 'C':
      return 71
    case 'C-':
      return 68
    case 'D':
      return 60
    case 'F':
      return 0
  }
}
export class GradeProcess {
  private gradeSpider = new GradeSpider()
  semesterGrades: semesterGrade[] = []
  averageGrade: AverageGrade = {
    mark4: 0,
    mark4_3: 0,
    mark5: 0,
    totalCredit: 0,
  }
  constructor() {}
  isEqual(obj1: any, obj2: any): boolean {
    //console.log(JSON.stringify(obj1) === JSON.stringify(obj2))
    return JSON.stringify(obj1) === JSON.stringify(obj2)
  }
  async processGrades() {
    const rawGrades = await this.gradeSpider.processGrades()
    let totalCredit = 0
    let totalMark5 = 0
    let sumCredit = 0
    let sumMark4_3 = 0
    let sumMark4 = 0
    let sumMark5 = 0
    let semester: semester = { year: 0, term: 0 }
    for (const grade of rawGrades) {
      //console.log('1')
      if (semester.year === 0) {
        semester = grade.course.semester
      } else if (!this.isEqual(semester, grade.course.semester)) {
        this.semesterGrades.push({
          semester: semester,
          totalCredit: totalCredit,
          mark5: totalMark5 / totalCredit,
        })
        semester = grade.course.semester
        totalCredit = 0
        totalMark5 = 0
      }
      if (grade.isAborted) continue
      totalCredit += grade.course.credit

      totalMark5 += Number(grade.rawGradePoint) * grade.course.credit
      sumCredit += grade.course.credit
      sumMark4 += mark5_4(grade.rawGradePoint) * grade.course.credit
      sumMark4_3 += mark5_4_3(grade.rawGradePoint) * grade.course.credit
      sumMark5 += Number(grade.rawGradePoint) * grade.course.credit
    }
    this.semesterGrades.push({
      semester: semester,
      totalCredit: totalCredit,
      mark5: Math.round((totalMark5 / totalCredit) * 100) / 100,
    })
    this.averageGrade = {
      mark4: Math.round((sumMark4 / sumCredit) * 100) / 100,
      mark4_3: Math.round((sumMark4_3 / sumCredit) * 100) / 100,
      mark5: Math.round((sumMark5 / sumCredit) * 100) / 100,
      totalCredit: Math.round(sumCredit * 100) / 100,
    }
    return this.semesterGrades
  }
  async allGrades() {
    return this.averageGrade
  }
}
// 1、计算学期均绩
// 2、计算总均绩
// 3、计算对应转换后分数
const gradeProcess = new GradeProcess()
console.log(await gradeProcess.processGrades())
console.log(await gradeProcess.allGrades())
