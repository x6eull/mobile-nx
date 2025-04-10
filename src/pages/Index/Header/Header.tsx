import { DayOfWeek, toChineseDay } from '@/models/shared'
import './Header.css'
import dayjs from 'dayjs'

export default function Header({
  date,
  weekOfSemester,
  weather,
  tempMin,
  tempMax,
  tip,
}: {
  date: dayjs.Dayjs
  weekOfSemester: string
  weather: string
  tempMin: number
  tempMax: number
  tip: string
}) {
  return (
    <div className="header">
      <div className="date">
        {date.format('YYYY年M月D日')}
        <br />
        {weekOfSemester} 星期{toChineseDay(date.day() as DayOfWeek)}
      </div>
      <div className="weather">
        {weather} {tempMin}/{tempMax}&#176;C
        <div className="tip">{tip}</div>
      </div>
    </div>
  )
}
