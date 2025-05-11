import './ItemRow.css'

export default function ItemRow({
  ribbonBackground,
  title,
  subtitle,
  extra,
  onClick,
}: {
  ribbonBackground: string
  title: string
  subtitle?: string
  extra?: string
  onClick?: () => void
}) {
  return (
    <div
      className='item-row'
      onClick={onClick}
      style={{ '--ribbon-background': ribbonBackground } as React.CSSProperties}
    >
      <div className='info'>
        <div className='title'>{title}</div>
        {subtitle && <div className='subtitle'>{subtitle}</div>}
      </div>
      {extra && <div className='extra'>{extra}</div>}
    </div>
  )
}
