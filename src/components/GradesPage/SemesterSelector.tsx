import React from 'react'
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react'
import './SemesterSelector.css'

const SemesterSelector: React.FC<{
  selected: string
  onChange: (value: string) => void
}> = ({ selected, onChange }) => {
  return (
    <div className="semester-selector">
      <IonSegment 
        value={selected} 
        onIonChange={e => onChange(e.detail.value as string)}
        scrollable={true}
      >
        <IonSegmentButton value="2018-fall">
          <IonLabel>2018 秋冬</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="2019-spring">
          <IonLabel>2019 春夏</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="2019-fall">
          <IonLabel>2019 秋冬</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="2020-spring">
          <IonLabel>2020 春夏</IonLabel>
        </IonSegmentButton>
      </IonSegment>
    </div>
  )
}

export default SemesterSelector
