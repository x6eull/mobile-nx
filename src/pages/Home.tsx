import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import './Home.css'
import Head from '../components/head/HomeHead'
import Schedule from '../components/schedule/schedule-body/Schedule'
import TodoList from '../components/todoList/TodoList'
import QuickLink from '../components/quickLink/QuickLink'

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
