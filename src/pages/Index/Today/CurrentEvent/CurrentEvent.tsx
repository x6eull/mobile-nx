import spot from './spot.svg'
import time from './time.svg'
import remarks from './remarks.svg'
import './CurrentEvent.css'
import { TodayEvent } from '../Today'
import dayjs from 'dayjs'

export default function CurrentEvent({
  event,
  now,
}: {
  event: TodayEvent
  now: Date
}) {
  const leftDuration = dayjs.duration(dayjs(event.startAt).diff(dayjs(now)))
  const timeLeft = leftDuration.format('HH:mm:ss')
  const timeSpan =
    event.startAt.format('HH:mm') + ' - ' + event.endAt.format('HH:mm')
  return (
    <a className="current-event" href="/schedule">
      <div className="prefix">距上课</div>
      <div className="time">{timeLeft}</div>
      <div className="title">{event.name}</div>
      <div className="detail">
        <div className="item">
          <img src={spot} />
          <div className="text">{event.location}</div>
        </div>
        <div className="item">
          <img src={time} />
          <div className="text">{timeSpan}</div>
        </div>
        {event.description && (
          <div className="item">
            <img src={remarks} />
            <div className="text">{event.description}</div>
          </div>
        )}
      </div>
    </a>
  )
}
