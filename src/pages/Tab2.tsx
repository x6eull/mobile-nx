import { IonContent, IonPage } from '@ionic/react'
import ExploreContainer from '../components/ExploreContainer'
import './Tab2.css'
import ScrollCalendar from '../calendar/Calendar'

const Tab2: React.FC = () => {
  const items = [1, 2, 3, 4].map((num) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '48px',
        backgroundColor: `rgb(${100 + num * 30}, ${150 + num * 20}, ${200 + num * 10})`,
      }}
    >
      {num}
    </div>
  ))

  return (
    <IonPage>
      <IonContent fullscreen>
        <ScrollCalendar />
      </IonContent>
    </IonPage>
  )
}

export default Tab2
