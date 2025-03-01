import React, { useState } from 'react'
import {
  IonImg,
  IonLabel,
  IonToolbar,
  IonButtons,
  IonButton,
} from '@ionic/react'
import './ScheduleHeader.css'
import weekschedule from '../../assets/week-schedule-switch.png'
import jintext from '../../assets/jin-text.png'

interface ScheduleHeaderProps {
  selectedDate: Date
}

const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({ selectedDate }) => {
  const formatYearMonth = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth() + 1
    const weekNumber = Math.ceil(selectedDate.getDate() / 7)

    // 判断季节
    let season = ''
    if (month >= 3 && month <= 5) season = '春'
    else if (month >= 6 && month <= 8) season = '夏'
    else if (month >= 9 && month <= 11) season = '秋'
    else season = '冬'

    return `${year}年 ${month}月 ${season}${weekNumber}周`
  }

  return (
    <IonToolbar>
      <div className="header-content">
        <IonLabel className="schedule-title">{formatYearMonth()}</IonLabel>
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
  )
}

export default ScheduleHeader
