import {
  IonContent,
  IonPage
} from '@ionic/react'
import './Profile.css'
import ProfileCard from '../components/ProfilePage/ProfileCard'
import FeatureCard from '../components/ProfilePage/FeatureCard'
import Settings from '../components/ProfilePage/Settings'
import Logout from '../components/ProfilePage/Logout'
const Profile: React.FC = () => {
  return (
    <>
      <IonPage >
        <IonContent fullscreen>
        <ProfileCard/>
        <FeatureCard/>
        <Settings/>
        <Logout/>
        </IonContent>
    </IonPage>
    </>
    )
}

export default Profile


