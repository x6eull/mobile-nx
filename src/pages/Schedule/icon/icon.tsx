import { IonButton } from '@ionic/react'
import './icon.css'

export const Dayview = () => {
  return (
    <IonButton className='dayview'>
      <div className='icon-dayview'>
        <div className='icon-dayview-line first'></div>
        <div className='icon-dayview-line second'></div>
        <div className='icon-dayview-line third'></div>
      </div>
    </IonButton>
  )
}

export const Weekview = () => {
  return (
    <IonButton className='weekview'>
      <div className='icon-weekview'>
        <div className='icon-weekview-line first'></div>
        <div className='icon-weekview-line second'></div>
        <div className='icon-weekview-line third'></div>
      </div>
    </IonButton>
  )
}

export const Todayview = ({ onClick }: { onClick: () => void }) => {
  return (
    <IonButton className='todayview' onClick={onClick}>
      <div className='icon-todayview'>
        <div className='icon-todayinner'>今</div>
      </div>
    </IonButton>
  )
}
