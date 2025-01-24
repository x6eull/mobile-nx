import React from 'react'
import { IonCard, IonCardContent, IonGrid, IonRow, IonCol } from '@ionic/react'

const GradesSummary: React.FC = () => {
  return (
    <IonCard className="grade-summary">
      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <h3>总学分</h3>
              <h2>123.0</h2>
            </IonCol>
            <IonCol>
              <h3>总均绩</h3>
              <h2>4.33</h2>
            </IonCol>
            <IonCol>
              <h3>4.3分制</h3>
              <h2>3.83</h2>
            </IonCol>
            <IonCol>
              <h3>百分制</h3>
              <h2>87.7</h2>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <p>上次更新时间：2025-1-15 16:01:02</p>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  )
}

export default GradesSummary
