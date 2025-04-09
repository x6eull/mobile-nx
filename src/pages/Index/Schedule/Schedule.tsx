import icon from './iconSchedule.svg'
import './Schedule.css'
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

export default function Schedule({
  events,
}: {
  events: readonly [] | readonly [EventDetail, ...EventBrief[]]
}) {
  return (
    <Card
      logo={<IconImg bgColor="var(--schedule-icon-background)" src={icon} />}
      title={'今日日程'}
      cardHref="/schedule"
      all="查看全部>"
    >
      {events.length === 0 ? (
        <div>
          <div className="schedule-emoji">(⑅˃◡˂⑅)</div>
          <div className="schedule-none">今日无事</div>
        </div>
      ) : (
        <div className="schedule-body">
          {/** TODO flag表示用户是否设置备注 */}
          <CurrentEvent event={events[0] as EventDetail} flag={true} />
          {events.length === 1 ? (
            <div className="schedule-none">
              <div>d====(￣▽￣*)b</div>
              <div className="schedule-none-font">Fighting!!!</div>
            </div>
          ) : (
            <div className="list">
              {events.slice(1).map((e) => (
                <EventItem key={e.id} event={e} />
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
