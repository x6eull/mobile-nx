"use client";
import React, { useState } from "react";
import { close, eye, eyeOff } from "ionicons/icons";
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
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonCheckbox,
} from "@ionic/react";
import logo from '../logo.svg';
import './LoginPage.css';

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

  const isDisabled = !isChecked || !studentId || !password;

  const handleLogin = () => {
    console.log('登录信息：', { studentId, password });
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
        {/* Logo 组件 */}
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
          <p className="version-text">Mobile V4 2.1.0.24111101</p>
        </div>
        {/* LoginInput 组件 */}
        <IonList>
          <IonItem>
            <IonInput
              label="学号"
              type="number"
              value={studentId}
              onIonChange={(e) => setStudentId(e.detail.value || '')}
              clearInput={true}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonInput
              label="学校通行证密码"
              type={passwordVisible ? 'text' : 'password'}
              value={password}
              onIonChange={(e) => setPassword(e.detail.value || '')}
              clearInput={true}
            >
              <IonButton
                fill="clear"
                slot="end"
                onClick={(e) => {
                  e.preventDefault();
                  handleTogglePasswordVisibility();
                }}
                aria-label={passwordVisible ? '隐藏密码' : '显示密码'}
              >
                <IonIcon
                  className="password-icon"
                  slot="icon-only"
                  icon={passwordVisible ? eyeOff : eye}
                  aria-hidden="true"
                ></IonIcon>
              </IonButton>
            </IonInput>
          </IonItem>
        </IonList>
        {/* LoginButton 组件 */}
        <IonButton
          expand="block"
          className="login-button"
          disabled={isDisabled}
          onClick={handleLogin}
        >
          开启 Mobile
        </IonButton>
        {/* TermsCheckbox 组件 */}
        <IonItem lines="none" className="terms-checkbox">
          <IonCheckbox
            slot="start"
            checked={isChecked}
            onIonChange={(e) => setIsChecked(e.detail.checked)}
          />
          <IonLabel className="ion-text-wrap">
            同意
            <a href="/terms" className="terms-link">
              免责声明、隐私政策等服务条款
            </a>
          </IonLabel>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Login;