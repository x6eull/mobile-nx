import React from 'react'
import { IonButton} from '@ionic/react'
import './Logout.css'



const Logout: React.FC = () => {
  return (
    <div className="logout-button">
        <IonButton routerLink='/Login'>退出登录</IonButton>
    </div>
  )
}
export default Logout
 