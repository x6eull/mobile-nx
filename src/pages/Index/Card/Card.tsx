import { ReactNode } from 'react'
import './Card.css'
import { IonRouterLink } from '@ionic/react'

export function IconImg({ bgColor, src }: { bgColor: string; src: string }) {
  return <img className='card-icon' src={src} style={{ background: bgColor }} />
}

/** Card是首页的通用组件 */
export default function Card(props: {
  icon: ReactNode
  title: string
  linkTitle?: string
  linkHref?: string
  linkColor?: string
  children: ReactNode
}) {
  return (
    <div className='card'>
      <div className='head'>
        <div className='desc'>
          {props.icon}
          {props.title}
        </div>
        <IonRouterLink
          routerLink={props.linkHref}
          className='link'
          style={{ color: props.linkColor }}
        >
          {props.linkTitle}
        </IonRouterLink>
      </div>
      {props.children}
    </div>
  )
}
