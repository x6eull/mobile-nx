import icon from './iconToday.svg'
import './Today.css'
import CurrentEvent from './CurrentEvent/CurrentEvent'
import EventList from './EventList/EventList'
import Card, { IconImg } from '../Card/Card'
import { useTime } from '@/utils/hooks'
import { Dayjs } from 'dayjs'

export interface TodayEvent {
  id: number
  name: string
  startAt: Dayjs
  endAt: Dayjs
  location: string
  description?: string
}

export default function Today({ events }: { events: TodayEvent[] }) {
  const now = useTime(500)
  //TODO 不显示已完成的事件
  return (
    <Card
      icon={<IconImg bgColor='var(--nx-color-light)' src={icon} />}
      title='今日日程'
      linkHref='/schedule'
      linkTitle='查看全部 >'
    >
      <div className='today'>
        {events.length === 0 ? (
          <div>
            <div className='today-emoji'>(⑅˃◡˂⑅)</div>
            <div className='today-none'>今日无事</div>
          </div>
        ) : (
          <div className='today-body'>
            <CurrentEvent now={now} event={events[0]} />
            <EventList events={events.slice(1)} />
          </div>
        )}
      </div>
    </Card>
  )
}
