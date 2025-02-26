import React, { useState, useEffect } from 'react'
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react'
import './DateSelector.css'

interface DateInfo {
  date: string
  day: string
  weekday: string
}

interface Props {
  selectedDate: string
  onDateChange: (date: string) => void
}

const DateSelector: React.FC<Props> = ({ selectedDate, onDateChange }) => {
  const [dates, setDates] = useState<DateInfo[]>([])

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  useEffect(() => {
    const generateDates = () => {
      const datesArray: DateInfo[] = []
      const today = new Date()

      for (let i = -10; i <= 10; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)

        datesArray.push({
          date: date.toISOString().split('T')[0],
          day: date.getDate().toString(),
          weekday: weekdays[date.getDay()],
        })
      }

      setDates(datesArray)
    }

    generateDates()
  }, [])

  useEffect(() => {
    const selectedButton = document.querySelector(
      `ion-segment-button[value="${selectedDate}"]`,
    )
    if (selectedButton) {
      selectedButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [selectedDate])

  return (
    <div className="date-selector">
      <IonSegment
        value={selectedDate}
        onIonChange={(e) => onDateChange(e.detail.value as string)}
        scrollable={true}
      >
        {dates.map((dateInfo) => (
          <IonSegmentButton key={dateInfo.date} value={dateInfo.date}>
            <IonLabel>
              <div className="date-display">
                <span className="weekday">{dateInfo.weekday}</span>
                <span className="day">{dateInfo.day}</span>
              </div>
            </IonLabel>
          </IonSegmentButton>
        ))}
      </IonSegment>
    </div>
  )
}

export default DateSelector

