
import React, { useState } from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonFooter,
  IonImg,
  IonLabel,
} from '@ionic/react'
import { close } from 'ionicons/icons'
import kbleft from '../assets/schedule-left.png'
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
          <div className="header-content">
            <IonImg src={kbleft} alt="KB Left" slot="start" className="kbleft-img"/>
            <IonLabel className="schedule-title">课表</IonLabel>
          </div>
          <IonButtons slot="end">
            <IonButton routerLink="/profile">
              <IonIcon icon={close} size="large" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="schedule-content"
      scrollY={true}>
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
