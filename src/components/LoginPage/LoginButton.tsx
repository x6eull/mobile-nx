import React from 'react'
import { IonButton } from '@ionic/react'

const LoginButton: React.FC<{ isChecked: boolean }> = ({ isChecked }) => {
  return (
    <IonButton expand="block" disabled={!isChecked} className="login-button">
      开启 Mobile
    </IonButton>
  )
}

export default LoginButton
