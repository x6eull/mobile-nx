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
import kbleft from '../assets/schedule-left.png'
import CourseScheduleHeader from '../components/CourseSchedulePage/CourseScheduleHeader'
import CourseGrid from '../components/CourseSchedulePage/CourseGrid'
import SemesterSelector from '../components/CourseSchedulePage/SemesterSelector'
import { Course } from '../models/Course'
import { Term } from '../models/shared'
import './CourseSchedule.css'

const courses: Course[] = [
  {
    semester: { year: 2023, term: Term.Autumn },
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

]

const CourseSchedule: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState('2023-fall')

  return (
    <IonPage className="schedule-page">
          
        <IonToolbar>
          <div className="header-content">
            <IonImg
              src={kbleft}
              alt="KB Left"
              slot="start"
              className="kbleft-img"
            />
            <IonLabel className="schedule-title">课表</IonLabel>
          </div>
          <IonButtons slot="end">
            <IonButton routerLink="/profile">
              <IonIcon icon={close} size="large" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      

      <IonContent className="schedule-content" scrollY={true} fullscreen={true}>
        <IonSegmentView>
          <IonSegmentContent id="semesterKey" className="schedule-content">
            <CourseScheduleHeader />
            <CourseGrid 
              courses={courses} 
              selectedSemester={selectedSemester}
            />
          </IonSegmentContent>
        </IonSegmentView>
        <SemesterSelector
          selected={selectedSemester}
          onChange={setSelectedSemester}
        />
      </IonContent>
    </IonPage>
  )
}

export default CourseSchedule
