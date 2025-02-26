import React from 'react'
import { IonGrid, IonRow, IonCol, IonCard, IonCardContent } from '@ionic/react'
import './EventGrid.css'

export interface Event {
  name: string
  allday: boolean
  location: string
  startat: EventTime[]
  endat: EventTime[]
  label: EventLabel[]
  description: string
}
export interface EventTime {
  date: string
  time: string
}
export interface EventLabel {
  text: labelText
  color: string
}
export enum labelText {
  Work = '工作',
  Life = '生活',
  Study = '学习',
  Sport = '运动',
  GoOut = '出行',
}
const eventData: Event[] = [
  {
    name: '工程伦理',
    allday: false,
    location: '玉泉曹光彪大楼西楼-201',
    startat: [{ date: '2025-02-21', time: '08:00' }],
    endat: [{ date: '2025-02-21', time: '10:30' }],
    label: [{ text: labelText.Work, color: 'blue' }],
    description: '工作练习在201号教室',
  },
  {
    name: '团队训练',
    allday: false,
    location: '体育馆',
    startat: [{ date: '2025-02-22', time: '09:00' }],
    endat: [{ date: '2025-02-22', time: '12:00' }],
    label: [{ text: labelText.Sport, color: 'orange' }],
    description: '体育团队训练',
  },
  {
    name: '工程伦理',
    allday: false,
    location: '玉泉曹光彪大楼西楼-201',
    startat: [{ date: '2025-02-23', time: '11:00' }],
    endat: [{ date: '2025-02-23', time: '16:00' }],
    label: [{ text: labelText.Work, color: 'green' }],
    description: '工作练习在201号教室',
  },
  {
    name: '工程伦理',
    allday: true,
    location: '玉泉曹光彪大楼西楼-201',
    startat: [{ date: '2025-02-20', time: '11:00' }],
    endat: [{ date: '2025-02-20', time: '14:00' }],
    label: [{ text: labelText.Study, color: 'red' }],
    description: '学习在201号教室',
  },
  {
    name: '工程伦理',
    allday: false,
    location: '玉泉曹光彪大楼西楼-201',
    startat: [{ date: '2025-02-19', time: '14:00' }],
    endat: [{ date: '2025-02-19', time: '18:00' }],
    label: [{ text: labelText.Study, color: 'red' }],
    description: '学习在201号教室',
  },
]

const timeSlots = [
  { start: '08:00', index: 1 },
  { start: '09:00', index: 2 },
  { start: '10:00', index: 3 },
  { start: '11:00', index: 4 },
  { start: '12:00', index: 5 },
  { start: '13:00', index: 6 },
  { start: '14:00', index: 7 },
  { start: '15:00', index: 8 },
  { start: '16:00', index: 9 },
  { start: '17:00', index: 10 },
  { start: '18:00', index: 11 },
  { start: '19:00', index: 12 },
  { start: '20:00', index: 13 },
  { start: '21:00', index: 14 },
  { start: '22:00', index: 15 },
  { start: '23:00', index: 16 },
]

const EventGrid: React.FC = () => {
  const timeSlotHeight = 5 //todo
  //todo根据日期确定春/秋几周显示不同的周视图
  const baseHour = 8 // 基准时间8:00

  // 处理事件数据
  const processedEvents = eventData.flatMap((event) =>
    event.startat.map((start, index) => {
      // 转换日期到星期几（1-7对应周一到周日）
      const date = new Date(start.date)
      const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay()

      // 时间转换方法
      const parseTime = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number)
        return { hours, minutes }
      }

      // 计算时间位置
      const startTime = parseTime(start.time)
      const endTime = parseTime(event.endat[index].time)

      // 转换为分钟数
      const startMinutes = startTime.hours * 60 + startTime.minutes
      const endMinutes = endTime.hours * 60 + endTime.minutes

      // 计算相对于基准时间的垂直位置
      const top = ((startMinutes - baseHour * 60) / 60) * timeSlotHeight
      const height = ((endMinutes - startMinutes) / 60) * timeSlotHeight

      return {
        ...event,
        dayOfWeek,
        top,
        height,
        startTime: start.time,
        endTime: event.endat[index].time,
        backgroundColor: event.label[0]?.color || '#586fc2', // 使用事件标签颜色
      }
    }),
  )

  // 处理全天事件
  const allDayEvents = eventData
    .filter((event) => event.allday)
    .flatMap((event) =>
      event.startat.map((start, index) => {
        const date = new Date(start.date)
        const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay()
        return {
          ...event,
          dayOfWeek,
        }
      }),
    )

  // 添加星期标题数组
  const weekDays = ['一', '二', '三', '四', '五', '六', '日']

  return (
    <IonGrid className="event-grid">
      {/* 修改时间行，添加数字行 */}
      <IonRow className="time-header-row">
        <IonCol size="1"></IonCol>
        {weekDays.map((day, index) => (
          <IonCol key={`time-header-${index}`} className="time-header-cell">
            <div className="time-header-content">
              <span className="weekday">{day}</span>
              <span className="date">{index + 1}</span>
            </div>
          </IonCol>
        ))}
      </IonRow>

      {/* 修改全天事件行的映射 */}
      <IonRow className="all-day-row">
        <IonCol size="1" className="all-day-label-column">
          <div className="all-day-label">
            <span>全</span>
            <span>天</span>
          </div>
        </IonCol>
        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
          <IonCol key={`allday-${day}`} className="day-column">
            {allDayEvents
              .filter((event) => event.dayOfWeek === day)
              .map((event, idx) => (
                <IonCard
                  key={`allday-event-${idx}`}
                  className="all-day-event-card"
                >
                  <IonCardContent>
                    <span>{event.name}</span>
                  </IonCardContent>
                </IonCard>
              ))}
          </IonCol>
        ))}
      </IonRow>

      <IonRow className="main-content-row">
        {/* 时间列 */}
        <IonCol size="1" className="time-column">
          {timeSlots.map((slot) => (
            <div
              key={slot.index}
              className="time-slot-label"
              style={{ height: `${timeSlotHeight}vh` }}
            >
              <span>{slot.start}</span>
            </div>
          ))}
        </IonCol>

        {/* 天列 */}
        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
          <IonCol key={day} className="day-column">
            {processedEvents
              .filter((event: { dayOfWeek: number }) => event.dayOfWeek === day)
              .map((event, idx) => (
                <IonCard
                  key={`${idx}-${event.startTime}`}
                  className="event-card"
                  style={{
                    position: 'absolute',
                    top: `${event.top}vh`,
                    height: `${event.height}vh`,
                    backgroundColor: event.backgroundColor,
                  }}
                >
                  <IonCardContent>
                    <div>
                      <h5>{event.name}</h5>
                      <p>{event.location}</p>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
          </IonCol>
        ))}
      </IonRow>
    </IonGrid>
  )
}

export default EventGrid
