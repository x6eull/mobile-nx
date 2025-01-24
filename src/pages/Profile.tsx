import {
  IonContent,
  IonPage
} from '@ionic/react'
import './Profile.css'
import ProfileCard from '../components/ProfileCard'
import FeatureCard from '../components/FeatureCard'
import Settings from '../components/Settings'
import Logout from '../components/Logout'
const Profile: React.FC = () => {
  return (
      <IonPage>
        <IonContent fullscreen>
        <ProfileCard/>
        <FeatureCard/>
        <Settings />
        <Logout/>
        </IonContent>
      </IonPage>
    )
}

export default Profile



