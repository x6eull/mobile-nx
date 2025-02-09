"use client"
import React, { useState } from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonFooter,
} from '@ionic/react'
import { close, calendarOutline } from 'ionicons/icons'
import ScheduleHeader from '../components/SchedulePage/ScheduleHeader'
import CourseGrid from '../components/SchedulePage/CourseGrid'
import SemesterSelector from '../components/SchedulePage/SemesterSelector'
import './Schedule.css'

const Schedule: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState('2023-fall')

  return (
    <IonPage className="schedule-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonIcon icon={calendarOutline} size="large" />
          </IonButtons>
          <IonTitle>课程表</IonTitle>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={close} size="large" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="schedule-content">
        <div className="schedule-container">
          <ScheduleHeader />
          <CourseGrid />
        </div>
      </IonContent>

      <IonFooter className="ion-no-border schedule-footer">
        <SemesterSelector
          selected={selectedSemester}
          onChange={setSelectedSemester}
        />
      </IonFooter>
    </IonPage>
  )
}

export default Schedule
