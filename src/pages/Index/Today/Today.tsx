import icon from './iconToday.svg'
import './Today.css'
import CurrentEvent from './CurrentEvent/CurrentEvent'
import EventList from './EventList/EventList'
import Card, { IconImg } from '../Card/Card'
import { useTime } from '@/utils/hooks'
import dayjs from 'dayjs'

export interface TodayEvent {
  id: number
  name: string
  startAt: dayjs.Dayjs
  endAt: dayjs.Dayjs
  location: string
  description?: string
}

export default function Today({ events }: { events: TodayEvent[] }) {
  const now = useTime(500)
  //TODO 不显示已完成的事件
  return (
    <Card
      logo={<IconImg bgColor="var(--today-icon-background)" src={icon} />}
      title="今日日程"
      linkHref="/schedule"
      linkTitle="查看全部>"
      linkColor="var(--today-link-color)"
    >
      <div className="today">
        {events.length === 0 ? (
          <div>
            <div className="today-emoji">(⑅˃◡˂⑅)</div>
            <div className="today-none">今日无事</div>
          </div>
        ) : (
          <div className="today-body">
            <CurrentEvent now={now} event={events[0]} />
            <EventList events={events.slice(1)} />
          </div>
        )}
      </div>
    </Card>
  )
}
