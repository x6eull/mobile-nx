"use client"
import React, { useState } from 'react'
import {
  IonContent,
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
} from '@ionic/react'
import './Login.css'
import Logo from '../components/LoginPage/Logo'
import LoginButton from '../components/LoginPage/LoginButton'
import TermsCheckbox from '../components/LoginPage/TermsCheckbox'
import LoginInput from '../components/LoginPage/LoginInput'

const Login: React.FC = () => {
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isChecked, setIsChecked] = useState(false)

  const handleTogglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/profile"></IonBackButton>
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
        <TermsCheckbox isChecked={isChecked} setIsChecked={setIsChecked} />
        <LoginButton
          isChecked={isChecked}
          studentId={studentId}
          password={password}
        />
      </IonContent>
    </IonPage>
  )
}

export default Login
