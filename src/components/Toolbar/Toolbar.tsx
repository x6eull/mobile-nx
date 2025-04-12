import { IonButton, IonButtons, IonToolbar } from '@ionic/react'
import { ReactNode } from 'react'
import { close as iconClose } from 'ionicons/icons'
import './Toolbar.css'

export default function Toolbar({
  icon,
  title,
  backLink,
}: {
  icon: ReactNode
  title: string
  backLink?: string
}) {
  return (
    <IonToolbar class='toolbar'>
      <div slot='start' className='info'>
        <div className='toolbar-icon'>{icon}</div>
        <div className='title'>{title}</div>
      </div>
      <IonButtons slot='end'>
        <IonButton routerLink={backLink} className='close-button'>
          <img src={iconClose} />
        </IonButton>
      </IonButtons>
    </IonToolbar>
  )
}
