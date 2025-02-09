// pages/NavContainerPage.tsx
import React from 'react'
import {  IonNav } from '@ionic/react'
import Profile from './Profile'
import Login from './Login'


const NavContainerPage: React.FC = () => {
  return (
    
     
      <IonNav
        root={() => <Profile />}
        swipeGesture={true}
      />
      
    
  )
}

export default NavContainerPage
