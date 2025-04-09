import spot from './spot.svg'
import time from './time.svg'
import './EventItem.css'
import { EventBrief } from '../Schedule'

export default function EventItem({ event }: { event: EventBrief }) {
  return (
    <a className="event-item-wrap" href="/schedule">
      <div className="event-item-wrapper">
        <div className="event-item-head">
          <div>{event.name}</div>
        </div>
        <div className="event-item-body">
          <div>
            <img src={spot} alt="404" />
            <span>{event.location}</span>
          </div>
          <div>
            <img src={time} alt="404" />
            <span>{event.duration}</span>
          </div>
        </div>
      </div>
      <div className="event-item-right">{'>'}</div>
    </a>
  )
}
