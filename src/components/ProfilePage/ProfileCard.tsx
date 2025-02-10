import React from 'react'
import { IonAvatar, IonItem, IonLabel } from '@ionic/react'
import './ProfileCard.css'
import avatar from '../../assets/avatar.png'
const ProfileCard: React.FC = () => {
  return (
    <IonItem className="profile-card">
      <IonAvatar aria-hidden="true" slot="start" className="avatar">
        <img src={avatar} alt="用户头像" />
      </IonAvatar>
      <IonLabel className="info">
        <h1>求是潮</h1>
        <p>学号:12345678</p>
      </IonLabel>
    </IonItem>
  )
}

export default ProfileCard
