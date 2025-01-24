import React from 'react'
import { IonCard, IonCardContent, IonGrid, IonRow, IonCol } from '@ionic/react'

const SemesterSummary: React.FC = () => {
  return (
    <IonCard>
      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <h4>学期学分</h4>
              <h2>30.0</h2>
            </IonCol>
            <IonCol>
              <h4>学期均绩</h4>
              <h2>4.80</h2>
            </IonCol>
            <IonCol>
              <h4>学年学分</h4>
              <h2>64.5</h2>
            </IonCol>
            <IonCol>
              <h4>学年均绩</h4>
              <h2>4.80</h2>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  )
}

export default SemesterSummary
