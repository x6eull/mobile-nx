"use client"
import React, { useState } from 'react'
import {
  IonButtons,
  IonBackButton,
  IonContent,
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/react'
import './Login.css'
import Logo from '../components/LoginPage/Logo'
import UsernameInput from '../components/LoginPage/UsernameInput'
import PasswordInput from '../components/LoginPage/PasswordInput'
import LoginButton from '../components/LoginPage/LoginButton'
import TermsCheckbox from '../components/LoginPage/TermsCheckbox'
const Login: React.FC = () => {
   
  const [isChecked, setIsChecked] = useState(false)
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>欢迎使用Mobile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="LoginPage" fullscreen>
        <Logo />
        <UsernameInput
          username={''}
          setUsername={function (value: string): void {
            throw new Error('Function not implemented.')
          }}
        />
        <PasswordInput
          password={''}
          setPassword={function (value: string): void {
            throw new Error('Function not implemented.')
          }}
          passwordVisible={false}
          togglePasswordVisibility={function (): void {
            throw new Error('Function not implemented.')
          }}
        />
        <LoginButton isChecked={false} />
        <TermsCheckbox
          isChecked={false}
          setIsChecked={function (value: boolean): void {
            throw new Error('Function not implemented.')
          }}
        />
      </IonContent>
    </IonPage>
  )
}

export default Login
