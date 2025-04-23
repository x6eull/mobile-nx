import './Dayitem.css'

interface DateItem {
  year: number
  month: number
  day: number
  active: number // 0: 无  1: 今天
  event: number
}
const Dayitem = ({ date, chosen }: { date: DateItem; chosen: boolean }) => {
  const eventCount = 3

  const status = () => {
    if (chosen) {
      return 'chosen'
    } else if (date.active === 1) {
      return 'today'
    } else {
      return ''
    }
  }
  const Eventdots = () => {
    return (
      <>
        {Array.from({ length: eventCount }).map((_, i) => (
          <div key={i} className='dot'></div>
        ))}
      </>
    )
  }

  return (
    <div className='dayitem'>
      <div className={`day ${status()}`}>{date.day}</div>
      <div className='event'>
        <Eventdots />
      </div>
    </div>
  )
}

export default Dayitem
