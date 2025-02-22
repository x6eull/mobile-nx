import { useRef } from 'react'

import { IonIcon, IonFab, IonFabButton, IonFabList } from '@ionic/react'
import { add } from 'ionicons/icons'
import Daily from './Daily'
import Study from './Study'

export default function Calendar() {
  const modal = useRef<HTMLIonModalElement>(null)
  return (
    <>
      <IonFab
        className="fab-calender"
        slot="fixed"
        vertical="bottom"
        horizontal="end"
      >
        <IonFabButton>
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
        <IonFabList side="top">
          <Daily />
          <Study />
        </IonFabList>
      </IonFab>
    </>
  )
}

