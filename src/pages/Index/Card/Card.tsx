import { ReactNode } from 'react'
import './Card.css'
import { IonRouterLink } from '@ionic/react'

export function CardIcon({
  bgColor,
  children,
}: {
  bgColor: string
  children: ReactNode
}) {
  return (
    <div className='card-icon' style={{ background: bgColor }}>
      {children}
    </div>
  )
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
