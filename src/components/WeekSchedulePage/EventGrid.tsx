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
  GoOut = '出行'
}
const eventData: Event[] = [
  {
    name: '工程伦理',
    allday: false,
    location: '玉泉曹光彪大楼西楼-201',
    startat: [
      { date: '2025-02-21', time: '08:00' },
    ],
    endat: [
      { date: '2025-02-21', time: '10:30' },
    ],
    label: [{ text: labelText.Work, color: 'blue' }],
    description: '工作练习在201号教室',
  },
  {
    name: '团队训练',
    allday: false,
    location: '体育馆',
    startat: [
      { date: '2025-02-22', time: '09:00' },
    ],
    endat: [
      { date: '2025-02-22', time: '12:00' },
    ],
    label: [{ text: labelText.Sport, color: 'orange' }],
    description: '体育团队训练',
  },
  {
    name: '工程伦理',
    allday: false,
    location: '玉泉曹光彪大楼西楼-201',
    startat: [
      { date: '2025-02-23', time: '11:00' },
    ],
    endat: [
      { date: '2025-02-23', time: '12:00' },
    ],
    label: [{ text: labelText.Work, color: 'green' }],
    description: '工作练习在201号教室',
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
  const timeSlotHeight = 5//todo
  //todo根据日期确定春/秋几周显示不同的周视图
  return (
    <IonGrid className="event-grid">
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
            {eventData.map((event, idx) =>
              event.startat
                .map((startat, startatIdx) => (
                  <IonCard
                    key={`${idx}-${startatIdx}`}
                    className="event-card"
                    style={{
                      position: 'absolute',
                      top: `${(startat.time - 1) * timeSlotHeight}vh`,
                      height: `${event.endat[0].time - startat.time}vh`,
                      width: 'calc(100% - 2px)',
                      left: '1px',
                      right: '1px',
                    }}
                  >
                    <IonCardContent>
                      <h5>{event.name}</h5>
                      <p>{event.location}</p>
                    </IonCardContent>
                  </IonCard>
                )),
            )}
          </IonCol>
        ))}
      </IonRow>
    </IonGrid>
  )
}

export default EventGrid
