import React from 'react'
import { IonRow, IonCol, IonButton, IonIcon } from '@ionic/react'
import { eye, shareSocial } from 'ionicons/icons'
import './ScheduleHeader.css'

const ScheduleHeader: React.FC = () => {
  return (
    <div className="schedule-header">
      <div className="credit-info">
        <span className="credit-label">学期学分</span>
        <span className="credit-value">43.0</span>
      </div>
      <div className="action-buttons">
        <IonButton fill="clear" size="small">
          <IonIcon icon={eye} slot="icon-only" />
        </IonButton>
        <IonButton fill="clear" size="small">
          <IonIcon icon={shareSocial} slot="icon-only" />
        </IonButton>
      </div>
    </div>
  )
}

export default ScheduleHeader
