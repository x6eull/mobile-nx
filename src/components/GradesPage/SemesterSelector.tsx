import React from 'react'
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react'

const SemesterSelector: React.FC<{
  selected: string
  onChange: (value: string) => void
}> = ({ selected, onChange }) => {
  return (
    <IonSegment value={selected} onIonChange={(e) => { const newValue = e.detail.value as string; }}>
      <IonSegmentButton value="2018-2019-1">
        <IonLabel>2018 秋冬</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="2018-2019-2">
        <IonLabel>2018-2019-2</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="2019-2020-1">
        <IonLabel>2019-2020-1</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="2019-2020-2">
        <IonLabel>2019-2020-2</IonLabel>
      </IonSegmentButton>
    </IonSegment>
  )
}

export default SemesterSelector
