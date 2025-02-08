import { useState } from 'react'
import React from 'react'
import { IonItem, IonLabel, IonInput } from '@ionic/react'

const UsernameInput: React.FC<{
  username: string,
  setUsername: (value: string) => void
}> = ({ username, setUsername }) => {
 
  return (
    <IonItem>
      <IonLabel position="floating">学号</IonLabel>
      <IonInput/>
    </IonItem>
  )
}

export default UsernameInput
