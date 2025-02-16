import React, { useState } from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonImg,
  IonLabel,
} from '@ionic/react'
import { close } from 'ionicons/icons'
import kbleft from '../assets/schedule-left.png'
import CourseScheduleHeader from '../components/CourseSchedulePage/CourseScheduleHeader'
import CourseGrid from '../components/CourseSchedulePage/CourseGrid'
import SemesterSelector from '../components/CourseSchedulePage/SemesterSelector'
import './CourseSchedule.css'

const CourseSchedule: React.FC = () => {
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

      <IonContent className="schedule-content" scrollY={true} fullscreen={true} >
        
        <div className="schedule-container">
          <CourseScheduleHeader />
          <CourseGrid />
        </div>
       
        <SemesterSelector
          selected={selectedSemester}
          onChange={setSelectedSemester}
          />
        
      </IonContent>

      
        
      
      </IonPage>
  )
}

export default CourseSchedule
