// pages/NavContainerPage.tsx
import React from 'react'
import {  IonNav } from '@ionic/react'
import Profile from './Profile'


const NavContainerPage: React.FC = () => {
  return (
    
     
      <IonNav
        root={() => <Profile />}
        
      />
      
    
  )
}

export default NavContainerPage
