import React, { useState, useEffect } from 'react'
import {
  IonCard,
  IonCardContent,
} from '@ionic/react'
import './EventItems.css'
import { Event } from '../WeekSchedulePage/EventGrid'
import { labelText } from '../WeekSchedulePage/EventGrid'

const eventData: Event[] = [
  {
    name: '工程伦理',
    allday: false,
    location: '玉泉曹光彪大楼西楼-201',
    startat: [{ date: '2025-02-17', time: '08:00' }],
    endat: [{ date: '2025-02-17', time: '10:30' }],
    label: [{ text: labelText.Work, color: 'blue' }],
    description: '工作练习在201号教室',
  },
  {
    name: '团队训练',
    allday: false,
    location: '体育馆',
    startat: [{ date: '2025-02-17', time: '09:00' }],
    endat: [{ date: '2025-02-17', time: '12:00' }],
    label: [{ text: labelText.Sport, color: 'orange' }],
    description: '体育团队训练',
  },
  {
    name: '工程伦理',
    allday: false,
    location: '玉泉曹光彪大楼西楼-201',
    startat: [{ date: '2025-02-17', time: '11:00' }],
    endat: [{ date: '2025-02-17', time: '16:00' }],
    label: [{ text: labelText.Work, color: 'green' }],
    description: '工作练习在201号教室',
  },
  {
    name: '工程伦理',
    allday: false,
    location: '玉泉曹光彪大楼西楼-201',
    startat: [{ date: '2025-02-17', time: '11:00' }],
    endat: [{ date: '2025-02-17', time: '14:00' }],
    label: [{ text: labelText.Study, color: 'red' }],
    description: '学习在201号教室',
  },
  {
    name: '工程伦理',
    allday: false,
    location: '玉泉曹光彪大楼西楼-201',
    startat: [{ date: '2025-02-17', time: '14:00' }],
    endat: [{ date: '2025-02-17', time: '18:00' }],
    label: [{ text: labelText.Study, color: 'red' }],
    description: '学习在201号教室',
  },
]
const EventItems: React.FC<{ selectedDate: string }> = ({ selectedDate }) => {
  const filteredEvents = eventData.filter((event) =>
    event.startat.some((start) => start.date === selectedDate),
  )

  return (
    <>
      {filteredEvents.map((event, idx) => (
        <IonCard key={idx}>
          <IonCardContent className="event-card-content">
            <div className="event-info">
              <h5>{event.name}</h5>
              <p>{event.location}</p>
              <p>{event.description}</p>
            </div>
            <div className="event-time">
              {event.startat[0].time} - {event.endat[0].time}
            </div>
          </IonCardContent>
        </IonCard>
      ))}
    </>
  )
}

export default EventItems
