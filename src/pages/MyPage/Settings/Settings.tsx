import {
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonToggle,
  IonCard,
  IonItemGroup
} from '@ionic/react'

import MdColor from '../MdColorLens.svg'
import MoreProducts from '../MdBatchPrediction.svg'
import MdHelp from '../MdHelp.svg'
import Nav from '../AiFillControl.svg'
import MdInfo from '../MdInfo.svg'
import './Settings.css'


const Settings: React.FC = () => {
  return (
    <div>
      <IonCard>
        <IonList lines="none">
          <IonItemGroup>
            <IonItem>
              <IonIcon slot="start" icon={MdColor} color="primary" />
              <IonLabel>深色模式</IonLabel>
              <IonToggle slot="end" />
            </IonItem>
            <IonItem button>
              <IonIcon slot="start" icon={Nav} color="primary" />
              <IonLabel>自定义导航栏</IonLabel>
            </IonItem>
          </IonItemGroup>
        </IonList>
      </IonCard>

      <IonCard>
        <IonList lines="none">
          <IonItemGroup>
            <IonItem button>
              <IonIcon slot="start" icon={MdHelp} color="warning" />
              <IonLabel>帮助与反馈</IonLabel>
            </IonItem>
            <IonItem button>
              <IonIcon slot="start" icon={MoreProducts} color="warning" />
              <IonLabel>更多产品</IonLabel>
            </IonItem>
            <IonItem button>
              <IonIcon slot="start" icon={MdInfo} color="warning" />
              <IonLabel>关于</IonLabel>
            </IonItem>
          </IonItemGroup>
        </IonList>
      </IonCard>
    </div>
  )
}

export default Settings
