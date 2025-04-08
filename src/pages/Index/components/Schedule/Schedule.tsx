import logo from '@/pages/Index/assets/svg/Schedule/schedule.svg'
import './Schedule.css'
import CurrentEvent from './CurrentEvent/CurrentEvent'
import EventItem from './EventItem/EventItem'
import Card, { IconImg } from '@/pages/Index/components/Card/Card'

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

export default function Schedule() {
  const events: EventBrief[] = [
    {
      id: 1,
      name: '微积分甲I',
      startTime: '01:57:35',
      location: '紫金港东2-201(录播)',
      duration: '8:00-10:00',
      description: '小测',
    },
    {
      id: 2,
      name: '工程伦理',
      location: '玉泉曹光彪大楼西楼-201',
      duration: '18:50-20:30',
    },
    {
      id: 3,
      name: '工程伦理',
      location: '玉泉曹光彪大楼西楼-201',
      duration: '18:50-20:30',
    },
    {
      id: 4,
      name: '工程伦理',
      location: '玉泉曹光彪大楼西楼-201',
      duration: '18:50-20:30',
    },
    {
      id: 5,
      name: '工程伦理',
      location: '玉泉曹光彪大楼西楼-201',
      duration: '18:50-20:30',
    },
  ]

  return (
    <Card
      logo={<IconImg bgColor="var(--schedule-icon-background)" src={logo} />}
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
