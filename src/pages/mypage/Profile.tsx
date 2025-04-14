import React, { useState } from "react";
import { IonButton, IonContent, IonModal, IonPage } from "@ionic/react";
import "./Profile.css";

import ProfileCard from "./ProfilePage/ProfileCard";
import FeatureCard from "./ProfilePage/FeatureCard";
import Settings from "./ProfilePage/Settings";
import Login from "./Login";

const Profile: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <IonPage>
      <IonContent fullscreen className="profile-content">
        <ProfileCard />
        <FeatureCard />
        <Settings />
        <div className="logout-button-container">
          <IonButton
            className="logout-button"
            fill="outline"
            onClick={() => setShowModal(true)}
          >
            退出登录
          </IonButton>
        </div>
      </IonContent>
      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <Login setShowModal={setShowModal} />
      </IonModal>
    </IonPage>
  );
};

export default Profile;
