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
import Logout from '../components/ProfilePage/Logout'
import Login from './Login'
const Profile: React.FC = () => {
  return (
    <>
      <IonPage >
        <IonContent fullscreen>
        <ProfileCard/>
        <FeatureCard/>
          <Settings />
          <IonNavLink routerDirection="forward" component={() => <Login />}>
          <IonButton routerLink='/Login'>退出登录</IonButton>
          </IonNavLink>
       
        </IonContent>
    </IonPage>
    </>
    )
}

export default Profile


