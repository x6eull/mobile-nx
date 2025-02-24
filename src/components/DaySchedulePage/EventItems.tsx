import React, { useState } from 'react'
import {
  IonHeader,
  IonImg,
  IonLabel,
  IonToolbar,
  IonButtons,
  IonButton,
} from '@ionic/react'
import './ScheduleHeader.css'
import weekschedule from '../../assets/week-schedule-switch.png'
import jintext from '../../assets/jin-text.png'
const EventItems: React.FC = () => {
  return (
    <IonHeader>
      <IonToolbar>
        <div className="header-content">
          <IonLabel className="schedule-title">2025年 三月 春5周</IonLabel>

          <IonButtons slot="end">
            <IonButton routerLink="/day-schedule/week-schedule">
              <IonImg
                src={weekschedule}
                alt="week-schedule"
                slot="end"
                className="week-schedule-img"
              />
            </IonButton>
          </IonButtons>
          <IonImg
            src={jintext}
            alt="jin-text"
            slot="end"
            className="jin-text-img"
          />
        </div>
      </IonToolbar>
    </IonHeader>
  )
}

export default EventItems
