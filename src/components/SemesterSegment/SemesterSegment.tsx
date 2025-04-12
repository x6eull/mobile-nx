import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/react'
import './SemesterSegment.css'

export default function SemesterSegment({
  value,
  onChange,
  items,
}: {
  value: string
  onChange: (value: string) => void
  items: { label: string; value: string }[]
}) {
  //TODO IonSegment在PC上不能横向滚动，但是模拟移动设备时可以
  return (
    <div className='semester-segment-container'>
      <IonSegment
        value={value}
        onIonChange={(e) => onChange(e.detail.value as string)}
        className='segment no-scrollbar'
        scrollable={true}
      >
        {items.map((i) => (
          <IonSegmentButton key={i.value} value={i.value} className='button'>
            <IonLabel>{i.label}</IonLabel>
          </IonSegmentButton>
        ))}
      </IonSegment>
    </div>
  )
}
