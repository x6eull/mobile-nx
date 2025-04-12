import React, { useState } from 'react'
import {
  IonPage,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonImg,
  IonLabel,
  IonSegmentView,
  IonSegmentContent,
} from '@ionic/react'
import { close } from 'ionicons/icons'
import kbleft from '../../assets/schedule-left.png'
import CourseScheduleHeader from './Header/CourseScheduleHeader'
import CourseGrid from './Grid/CourseGrid'
import SemesterSelector from './Semester/SemesterSelector'
import { Course } from '../../models/Course'
import { Term, Semester } from '../../models/shared'
import './CourseSchedule.css'

const courses: Course[] = [
  {
    semester: { year: 2024, term: Term.Autumn },
    name: '微积分（甲）II',
    classes: [
      {
        weekType: 'every',
        dayOfWeek: 1,
        startSection: 1,
        sectionCount: 2,
        location: '紫金港东 2-201',
      },
    ],
  },
  {
    semester: { year: 2024, term: Term.Autumn },
    name: '微积分（甲）II',
    classes: [
      {
        weekType: 'every',
        dayOfWeek: 3,
        startSection: 3,
        sectionCount: 2,
        location: '紫金港东 2-201',
      },
    ],
  },
  {
    semester: { year: 2024, term: Term.Autumn },
    name: '微积分（甲）II',
    classes: [
      {
        weekType: 'every',
        dayOfWeek: 4,
        startSection: 3,
        sectionCount: 2,
        location: '紫金港东 2-201',
      },
    ],
  },
]

const semesterList: Semester[] = [
  { year: 2024, term: Term.Autumn },
  { year: 2023, term: Term.Summer },
  { year: 2023, term: Term.Spring },
  { year: 2023, term: Term.Winter },
  { year: 2023, term: Term.Autumn },
]

const CourseSchedule: React.FC = () => {
  const firstSemester = semesterList[0]
  const defaultSemester = `${firstSemester.year}-${Term[firstSemester.term]}`

  const [selectedSemester, setSelectedSemester] = useState(defaultSemester)
  const [isTextVisible, setIsTextVisible] = useState(true)
  const [creditHours, setCreditHours] = useState(43.0)

  const handleTextVisibilityChange = (visible: boolean) => {
    setIsTextVisible(visible)
  }

  return (
    <IonPage className='schedule-page'>
      <IonToolbar>
        <div className='header-content'>
          <IonImg
            src={kbleft}
            alt='KB Left'
            slot='start'
            className='kbleft-img'
          />
          <IonLabel className='schedule-title'>课表</IonLabel>
        </div>
        <IonButtons slot='end'>
          <IonButton routerLink='/profile'>
            <IonIcon icon={close} size='large' />
          </IonButton>
        </IonButtons>
      </IonToolbar>

      <IonContent className='schedule-content' scrollY={true} fullscreen={true}>
        <IonSegmentView>
          <IonSegmentContent id='semesterKey' className='schedule-content'>
            <CourseScheduleHeader
              creditHours={creditHours}
              isTextVisible={isTextVisible}
              onTextVisibilityChange={handleTextVisibilityChange}
            />
            <CourseGrid
              courses={courses}
              selectedSemester={selectedSemester}
              isTextVisible={isTextVisible}
            />
          </IonSegmentContent>
        </IonSegmentView>
        <SemesterSelector
          semesterList={semesterList}
          selected={selectedSemester}
          onChange={setSelectedSemester}
        />
      </IonContent>
    </IonPage>
  )
}

export default CourseSchedule
