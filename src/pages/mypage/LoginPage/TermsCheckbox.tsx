import React from 'react'
import { IonCheckbox, IonItem, IonLabel } from '@ionic/react'
import './TermsCheckbox.css'

const TermsCheckbox: React.FC<{
  isChecked: boolean
  setIsChecked: (value: boolean) => void
}> = ({ isChecked, setIsChecked }) => {
  return (
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
  )
}

export default TermsCheckbox
