import React, { useState } from 'react'
import { IonContent, IonPage } from '@ionic/react'
import './DaySchedule.css'
import ScheduleHeader from '../components/DaySchedulePage/ScheduleHeader'
import EventItems from '@/components/DaySchedulePage/EventItems'
import DateSelector from '@/components/DaySchedulePage/DateSelector'
const DaySchedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  )

  return (
    <IonPage className="day-schedule-page">
      <ScheduleHeader />
      <IonContent>
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <EventItems selectedDate={selectedDate} />
      </IonContent>
    </IonPage>
  )
}

export default DaySchedule
