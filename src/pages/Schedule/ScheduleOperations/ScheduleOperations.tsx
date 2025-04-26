import { IonButton, IonButtons } from '@ionic/react'
import './ScheduleOperations.css'

function GotoToday({
  onClick,
  isToday,
}: {
  onClick: () => void
  isToday: boolean
}) {
  return (
    <IonButton className='goto-today' onClick={onClick}>
      {isToday ? <div className='container'>今</div> : <div>今</div>}
    </IonButton>
  )
}

export default function ScheduleOperations({
  isToday,
  gotoToday,
  onClickSingle,
  onClickDouble,
  onClickMonth,
}: {
  isToday: boolean
  gotoToday: () => void
  onClickSingle: () => void
  onClickDouble: () => void
  onClickMonth: () => void
}) {
  return (
    <IonButtons class='schedule-operations' collapse={true} slot='end'>
      <GotoToday onClick={gotoToday} isToday={isToday} />
      <IonButton onClick={onClickSingle}>单</IonButton>
      <IonButton onClick={onClickDouble}>双</IonButton>
      <IonButton onClick={onClickMonth}>月</IonButton>
    </IonButtons>
  )
}
