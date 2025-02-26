import {
  IonContent,
  IonPage,
} from '@ionic/react'
import './WeekSchedule.css'
import ScheduleHeader from '../components/WeekSchedulePage/ScheduleHeader'
import EventGrid from '@/components/WeekSchedulePage/EventGrid'
import DateSelector from '@/components/WeekSchedulePage/DateSelector'


const WeekSchedule: React.FC = () => {
  return (
      <IonPage>
        <ScheduleHeader />
      <IonContent >
        <DateSelector selectedDate={''} onDateChange={function (date: string): void {
          throw new Error('Function not implemented.')
        }} />
        <EventGrid />
      </IonContent>
    </IonPage>
  )
}

export default WeekSchedule
