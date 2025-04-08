'use client'
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
  const [displayMode, setDisplayMode] = useState<
    'week' | 'two-weeks' | 'month'
  >('week')

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

  // 生成日期数据
  const generateDates = (
    year: number,
    month: number,
    mode: typeof displayMode,
  ) => {
    const monthFirstDate = new Date(year, month, 1)
    const monthLastDate = new Date(year, month + 1, 0)
    const firstDateDay =
      monthFirstDate.getDay() === 0 ? 7 : monthFirstDate.getDay()

    let startDate: Date
    let totalDates: number

    if (mode === 'week') {
      // 仅显示当前周
      startDate = new Date(year, month, currentDate.date - now.getDay() + 1)
      totalDates = 7
    } else if (mode === 'two-weeks') {
      // 显示两周
      startDate = new Date(year, month, currentDate.date - now.getDay() + 1)
      totalDates = 14
    } else {
      // 显示完整月份
      startDate = new Date(year, month, 2 - firstDateDay)
      const lastWeekOverDates =
        7 - monthLastDate.getDay() === 7 ? 0 : 7 - monthLastDate.getDay()
      totalDates =
        firstDateDay - 1 + monthLastDate.getDate() + lastWeekOverDates
    }

    const newDates: DateItem[] = []
    for (let i = 0; i < totalDates; i++) {
      const dateObj = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + i,
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

    setDatesList(newDates)
  }

  // 处理滚动事件
  const handleScroll = (e: Event) => {
    const target = e.target as HTMLDivElement
    const { scrollTop, scrollHeight, clientHeight } = target
    const scrollPosition = scrollHeight - scrollTop - clientHeight

    // 向下滚动加载更多
    if (scrollTop < 0 && displayMode !== 'month') {
      if (displayMode === 'week') {
        setDisplayMode('two-weeks')
      } else {
        setDisplayMode('month')
      }
    }
    // 向上滚动减少显示
    else if (scrollPosition < 0 && displayMode !== 'week') {
      if (displayMode === 'month') {
        setDisplayMode('two-weeks')
      } else {
        setDisplayMode('week')
      }
    }
  }

  // 初始化
  useEffect(() => {
    generateDates(currentDate.year, currentDate.month, displayMode)
  }, [displayMode])

  useEffect(() => {
    const calContent = calContentRef.current
    if (calContent) {
      calContent.addEventListener('scroll', handleScroll)
      return () => calContent.removeEventListener('scroll', handleScroll)
    }
  }, [currentDate])

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

