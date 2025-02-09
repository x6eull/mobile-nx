import React from 'react'
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react'
import './SemesterSelector.css'

const SemesterSelector: React.FC<{
  selected: string
  onChange: (value: string) => void
}> = ({ selected, onChange }) => {
  return (
    <IonSegment 
      value={selected} 
      onIonChange={(e) => onChange(e.detail.value as string)}
      className="semester-selector"
    >
      <IonSegmentButton value="2024-fall">
        <IonLabel>2024 秋</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="2023-summer">
        <IonLabel>2023 夏</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="2023-spring">
        <IonLabel>2023 春</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="2023-winter">
        <IonLabel>2023 冬</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="2023-fall">
        <IonLabel>2023 秋</IonLabel>
      </IonSegmentButton>
    </IonSegment>
  )
}

export default SemesterSelector
