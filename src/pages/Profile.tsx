import React from 'react'
import {
  IonButton,
  IonContent,
  IonNavLink,
  IonPage
} from '@ionic/react'
import './Profile.css'

import ProfileCard from '../components/ProfilePage/ProfileCard'
import FeatureCard from '../components/ProfilePage/FeatureCard'
import Settings from '../components/ProfilePage/Settings'
import Login from './Login'
const Profile: React.FC = () => {
  return (
    <>
      <IonPage>
        <IonContent fullscreen>
          <ProfileCard />
          <FeatureCard />
          <Settings />
          
            <IonButton
              className="logout-button"
              fill="outline"
              routerLink="/login"
            >
              退出登录
            </IonButton>

          
        </IonContent>
      </IonPage>
    </>
  )
}

export default Profile


