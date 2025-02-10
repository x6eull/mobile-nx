import React from 'react'
import { IonButton, IonContent, IonPage } from '@ionic/react'
import './Profile.css'

import ProfileCard from '../components/ProfilePage/ProfileCard'
import FeatureCard from '../components/ProfilePage/FeatureCard'
import Settings from '../components/ProfilePage/Settings'

const Profile: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="profile-content">
        <ProfileCard />
        <FeatureCard />
        <Settings />
        <div className="logout-button-container">
        <IonButton className="logout-button" fill="outline" routerLink="/login">
          退出登录
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Profile


