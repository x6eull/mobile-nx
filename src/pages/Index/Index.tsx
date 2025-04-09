import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import './Index.css'
import Header from './Header/Header'
import Schedule from './Schedule/Schedule'
import TodoList from './TodoList/TodoList'
import QuickLink from './QuickLink/QuickLink'

const events = [
  {
    id: 1,
    name: '微积分甲I',
    startTime: '01:57:35',
    location: '紫金港东2-201(录播)',
    duration: '8:00-10:00',
    description: '小测',
  },
  {
    id: 2,
    name: '工程伦理',
    location: '玉泉曹光彪大楼西楼-201',
    duration: '18:50-20:30',
  },
  {
    id: 3,
    name: '工程伦理',
    location: '玉泉曹光彪大楼西楼-201',
    duration: '18:50-20:30',
  },
  {
    id: 4,
    name: '工程伦理',
    location: '玉泉曹光彪大楼西楼-201',
    duration: '18:50-20:30',
  },
  {
    id: 5,
    name: '工程伦理',
    location: '玉泉曹光彪大楼西楼-201',
    duration: '18:50-20:30',
  },
] as const

export default function Index() {
  return (
    <IonPage>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">首页</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="homepage-content">
        <Header />
        <Schedule events={events} />
        <TodoList />
        <QuickLink />
      </IonContent>
    </IonPage>
  )
}
