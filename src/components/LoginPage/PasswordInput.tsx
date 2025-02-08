import React from 'react'
import { IonItem, IonLabel, IonInput, IonIcon } from '@ionic/react'
import { eye, eyeOff } from 'ionicons/icons'

const PasswordInput: React.FC<{
  password: string
  setPassword: (value: string) => void
  passwordVisible: boolean
  togglePasswordVisibility: () => void
}> = ({ password, setPassword, passwordVisible, togglePasswordVisibility }) => {
  return (
    <IonItem>
      <IonLabel position="floating">学校通行证密码</IonLabel>
      <IonInput
        type={passwordVisible ? 'text' : 'password'}
        value={password}
        onIonInput={(e) => setPassword(e.detail.value!)}
        clearOnEdit={false}
      />
      <IonIcon
        slot="end"
        icon={passwordVisible ? eye : eyeOff}
        onClick={togglePasswordVisibility}
        style={{ cursor: 'pointer' }}
      />
    </IonItem>
  )
}

export default PasswordInput
