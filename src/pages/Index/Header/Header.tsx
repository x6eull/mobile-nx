import { toChineseDay } from '@/models/shared'
import './Header.css'
import { Dayjs } from 'dayjs'

export default function Header({
  date,
  weekOfSemester,
  weather,
  tempMin,
  tempMax,
  tip,
}: {
  date: Dayjs
  weekOfSemester: string
  weather: string
  tempMin: number
  tempMax: number
  tip: string
}) {
  return (
    <div className='header'>
      <div className='date'>
        {date.format('YYYY年M月D日')}
        <br />
        {weekOfSemester} 星期{toChineseDay(date.day())}
      </div>
      <div className='weather'>
        {weather} {tempMin}/{tempMax}&#176;C
        <br />
        {tip}
      </div>
    </div>
  )
}
