import { DayOfWeek, toChineseDay } from '@/models/shared'
import './Header.css'

export default function Header({
  date,
  weekOfSemester,
  weather,
  tempMin,
  tempMax,
  tip,
}: {
  date: Date
  weekOfSemester: string
  weather: string
  tempMin: number
  tempMax: number
  tip: string
}) {
  return (
    <div className="header">
      <div className="calendar">
        {date.getFullYear()}年{date.getMonth() + 1}月{date.getDate() + 1}日
        <br />
        {weekOfSemester} 星期{toChineseDay(date.getDay() as DayOfWeek)}
      </div>
      <div className="weather">
        {weather} {tempMin}/{tempMax}&#176;C
        <div className="tip">{tip}</div>
      </div>
    </div>
  )
}
