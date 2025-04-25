import './Dayitem.css'

export default function Dayitem({
  day,
  selected,
  isToday,
  eventCount,
  isCurrentMonth,
}: {
  day: number
  selected: boolean
  isToday: boolean
  eventCount: number
  isCurrentMonth: boolean
}) {
  return (
    <div className='dayitem'>
      <div className={'day'.with(isToday, 'today').with(selected, 'selected')}>
        {day}
      </div>
      <div className='event'>
        {Array.from({ length: eventCount }).map((_, i) => (
          <div key={i} className='dot' />
        ))}
      </div>
    </div>
  )
}
