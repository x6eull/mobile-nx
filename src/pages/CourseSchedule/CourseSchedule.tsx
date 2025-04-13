import { useState } from 'react'
import { IonButton, IonButtons, IonPage } from '@ionic/react'
import IconCourseSchedule from './iconCourseSchedule.svg?react'
import IconEye from './eye.svg?react'
import CourseTimetable from './CourseTimetable/CourseTimetable'
import { Term } from '../../models/shared'
import './CourseSchedule.css'
import { CourseBase } from '@/models/CourseBase'
import { CourseClassInfo } from '@/models/CourseClassInfo'
import Toolbar from '@/components/Toolbar/Toolbar'
import SemesterSegment from '@/components/SemesterSegment/SemesterSegment'

const courses: Omit<CourseBase & CourseClassInfo, 'id' | 'teacherName'>[] = [
  {
    semester: { year: 2024, term: Term.Autumn },
    name: '微积分（甲）II',
    classes: [
      {
        weekType: 'every',
        dayOfWeek: 1,
        startSection: 1,
        sectionCount: 2,
        location:
          '紫金港东紫金港东紫金港东紫金港东紫金港东紫金港东紫金港东 2-201',
      },

      {
        weekType: 'odd',
        dayOfWeek: 3,
        startSection: 3,
        sectionCount: 2,
        location: '紫金港东 2-201',
      },
      {
        weekType: 'every',
        dayOfWeek: 4,
        startSection: 3,
        sectionCount: 3,
        location: '紫金港东 2-201',
      },
    ],
  },
]

const semesterList = Array.from({ length: 10 }, (_, i) => ({
  value: `${2020 + i}-${Term.Autumn}`,
  label: `${2020 + i} ${Term[Term.Autumn]}`,
}))

export default function CourseSchedule() {
  const [selectedSemester, setSelectedSemester] = useState(
    semesterList[0].value,
  )
  const [isTextVisible, setIsTextVisible] = useState(true)

  return (
    <IonPage className='course-schedule no-app-nav'>
      <Toolbar
        icon={<IconCourseSchedule className='icon-course-schedule' />}
        title='课表'
      />
      <div className='content'>
        <div className='conclusion'>
          <div className='info'>
            <div className='field'>
              <div className='label'>学期学分</div>
              <div className='value'>30.0</div>
            </div>
            <div className='field'>
              <div className='label'>学期学时</div>
              <div className='value'>32.5</div>
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
        <CourseTimetable courses={courses} isTextVisible={isTextVisible} />
      </div>
      <SemesterSegment
        items={semesterList}
        value={selectedSemester}
        onChange={setSelectedSemester}
      />
    </IonPage>
  )
}
