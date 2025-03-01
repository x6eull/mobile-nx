import React, { useState } from 'react'
import { IonButton, IonIcon } from '@ionic/react'
import { caretDown, caretUp } from 'ionicons/icons'
import './DateSelector.css'

interface DateSelectorProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

type DisplayMode = 'week' | 'twoWeeks' | 'month'

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('week')

  // 获取当前周的起始日期（周一）
  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay() || 7 // 将周日的0转换为7
    d.setDate(d.getDate() - (day - 1))
    return d
  }

  // 生成要显示的日期数组
  const generateDates = () => {
    const weekStart = getWeekStart(selectedDate)
    const dates: Date[] = []
    let daysToShow =
      displayMode === 'week'
        ? 7
        : displayMode === 'twoWeeks'
          ? 14
          : getWeekStart(selectedDate).getMonth() ===
              new Date(
                weekStart.getTime() + 27 * 24 * 60 * 60 * 1000,
              ).getMonth()
            ? 28
            : 35

    for (let i = 0; i < daysToShow; i++) {
      dates.push(new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000))
    }
    return dates
  }

  const toggleDisplayMode = () => {
    setDisplayMode((prev) =>
      prev === 'week' ? 'twoWeeks' : prev === 'twoWeeks' ? 'month' : 'week',
    )
  }

  return (
    <div className="date-selector">
      <div className="date-header">
        <IonButton
          fill="clear"
          className="toggle-button"
          onClick={toggleDisplayMode}
        >
          <IonIcon icon={displayMode === 'month' ? caretUp : caretDown} />
        </IonButton>
      </div>

      <div className="calendar-grid">
        <div className="weekday-header">
          {['一', '二', '三', '四', '五', '六', '日'].map((day) => (
            <div key={day} className="weekday-cell">
              {day}
            </div>
          ))}
        </div>

        <div className={`days-grid ${displayMode}`}>
          {generateDates().map((date, index) => (
            <div
              key={index}
              className={`day-cell ${
                date.toDateString() === selectedDate.toDateString()
                  ? 'selected'
                  : ''
              } ${date.getMonth() !== selectedDate.getMonth() ? 'other-month' : ''}`}
              onClick={() => onDateChange(date)}
            >
              {date.getDate()}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DateSelector
