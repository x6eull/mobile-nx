"use client"
import React, { useState } from 'react'
import {
  IonModal,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
} from '@ionic/react'
import { close, calendarOutline } from 'ionicons/icons'
import ScheduleHeader from '../components/SchedulePage/ScheduleHeader'
import WeekHeader from '../components/SchedulePage/WeekHeader'
import CourseGrid from '../components/SchedulePage/CourseGrid'
import SemesterSelector from '../components/SchedulePage/SemesterSelector'

const Schedule: React.FC = () => {
  return (
    
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonIcon icon={calendarOutline} size="large" />
            </IonButtons>
            <IonTitle>课表</IonTitle>
            <IonButtons slot="end">
              <IonButton >
                <IonIcon icon={close} size="large" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <ScheduleHeader />
          <WeekHeader />
          <CourseGrid />
          <SemesterSelector selected={''} onChange={function (value: string): void {
            throw new Error('Function not implemented.')
          } }/>
        </IonContent>
      </IonPage>
   
  )
}

export default Schedule
