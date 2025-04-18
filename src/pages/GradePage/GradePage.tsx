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
import { CourseGradeInfo } from '@/models/CourseGradeInfo'
import { LastUpdatedContext } from '@/context/LastUpdatedContext'

export default function GradePage() {
  const courseCombined = useContext(CourseCombinedContext)
  const lastUpdated = useContext(LastUpdatedContext)
  //计算出可选择的学期列表，以及可用年+Term索引的课程列表
  const [semesterList, yearTermMap] = useMemo(() => {
    const courseWithGrade = courseCombined.filter((c) => 'rawScore' in c)
    const yearTermMap = new Map<
      number,
      Map<ReturnType<typeof toLongTerm>, (CourseBase & CourseGradeInfo)[]>
    >()
    courseWithGrade.forEach((course) => {
      const {
        semester: { year, term },
      } = course
      const longTerm = toLongTerm(term)
      yearTermMap.ensure(
        year,
        () => new Map([[longTerm, [course]]]),
        (termMap) =>
          termMap.ensure(
            longTerm,
            () => [course],
            (courseList) => courseList.push(course),
          ),
      )
    })
    return [
      yearTermMap
        .entries()
        .map(([year, terms]) =>
          terms
            .keys()
            .map((t) => ({ year, term: t }) as Semester)
            .toArray(),
        )
        .toArray()
        .flat(1),
      new Map(
        yearTermMap.entries().map(([year, terms]) => [
          year,
          new Map(
            terms.entries().map(([term, courses]) => {
              // 总学分、总学分绩点
              let totalCredits = 0,
                totalCreditGradePoint = 0
              courses.forEach((course) => {
                //TODO 不及格没有学分？
                if (course.isAborted) return
                totalCredits += course.credit
                totalCreditGradePoint +=
                  course.credit * Number(course.rawGradePoint)
              })
              return [
                term,
                {
                  credits: totalCredits,
                  gpa:
                    totalCredits > 0 ? totalCreditGradePoint / totalCredits : 0,
                  creditGradePoint: totalCreditGradePoint,
                  courses,
                },
              ]
            }),
          ),
        ]),
      ),
    ]
  }, [courseCombined])

  const [currentSemester, setCurrentSemester] = useState<Semester | null>(null)
  const { year, term } = currentSemester ?? { year: 0, term: 0b1 }
  const currentYearMap = yearTermMap.get(year),
    currentSemesterInfo = currentYearMap?.get(term)
  const currentSemesterCredits = currentSemesterInfo?.credits ?? 0,
    currentSemesterGpa = currentSemesterInfo?.gpa ?? 0,
    currentYearCredits =
      currentYearMap?.values().reduce((acc, { credits }) => acc + credits, 0) ??
      0,
    currentYearGpa =
      (currentYearMap
        ?.values()
        .reduce((acc, { creditGradePoint }) => acc + creditGradePoint, 0) ??
        0) / currentYearCredits

  return (
    <IonPage className='grade-page no-app-nav'>
      <Toolbar icon={<IconGrade className='icon-grade' />} title='成绩' />
      {semesterList.length ? (
        <>
          <GradeSummary
            credits={0}
            gpa5={0}
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
