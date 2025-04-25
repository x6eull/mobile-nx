import { IonButton, IonButtons } from '@ionic/react'
import './ScheduleOperations.css'

function Dayview() {
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

function Weekview() {
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

function GotoToday({ onClick }: { onClick: () => void }) {
  return (
    <IonButton className='goto-today' onClick={onClick}>
      <div className='container'>今</div>
    </IonButton>
  )
}

export default function ScheduleOperations({
  gotoToday,
  onClickSingle,
  onClickDouble,
  onClickMonth,
}: {
  gotoToday: () => void
  onClickSingle: () => void
  onClickDouble: () => void
  onClickMonth: () => void
}) {
  return (
    <IonButtons class='schedule-operations' collapse={true} slot='end'>
      <Dayview />
      <Weekview />
      <GotoToday onClick={gotoToday} />
      <IonButton onClick={onClickSingle}>单</IonButton>
      <IonButton onClick={onClickDouble}>双</IonButton>
      <IonButton onClick={onClickMonth}>月</IonButton>
    </IonButtons>
  )
}
