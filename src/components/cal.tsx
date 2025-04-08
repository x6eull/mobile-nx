import React, { useState, useEffect, useRef } from 'react'

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
} from '@ionic/react'

import Viewday from '../svg/Viewday.svg'
import Viewweek from '../svg/Viewweek.svg'
import Viewtoday from '../svg/Viewtoday.svg'
import './cal.css'

interface DateItem {
  year: number
  month: number
  date: number
  postLists: any[]
  holiday: object
  active: boolean
}

const ScrollCalendar: React.FC = () => {
  const now = new Date()
  const calContentRef = useRef<HTMLDivElement>(null)

  const [currentDate, setCurrentDate] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
    date: now.getDate(),
  })
  const [datesList, setDatesList] = useState<DateItem[]>([])
  const [showYear, setShowYear] = useState(now.getFullYear())
  const [showMonth, setShowMonth] = useState(now.getMonth())

  // Constants
  const monthZh = [
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九',
    '十',
    '十一',
    '十二',
  ]
  const weeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // 日历初始化
  useEffect(() => {
    setCurrentDate({
      year: now.getFullYear(),
      month: now.getMonth(),
      date: now.getDate(),
    })
    setShowMonth(now.getMonth())
    getCoolDatesList(now.getFullYear(), now.getMonth(), false)
  }, [])

  // 滚动监听
  useEffect(() => {
    const calContent = calContentRef.current
    if (calContent) {
      calContent.addEventListener('scroll', handleScroll)
      return () => calContent.removeEventListener('scroll', handleScroll)
    }
  }, [currentDate])

  const getCoolDatesList = (year: number, month: number, next: boolean) => {
    setCurrentDate((prev) => ({ ...prev, year, month }))

    const monthFirstDate = new Date(year, month, 1)
    const monthLastDate = new Date(year, month + 1, 0)
    const currentMonthDates = new Date(year, month + 1, 0).getDate()

    // First week dates
    const firstDateDay =
      monthFirstDate.getDay() === 0 ? 7 : monthFirstDate.getDay()
    let initFirstWeekDate = new Date(year, month, 2 - firstDateDay)

    // Last week dates
    const lastWeekOverDates =
      7 - monthLastDate.getDay() === 7 ? 0 : 7 - monthLastDate.getDay()

    // Calculate total dates
    let totalDates
    if (next) {
      let newNextFirst
      if (monthFirstDate.getDay() === 1) {
        newNextFirst = 0
      } else {
        newNextFirst =
          monthFirstDate.getDay() === 0 ? 7 : monthFirstDate.getDay()
        newNextFirst = 7 - newNextFirst + 1
        initFirstWeekDate = new Date(year, month, newNextFirst + 1)
      }
      totalDates = currentMonthDates - newNextFirst + lastWeekOverDates
    } else {
      totalDates = firstDateDay - 1 + currentMonthDates + lastWeekOverDates
    }

    const newDates: DateItem[] = []
    for (let i = 0; i < totalDates; i++) {
      const dateObj = new Date(
        initFirstWeekDate.getFullYear(),
        initFirstWeekDate.getMonth(),
        initFirstWeekDate.getDate() + i,
      )
      newDates.push({
        year: dateObj.getFullYear(),
        month: dateObj.getMonth(),
        date: dateObj.getDate(),
        postLists: [],
        holiday: {},
        active: false,
      })
    }

    setDatesList((prev) => [...prev, ...newDates])
  }

  const handleScroll = (event: Event) => {
    const target = event.target as HTMLDivElement
    const height = target.clientHeight
    const scrollValue = target.scrollTop

    if (scrollValue + height > height) {
      getCoolDatesList(currentDate.year, currentDate.month + 1, true)
    }

    // Update month and year when scrolling
    document.querySelectorAll('.thismonth').forEach((el) => {
      const element = el as HTMLElement
      if (scrollValue > element.offsetTop - 100) {
        setShowMonth(parseInt(element.dataset.month || '0'))
        setShowYear(parseInt(element.dataset.year || '2022'))
      }
    })
  }

  return (
    <div className="scroll-calendar">
      <div className="container">
        <div className="title">
          <IonToolbar>
            <IonTitle>
              {showYear}年 {monthZh[showMonth]}月 春8周
            </IonTitle>
            <IonButtons collapse={true} slot="end">
              <IonButton className="dayview">
                <img src={Viewday} alt="Day view" />
              </IonButton>
              <IonButton className="weekview">
                <img src={Viewweek} alt="Week view" />
              </IonButton>
              <IonButton className="todayview">
                <img src={Viewtoday} alt="Today view" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </div>

        <div className="calendar">
          <div className="week">
            <div className="wrap">
              {weeks.map((week, index) => (
                <div key={index} className="col">
                  <i>{week}</i>
                </div>
              ))}
            </div>
          </div>
          <div className="dates wrap" ref={calContentRef}>
            {datesList.map((date, index) => (
              <div
                key={index}
                className={`col ${date.date === 1 ? 'thismonth' : ''}`}
                data-month={date.month}
                data-year={date.year}
              >
                <div className="inner">
                  <div
                    className={`num din ${date.month === showMonth ? 'cur' : ''}`}
                  >
                    {date.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScrollCalendar

