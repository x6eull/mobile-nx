import React from 'react'
import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonList,
} from '@ionic/react'
import { eye, eyeOff } from 'ionicons/icons'

interface LoginInputProps {
  studentId: string
  password: string
  passwordVisible: boolean
  onStudentIdChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onTogglePasswordVisibility: () => void
}

const LoginInput: React.FC<LoginInputProps> = ({
  studentId,
  password,
  passwordVisible,
  onStudentIdChange,
  onPasswordChange,
  onTogglePasswordVisibility,
}) => {
  return (
    <IonList>
      <IonItem>
        <IonLabel position="floating">学号</IonLabel>
        <IonInput
          type="number"
          value={studentId}
          onIonChange={(e) => onStudentIdChange(e.detail.value || '')}
          clearInput={true}
        ></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="floating">学校通行证密码</IonLabel>
        <IonInput
          type={passwordVisible ? 'text' : 'password'}
          value={password}
          onIonChange={(e) => onPasswordChange(e.detail.value || '')}
          clearInput={true}
        >
          <IonButton
            fill="clear"
            slot="end"
            onClick={(e) => {
              e.preventDefault()
              onTogglePasswordVisibility()
            }}
            aria-label={passwordVisible ? '隐藏密码' : '显示密码'}
          >
            <IonIcon
              slot="icon-only"
              icon={passwordVisible ? eyeOff : eye}
              aria-hidden="true"
            ></IonIcon>
          </IonButton>
        </IonInput>
      </IonItem>
    </IonList>
  )
}

export default LoginInput
