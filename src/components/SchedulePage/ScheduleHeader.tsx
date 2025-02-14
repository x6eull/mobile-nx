import React from 'react'
import {  IonButton, IonImg } from '@ionic/react'
import eye from '../../assets/kbheader-eye.png'
import  out  from '../../assets/kbheader-out.png'
import './ScheduleHeader.css'

const ScheduleHeader: React.FC = () => {
  return (
    <div className="schedule-header">
      <div className="credit-info">
        <span className="credit-label">学期学时</span>
        <span className="credit-value">43.0</span>
      </div>
      <div className="action-buttons">
        <IonButton fill="clear" size="small">
          <IonImg src={eye} alt="eye" />
        </IonButton>
        <IonButton fill="clear" size="small">
          <IonImg src={out} alt="Out" />
        </IonButton>
      </div>
    </div>
  )
}

export default ScheduleHeader
