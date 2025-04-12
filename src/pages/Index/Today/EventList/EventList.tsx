import IconSpot from './spot.svg?react'
import IconTime from './time.svg?react'
import './EventList.css'
import { TodayEvent } from '../Today'

export default function EventList({ events }: { events: TodayEvent[] }) {
  return (
    <div className='event-list'>
      {events.length ? (
        events.map((ev) => (
          <a key={ev.id} className='item' href='/schedule'>
            <div className='info'>
              <div className='title'>{ev.name}</div>
              <div className='detail'>
                <div className='field'>
                  <IconSpot />
                  <div>{ev.location}</div>
                </div>
                <div className='field'>
                  <IconTime />
                  <div>
                    {ev.startAt.format('HH:mm') +
                      ' - ' +
                      ev.endAt.format('HH:mm')}
                  </div>
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
