import { ReactNode } from 'react'
import './Card.css'

export function IconImg({ bgColor, src }: { bgColor: string; src: string }) {
  return <img className="icon" src={src} style={{ background: bgColor }} />
}

/** Card是首页的通用组件 */
export default function Card(props: {
  logo: ReactNode
  title: string
  linkTitle?: string
  linkHref?: string
  linkColor?: string
  children: ReactNode
}) {
  return (
    <div className="card">
      <div className="head">
        <div className="desc">
          {props.logo}
          {props.title}
        </div>
        <a
          href={props.linkHref}
          className="link"
          style={{ color: props.linkColor }}
        >
          {props.linkTitle}
        </a>
      </div>
      {props.children}
    </div>
  )
}
/**这里的className={name}可以让定制组件内的class不会相互冲突，都包含在这个特定的name下即可 */
