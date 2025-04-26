import spot from './spot.svg'
import time from './time.svg'
import remarks from './remarks.svg'
import './CurrentEvent.css'
import { TodayEvent } from '../Today'
import dayjs, { Dayjs } from 'dayjs'
import { IonRouterLink } from '@ionic/react'

export default function CurrentEvent({
  event,
  now,
}: {
  event: TodayEvent
  now: Dayjs
}) {
  const leftDuration = dayjs.duration(event.startAt.diff(now))
  const timeLeft = leftDuration.format('HH:mm:ss')
  const timeSpan =
    event.startAt.format('HH:mm') + ' - ' + event.endAt.format('HH:mm')
  return (
    <IonRouterLink
      routerDirection='root'
      className='current-event'
      routerLink='/schedule'
    >
      <div className='countdown'>
        {/**TODO */}
        <div className='prefix'>距上课</div>
        <div className='time'>{timeLeft}</div>
        <div className='title'>{event.name}</div>
      </div>
      <div className='detail'>
        <div className='item'>
          <img src={spot} />
          <div className='text'>{event.location}</div>
        </div>
        <div className='item'>
          <img src={time} />
          <div className='text'>{timeSpan}</div>
        </div>
        {event.description && (
          <div className='item'>
            <img src={remarks} />
            <div className='text'>{event.description}</div>
          </div>
        )}
      </div>
    </IonRouterLink>
  )
}
