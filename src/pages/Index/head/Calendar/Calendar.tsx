import './Calendar.css'

export default function Calendar(props: {
  year: number
  month: number
  day: number
  season: string
  number: number
  num: string
}) {
  return (
    <div className="calendar-container">
      <div className="calendar-date">
        {props.year}年{props.month}月{props.day}日
      </div>
      <div className="calendar-week">
        <div>
          {props.season}
          {props.number}周
        </div>
        <div>星期{props.num}</div>
      </div>
    </div>
  )
}
