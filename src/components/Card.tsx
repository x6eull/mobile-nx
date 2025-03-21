import { ReactNode } from 'react'
import './Card.css'

const Card = ({
  logo,
  title,
  cardHref,
  all,
  name,
  children,
}: {
  logo: string
  title: string
  cardHref: string
  all: string
  name: string
  children: ReactNode
}) => {
  return (
    <div className="container">
      <div className="head">
        <img src={logo} alt="404" className={name} />
        <span className="title">{title}</span>
        <a href={cardHref} className={'all'}>
          {all}
        </a>
      </div>
      {children}
    </div>
  )
}
/**这里的className={name}可以让定制组件内的clss不会相互冲突，都包含在这个特定的name下即可 */

export default Card

