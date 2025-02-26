import React, { useState,useEffect } from 'react'
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle
} from '@ionic/react'
import './EventItems.css'
import { Event } from '../WeekSchedulePage/EventGrid'
import { labelText } from '../WeekSchedulePage/EventGrid'

const eventData: Event[] = [
  {
    name: '工程伦理',
    allday: false,
    location: '玉泉曹光彪大楼西楼-201',
    startat: [{ date: '2025-02-16', time: '08:00' }],
    endat: [{ date: '2025-02-16', time: '10:30' }],
    label: [{ text: labelText.Work, color: 'blue' }],
    description: '工作练习在201号教室',
  },
  {
    name: '团队训练',
    allday: false,
    location: '体育馆',
    startat: [{ date: '2025-02-16', time: '09:00' }],
    endat: [{ date: '2025-02-16', time: '12:00' }],
    label: [{ text: labelText.Sport, color: 'orange' }],
    description: '体育团队训练',
  },
  {
    name: '工程伦理',
    allday: false,
    location: '玉泉曹光彪大楼西楼-201',
    startat: [{ date: '2025-02-16', time: '11:00' }],
    endat: [{ date: '2025-02-16', time: '16:00' }],
    label: [{ text: labelText.Work, color: 'green' }],
    description: '工作练习在201号教室',
  },
  {
    name: '工程伦理',
    allday: false,
    location: '玉泉曹光彪大楼西楼-201',
    startat: [{ date: '2025-02-16', time: '11:00' }],
    endat: [{ date: '2025-02-16', time: '14:00' }],
    label: [{ text: labelText.Study, color: 'red' }],
    description: '学习在201号教室',
  },
  {
    name: '工程伦理',
    allday: false,
    location: '玉泉曹光彪大楼西楼-201',
    startat: [{ date: '2025-02-16', time: '14:00' }],
    endat: [{ date: '2025-02-16', time: '18:00' }],
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
          <IonCardHeader>
            <IonCardTitle>{event.name}</IonCardTitle>
            <IonCardSubtitle>{event.location}</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <p>{event.description}</p>
            <p>
              {event.startat[0].time} - {event.endat[0].time}
            </p>
          </IonCardContent>
        </IonCard>
      ))}
    </>
  )
}

export default EventItems
