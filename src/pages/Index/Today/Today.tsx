import icon from './iconToday.svg'
import './Today.css'
import CurrentEvent from './CurrentEvent/CurrentEvent'
import EventItem from './EventItem/EventItem'
import Card, { IconImg } from '../Card/Card'

/**展示的最核心Event详情 */
export interface EventDetail {
  id: number
  name: string
  startTime: string
  location: string
  duration: string
  description: string
}
/**events数组中传递的接口 */
export interface EventBrief {
  id: number
  name: string
  startTime?: string
  location: string
  duration: string
  description?: string
}

export default function Today({
  events,
}: {
  events: readonly [] | readonly [EventDetail, ...EventBrief[]]
}) {
  return (
    <Card
      logo={<IconImg bgColor="var(--today-icon-background)" src={icon} />}
      title="今日日程"
      linkHref="/schedule"
      linkTitle="查看全部>"
      linkColor="var(--today-link-color)"
    >
      <div className="container">
        {events.length === 0 ? (
          <div>
            <div className="today-emoji">(⑅˃◡˂⑅)</div>
            <div className="today-none">今日无事</div>
          </div>
        ) : (
          <div className="today-body">
            <CurrentEvent event={events[0] as EventDetail} />
            <div className={'list' + (events.length <= 1 ? ' none' : '')}>
              {events.slice(1).map((e) => (
                <EventItem key={e.id} event={e} />
              ))}
              {events.length <= 1 ? <>无更多日程</> : <></>}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
