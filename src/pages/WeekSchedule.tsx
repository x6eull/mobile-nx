import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import './WeekSchedule.css'
import ScheduleHeader from '../components/WeekSchedulePage/ScheduleHeader'

const WeekSchedule: React.FC = () => {
  return (
      <IonPage>
        <ScheduleHeader />
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        
      </IonContent>
    </IonPage>
  )
}

export default WeekSchedule
