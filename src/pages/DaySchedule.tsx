import React, { useState } from 'react'
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react'
import './DaySchedule.css'
import ScheduleHeader from '../components/DaySchedulePage/ScheduleHeader'
const DaySchedule: React.FC = () => {
  return (
    <IonPage className="day-schedule-page">
      <ScheduleHeader />
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>
    </IonPage>
  )
}

export default DaySchedule
