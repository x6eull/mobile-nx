import { IonButton, IonButtons, IonToolbar } from '@ionic/react'
import { ReactNode } from 'react'
import { close as iconClose } from 'ionicons/icons'
import './Toolbar.css'
import { useHistory } from 'react-router-dom'

export default function Toolbar({
  icon,
  title,
}: {
  icon: ReactNode
  title: string
}) {
  const his = useHistory()
  return (
    <IonToolbar class='toolbar'>
      <div slot='start' className='info'>
        <div className='toolbar-icon'>{icon}</div>
        <div className='title'>{title}</div>
      </div>
      <IonButtons slot='end'>
        <IonButton onClick={() => his.goBack()} className='close-button'>
          <img src={iconClose} />
        </IonButton>
      </IonButtons>
    </IonToolbar>
  )
}
