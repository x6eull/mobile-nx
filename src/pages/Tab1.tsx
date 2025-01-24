import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
import Head from '../components/head/head';
import Schedule from '../components/schedule/schedule-body/schedule';
import TodoList from '../components/todoList/todoList';
import QuickLink from '../components/quickLink/quickLink';

const Tab1: React.FC = () => {
  return (
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">首页</IonTitle>
          </IonToolbar>
        </IonHeader>
          <Head/>
          <Schedule/>
          <TodoList/>
          <QuickLink/>
      </IonContent>
  );
};

export default Tab1;
