import { useContext, useMemo, useState } from 'react'
import { IonButton, IonButtons, IonPage } from '@ionic/react'
import IconCourseSchedule from './iconCourseSchedule.svg?react'
import IconEye from './eye.svg?react'
import CourseTimetable from './CourseTimetable/CourseTimetable'
import {
  fromSemesterNumber,
  Semester,
  toSemesterNumber,
  toSingleSemesters,
} from '@/models/Semester'
import './CourseSchedule.css'
import Toolbar from '@/components/Toolbar/Toolbar'
import SemesterSegment from '@/components/SemesterSegment/SemesterSegment'
import { CourseCombinedContext } from '@/context/CourseCombinedContext'
import { CourseBase } from '@/models/CourseBase'
import { CourseClassInfo } from '@/models/CourseClassInfo'

export default function CourseSchedule() {
  //TODO 这个页面的布局还需要调整一下
  // 特别是文本省略（能显示1行/2行/4行）的布局问题
  const courseCombined = useContext(CourseCombinedContext)
  const [currentSemester, setCurrentSemester] = useState<Semester | null>(null)
  const [isTextVisible, setIsTextVisible] = useState(true)

  const semesterList = useMemo(
    () =>
      new Set(
        courseCombined
          .map((c) => toSingleSemesters(c.semester))
          .flat(1)
          .map((s) => toSemesterNumber(s)),
      )
        .keys()
        .map((n) => fromSemesterNumber(n))
        .toArray(),
    [courseCombined],
  )
  const courseFiltered = useMemo(
    () =>
      courseCombined.filter((course) => {
        const semester = course.semester
        return (
          semester.year === currentSemester?.year &&
          currentSemester?.term & semester.term &&
          'classes' in course
        )
      }),
    [courseCombined, currentSemester],
  ) as (CourseBase & CourseClassInfo)[]

  return (
    <IonPage className='course-schedule no-app-nav'>
      <Toolbar
        icon={<IconCourseSchedule className='icon-course-schedule' />}
        title='课表'
      />
      <div className='content'>
        <div className='conclusion'>
          <div className='info'>
            {/* TODO
            <div className='field'>
              <div className='label'>学期学分</div>
              <div className='value'>30.0</div>
            </div> */}
            <div className='field'>
              <div className='label'>学期学时</div>
              <div className='value'>-</div>
            </div>
          </div>
          <IonButtons className='operations'>
            <IonButton
              onClick={() => setIsTextVisible(!isTextVisible)}
              className={'button'.with(isTextVisible, 'primary')}
            >
              <IconEye />
            </IonButton>
          </IonButtons>
        </div>
        <CourseTimetable
          courses={courseFiltered}
          isTextVisible={isTextVisible}
        />
      </div>
      <SemesterSegment
        items={semesterList}
        value={currentSemester}
        onChange={setCurrentSemester}
      />
    </IonPage>
  )
}
