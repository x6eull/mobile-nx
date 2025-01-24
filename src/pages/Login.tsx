import React, { useState } from 'react'
import {
  IonContent,
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonCheckbox,
  IonText,
} from '@ionic/react'
import './Login.css'
import { eye, eyeOff } from 'ionicons/icons'
import logo from '../assets/logo.png'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>欢迎使用Mobile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="LoginPage" fullscreen>
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
          <p className="version-text">Mobile V4 2.1.0.24111101</p>
        </div>
        <IonItem>
          <IonLabel position="floating">学号</IonLabel>
          <IonInput
            type="text"
            value={username}
            onIonInput={(e) => setUsername(e.detail.value!)}
            clearInput/>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">学校通行证密码</IonLabel>
          <IonInput type={passwordVisible ? 'text' : 'password'}
          value={password} 
            onIonInput={(e) => setPassword(e.detail.value!)}
            clearOnEdit={false}/>
          <IonIcon
            slot="end"
            icon={passwordVisible ? eye : eyeOff}
            onClick={() => setPasswordVisible(!passwordVisible)}
            style={{ cursor: 'pointer' }}
          />
        </IonItem>
        {/* 按钮（默认禁用，只有勾选复选框后启用） */}
        <IonButton
          expand="block"
          disabled={!isChecked}
          className="login-button"
        >
          开启 Mobile
        </IonButton>

        {/* 复选框 + 用户协议 */}
        <IonItem lines="none">
          <IonCheckbox
            checked={isChecked}
            onIonChange={(e) => setIsChecked(e.detail.checked)}
          />
          <IonText>
            <span>
              同意 <a href="/terms">免责声明、隐私政策等服务条款</a>
            </span>
          </IonText>
        </IonItem>
      </IonContent>
    </IonPage>
  )
}

export default Login
