import React from 'react'
import { IonGrid, IonRow, IonCol, IonButton, IonIcon } from '@ionic/react'
import { eye, share } from 'ionicons/icons'

const ScheduleHeader: React.FC = () => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <h4>学期学时</h4>
          <h2 style={{ color: '#5A65F1' }}>43.0</h2>
        </IonCol>
        <IonCol className="ion-text-right">
          <IonButton fill="clear">
            <IonIcon icon={eye} size="large" />
          </IonButton>
          <IonButton fill="clear">
            <IonIcon icon={share} size="large" />
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  )
}

export default ScheduleHeader
