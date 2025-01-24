import React from 'react'
import { IonGrid, IonRow, IonCol } from '@ionic/react'

const WeekHeader: React.FC = () => {
  return (
    <IonGrid className="week-header">
      <IonRow>
        {['一', '二', '三', '四', '五', '六', '日'].map((day, index) => (
          <IonCol key={index} className="week-day">
            {day}
          </IonCol>
        ))}
      </IonRow>
    </IonGrid>
  )
}

export default WeekHeader
