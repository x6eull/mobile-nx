import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from '@ionic/react'
import ExploreContainer from '../components/ExploreContainer'
import './Tab2.css'

import { useHistory } from 'react-router-dom' // 导入 useHistory 钩子

const Tab2: React.FC = () => {
  const history = useHistory() // 创建历史对象

  const navigateToBusPage = () => {
    history.push('/bus') // 跳转到 /bus 页面
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Tab 2 page" />
        <IonButton
          onClick={navigateToBusPage}
          style={{ backgroundColor: 'grey' }}
        >
          跳转到 Bus 页面
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default Tab2
