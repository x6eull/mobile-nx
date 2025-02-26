import {
  IonContent,
  IonPage,
} from '@ionic/react'
import './WeekSchedule.css'
import ScheduleHeader from '../components/WeekSchedulePage/ScheduleHeader'
import EventGrid from '@/components/WeekSchedulePage/EventGrid'



const WeekSchedule: React.FC = () => {
  return (
      <IonPage>
        <ScheduleHeader />
      <IonContent >
        <EventGrid />
      </IonContent>
    </IonPage>
  )
}

export default WeekSchedule
