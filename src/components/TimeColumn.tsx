import React from 'react'
import { IonCol } from '@ionic/react'

const TimeColumn: React.FC = () => {
  return (
    <>
      {[...Array(13)].map((_, i) => (
        <IonCol key={i} size="1" className="time-slot">
          <span>
            {8 + Math.floor(i / 2)}:{i % 2 === 0 ? '00' : '50'}
          </span>
          <small>{i + 1}</small>
        </IonCol>
      ))}
    </>
  )
}

export default TimeColumn
