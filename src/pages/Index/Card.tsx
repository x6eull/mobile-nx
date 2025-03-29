import { ReactNode } from 'react'
import './Card.css'

export function IconImg({ bgColor, src }: { bgColor: string; src: string }) {
  return <img className="icon" src={src} style={{ background: bgColor }} />
}

/** Card是首页的通用组件 */
const Card = ({
  logo,
  title,
  cardHref,
  all,
  children,
}: {
  logo: ReactNode
  title: string
  cardHref: string
  all: string
  children: ReactNode
}) => {
  return (
    <div className="container">
      <div className="head">
        <div className="front-head">
          {logo}
          <div className="title">{title}</div>
        </div>
        <a href={cardHref} className={'all'}>
          {all}
        </a>
      </div>
      {children}
    </div>
  )
}
/**这里的className={name}可以让定制组件内的class不会相互冲突，都包含在这个特定的name下即可 */

export default Card

