import { useContext, useMemo, useState } from 'react'
import { IonPage } from '@ionic/react'
import IconGrade from './iconGrade.svg?react'
import GradeSummary from './GradeSummary/GradeSummary'
import SemesterGrade from './SemesterGrade/SemesterGrade'
import './GradePage.css'
import { Semester, toLongTerm } from '@/models/Semester'
import Toolbar from '@/components/Toolbar/Toolbar'
import SemesterSegment from '@/components/SemesterSegment/SemesterSegment'
import { CourseCombinedContext } from '@/context/CourseCombinedContext'
import { CourseBase } from '@/models/CourseBase'
import { CourseGradeInfo, getEffectiveness } from '@/models/CourseGradeInfo'
import { LastUpdatedContext } from '@/context/LastUpdatedContext'
import { getMentionedSemesters } from '@/models/CourseCombined'

export default function GradePage() {
  const courseCombined = useContext(CourseCombinedContext)
  const lastUpdated = useContext(LastUpdatedContext)

  // 获取可选择的学期列表，及学年统计、学期统计
  const [semesterList, overallResult] = useMemo(() => {
    const overallResult = {
      creditsGot: 0, // 总获得学分
      creditsCountGpa: 0, // 总gpa计算学分
      creditGradePoint: 0, // 总学分绩点
      yearMap: new Map<
        // 每年的信息
        number,
        {
          creditsGot: number
          creditsCountGpa: number
          creditGradePoint: number
          longTermMap: Map<
            //每长学期的信息
            ReturnType<typeof toLongTerm>,
            {
              creditsGot: number
              creditsCountGpa: number
              creditGradePoint: number
              courses: (CourseBase & CourseGradeInfo)[]
            }
          >
        }
      >(),
    }
    const semesterList = getMentionedSemesters(courseCombined, (c) => {
      if (!('rawScore' in c)) return null
      const { passed, shouldCountGradePoint } = getEffectiveness(c)
      const {
        credit,
        rawGradePoint,
        semester: { year, term },
      } = c
      const longTerm = toLongTerm(term)
      const gradePoint = Number(rawGradePoint)
      const creditsGot = passed ? credit : 0
      const creditsCountGpa = shouldCountGradePoint ? credit : 0
      const creditGradePoint = creditsCountGpa * gradePoint
      /** 如果longTermMap中还不存在该学期信息，则使用此初始化信息 */
      const longTermInfoInit = {
        creditsGot,
        creditsCountGpa,
        creditGradePoint,
        courses: [c],
      }
      // 先把 获得学分、计入gpa学分、学分绩点 加到长学期统计对象上
      overallResult.yearMap.ensure(
        year,
        () => ({
          creditsGot: 0,
          creditsCountGpa: 0,
          creditGradePoint: 0,
          longTermMap: new Map([[longTerm, longTermInfoInit]]),
        }),
        (yearInfo) =>
          yearInfo.longTermMap.ensure(
            longTerm,
            () => longTermInfoInit,
            (longTermInfo) => {
              longTermInfo.creditsGot += creditsGot
              longTermInfo.creditsCountGpa += creditsCountGpa
              longTermInfo.creditGradePoint += creditGradePoint
              longTermInfo.courses.push(c)
            },
          ),
      )
      return { year, term: longTerm }
    })
    // 再对每长学期、每学年数据求和
    overallResult.yearMap.forEach((yearInfo) => {
      yearInfo.longTermMap.forEach((longTermInfo) => {
        yearInfo.creditsGot += longTermInfo.creditsGot
        yearInfo.creditsCountGpa += longTermInfo.creditsCountGpa
        yearInfo.creditGradePoint += longTermInfo.creditGradePoint
      })
      overallResult.creditsGot += yearInfo.creditsGot
      overallResult.creditsCountGpa += yearInfo.creditsCountGpa
      overallResult.creditGradePoint += yearInfo.creditGradePoint
    })
    return [semesterList, overallResult]
  }, [courseCombined])

  const [currentSemester, setCurrentSemester] = useState<Semester | null>(null)
  const currentYearInfo = overallResult.yearMap.get(currentSemester?.year ?? -1)
  const currentSemesterInfo = currentYearInfo?.longTermMap.get(
    (currentSemester?.term ?? -1) as ReturnType<typeof toLongTerm>,
  )
  let currentSemesterCredits = NaN,
    currentSemesterGpa = NaN,
    currentYearCredits = NaN,
    currentYearGpa = NaN
  // 如果出现除0，直接照常提供给子组件，显示NaN
  if (currentYearInfo && currentSemesterInfo) {
    currentSemesterCredits = currentSemesterInfo.creditsGot
    currentSemesterGpa =
      currentSemesterInfo.creditGradePoint / currentSemesterInfo.creditsCountGpa
    currentYearCredits = currentYearInfo.creditsGot
    currentYearGpa =
      currentYearInfo.creditGradePoint / currentYearInfo.creditsCountGpa
  }

  return (
    <IonPage className='grade-page no-app-nav'>
      <Toolbar icon={<IconGrade className='icon-grade' />} title='成绩' />
      {semesterList.length ? (
        <>
          <GradeSummary
            credits={overallResult.creditsGot}
            gpa5={
              overallResult.creditGradePoint / overallResult.creditsCountGpa
            }
            gpa4_3={0}
            gpa100={0}
            lastUpdated={lastUpdated?.format('YYYY.M.D HH:mm:ss') ?? '待更新'}
          />
          <SemesterGrade
            credits={currentSemesterCredits}
            gpa={currentSemesterGpa}
            creditsYear={currentYearCredits}
            gpaYear={currentYearGpa}
            courses={currentSemesterInfo?.courses ?? []}
          />
          <SemesterSegment
            value={currentSemester}
            onChange={setCurrentSemester}
            items={semesterList}
          />
        </>
      ) : (
        <>暂无成绩</>
      )}
    </IonPage>
  )
}
