import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import './Index.css'
import Head from './head/HomeHead'
import Schedule from './schedule/schedule-body/Schedule'
import TodoList from './todoList/TodoList'
import QuickLink from './quickLink/QuickLink'

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">首页</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="homepage-content">
        <Head />
        <Schedule />
        <TodoList />
        <QuickLink />
      </IonContent>
    </IonPage>
  )
}

export default Home
