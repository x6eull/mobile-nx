import './Dayitem.css'

export default function Dayitem({
  day,
  selected,
  isToday,
}: {
  day: number
  selected: boolean
  isToday: boolean
}) {
  return (
    <div className='dayitem'>
      <div className={`day ${selected ? 'chosen' : isToday ? 'today' : ''}`}>
        {day}
      </div>
      <div className='event'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='dot'></div>
        ))}
      </div>
    </div>
  )
}
