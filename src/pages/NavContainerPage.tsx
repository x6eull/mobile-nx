// pages/NavContainerPage.tsx
import React from 'react'
import { IonPage, IonNav } from '@ionic/react'
import Profile from './Profile'


const NavContainerPage: React.FC = () => {
  return (
    <IonPage>
      {/* 初始化 IonNav，指定根页面 */}
      <IonNav
        root={() => <Profile />}
        
      />
      
    </IonPage>
  )
}

export default NavContainerPage
