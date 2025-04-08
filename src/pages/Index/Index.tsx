import React from 'react'
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import './Index.css'
import Header from './components/Header/Header'
import Schedule from './components/Schedule/Schedule'
import TodoList from './components/TodoList/TodoList'
import QuickLink from './components/QuickLink/QuickLink'

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
        <Schedule />
        <TodoList />
        <QuickLink />
      </IonContent>
    </IonPage>
  )
}
