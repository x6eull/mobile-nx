import spot from './spot.svg'
import time from './time.svg'
import './EventList.css'
import { TodayEvent } from '../Today'

export default function EventList({ events }: { events: TodayEvent[] }) {
  return (
    <div className={'event-list' + (events.length ? '' : ' none')}>
      {events.length ? (
        events.map((ev) => (
          <a key={ev.id} className="item" href="/schedule">
            <div className="info">
              <div className="title">{ev.name}</div>
              <div className="field">
                <img src={spot} />
                <div>{ev.location}</div>
              </div>
              <div className="field">
                <img src={time} />
                <div>
                  {ev.startAt.format('HH:mm') +
                    ' - ' +
                    ev.endAt.format('HH:mm')}
                </div>
              </div>
            </div>
          </a>
        ))
      ) : (
        <>无更多日程</>
      )}
    </div>
  )
}
