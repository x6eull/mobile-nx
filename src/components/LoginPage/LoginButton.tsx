import React from 'react'
import { IonButton } from '@ionic/react'
import './LoginButton.css'

interface LoginButtonProps {
  isChecked: boolean
  studentId: string
  password: string
}

const LoginButton: React.FC<LoginButtonProps> = ({
  isChecked,
  studentId,
  password,
}) => {
  const isDisabled = !isChecked || !studentId || !password

  const handleLogin = () => {
    console.log('登录信息：', { studentId, password })
  }

  return (
    <IonButton
      expand="block"
      className="login-button"
      disabled={isDisabled}
      onClick={handleLogin}
    >
      开启 Mobile
    </IonButton>
  )
}

export default LoginButton
