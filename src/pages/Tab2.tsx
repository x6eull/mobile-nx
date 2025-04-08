import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import ExploreContainer from '../components/ExploreContainer'
import './Tab2.css'
import ScrollCalendar from '../components/cal'
import Swiper from '../components/Swiper'

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
        <div style={{ padding: '20px' }}>
          <h2>简单拖拽轮播</h2>
          <Swiper
            items={items}
            width={600}
            height={400}
            defaultSlideIndex={1}
          />
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Tab2

