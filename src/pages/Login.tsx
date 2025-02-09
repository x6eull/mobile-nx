"use client"
import React, { useState } from 'react'
import {
  IonContent,
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonItem,
  IonLabel,
  IonButtons,
  IonBackButton,
} from '@ionic/react'
import './Login.css'
import Logo from '../components/LoginPage/Logo'
import PasswordInput from '../components/LoginPage/PasswordInput'
import LoginButton from '../components/LoginPage/LoginButton'
import TermsCheckbox from '../components/LoginPage/TermsCheckbox'



const Login: React.FC = () => {


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
           <IonItem>
             <IonLabel position="floating">学号</IonLabel>
             <IonInput type="number" />
           </IonItem>
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
