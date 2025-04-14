"use client";
import React, { useState } from "react";
import { close } from "ionicons/icons";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
} from "@ionic/react";
import "./Login.css";
import Logo from "./LoginPage/Logo";
import LoginButton from "./LoginPage/LoginButton";
import TermsCheckbox from "./LoginPage/TermsCheckbox";
import LoginInput from "./LoginPage/LoginInput";

interface LoginProps {
  setShowModal: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setShowModal }) => {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton
              onClick={() => setShowModal(false)}
              className="close-button"
            >
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
          <IonTitle className="welcome-title">欢迎使用Mobile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="LoginPage" fullscreen>
        <Logo />
        <LoginInput
          studentId={studentId}
          password={password}
          passwordVisible={passwordVisible}
          onStudentIdChange={setStudentId}
          onPasswordChange={setPassword}
          onTogglePasswordVisibility={handleTogglePasswordVisibility}
        />

        <LoginButton
          isChecked={isChecked}
          studentId={studentId}
          password={password}
        />
        <TermsCheckbox
          isChecked={isChecked}
          setIsChecked={setIsChecked}
        ></TermsCheckbox>
      </IonContent>
    </IonPage>
  );
};

export default Login;
