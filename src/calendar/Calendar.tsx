'use client'
import React, { useState, useEffect, useRef } from 'react'
import { IonToolbar, IonTitle, IonButtons, IonButton } from '@ionic/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import Viewday from './svg/Viewday.svg'
import Viewweek from './svg/Viewweek.svg'
import Viewtoday from './svg/Viewtoday.svg'
import './Calendar.css'
import { get } from 'http'

interface DateItem {
  year: number
  month: number
  date: number
  postLists: any[]
  holiday: object
  active: boolean
}

interface WeekData {
  id: number // 用于标识周的相对位置
  dates: DateItem[]
  startDate: Date
  endDate: Date
}

const ScrollCalendar: React.FC = () => {
  const now = new Date()
  const [currentDate, setCurrentDate] = useState(now)
  const [currentMonth, setCurrentMonth] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1),
  )

  const [chosenDate, setChosenDate] = useState(now)

  const swiperRef = useRef<any>(null)

  // 跟踪偏移量，用于记录用户滑动了多少周
  const currentWeekOffsetRef = useRef<number>(0)
  const currentMonthOffsetRef = useRef<number>(0)

  const [displayMode, setDisplayMode] = useState<
    'week' | 'two-weeks' | 'month'
  >('week')

  // 队列 -表示当前、上一个和下一个周
  const [weekQueue, setWeekQueue] = useState<WeekData[]>([])

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
  const weeks = ['一', '二', '三', '四', '五', '六', '日']

  // 生成日期数据
  const generateQueueData = (
    baseDate: Date,
    offset: number,
    mode: 'week' | 'two-weeks' | 'month',
  ): WeekData => {
    // 获取周一作为起始日
    const getWeekStart = (date: Date) => {
      const day = date.getDay() || 7 // 转换周日的0为7
      const diff = day - 1 // 计算到周一的差值
      const monday = new Date(date)
      monday.setDate(date.getDate() - diff)
      return monday
    }

    //获取周日作为结束日
    const getWeekEnd = (date: Date) => {
      const day = date.getDay() || 7 // 转换周日的0为7
      const diff = 7 - day // 计算到周日的差值
      const sunday = new Date(date)
      sunday.setDate(date.getDate() + diff)
      return sunday
    }

    if (displayMode === 'month') {
      const monthStart = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        1,
      )
      const monthEnd = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth() + 1,
        0,
      )

      // 计算偏移后的月份
      monthStart.setMonth(monthStart.getMonth() + offset)
      monthEnd.setMonth(monthEnd.getMonth() + offset)

      const queueStart = getWeekStart(monthStart)
      const queueEnd = getWeekEnd(monthEnd)

      const totalDays =
        (monthStart.getDay() === 0 ? 7 : monthStart.getDay()) -
        1 +
        monthEnd.getDate() +
        (7 - monthEnd.getDay() === 7 ? 0 : 7 - monthEnd.getDay())
      const monthDates: DateItem[] = []

      for (let i = 0; i < totalDays; i++) {
        const date = new Date(queueStart)
        date.setDate(queueStart.getDate() + i)

        monthDates.push({
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          date: date.getDate(),
          postLists: [],
          holiday: {},
          active: date.toDateString() === now.toDateString(),
        })
      }

      return {
        id: offset,
        dates: monthDates,
        startDate: queueStart,
        endDate: queueEnd,
      }
    }

    const queueStart = getWeekStart(baseDate)
    // 添加偏移
    queueStart.setDate(
      queueStart.getDate() + offset * (mode === 'week' ? 7 : 14),
    )

    const queueDates: DateItem[] = []

    const totalDays = mode === 'week' ? 7 : 14

    // 生成的数据
    for (let j = 0; j < totalDays; j++) {
      const date = new Date(queueStart)
      date.setDate(queueStart.getDate() + j)

      queueDates.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
        postLists: [],
        holiday: {},
        active: date.toDateString() === now.toDateString(),
      })
    }

    // 计算周日
    const weekEnd = new Date(queueStart)
    weekEnd.setDate(queueStart.getDate() + 6)

    return {
      id: offset,
      dates: queueDates,
      startDate: new Date(queueStart),
      endDate: weekEnd,
    }
  }

  // 初始化周队列
  const initWeekQueue = () => {
    const currentWeek =
      displayMode === 'month'
        ? generateQueueData(currentMonth, 0, displayMode)
        : generateQueueData(currentDate, 0, displayMode)
    const prevWeek =
      displayMode === 'month'
        ? generateQueueData(currentMonth, -1, displayMode)
        : generateQueueData(currentDate, -1, displayMode)
    const nextWeek =
      displayMode === 'month'
        ? generateQueueData(currentMonth, 1, displayMode)
        : generateQueueData(currentDate, 1, displayMode)

    setWeekQueue([prevWeek, currentWeek, nextWeek])
    currentWeekOffsetRef.current = 0
  }

  // 更新队列 - 向前滑动
  const updateQueueBackward = () => {
    currentWeekOffsetRef.current -= 1
    const newOffset =
      displayMode === 'month'
        ? currentMonthOffsetRef.current
        : currentWeekOffsetRef.current - 1
    const newPrev = generateQueueData(currentDate, -1, displayMode)

    setWeekQueue((prev) => {
      const newQueue = [...prev]
      // 移除最后一个元素，将新的周插入到队列开头
      newQueue.pop()
      newQueue.unshift(newPrev)
      return newQueue
    })

    if (displayMode === 'month') {
      // Update current month when in month mode
      currentMonthOffsetRef.current -= 1
      const newMonth = new Date(currentMonth)
      newMonth.setMonth(newMonth.getMonth() - 1)
      setCurrentMonth(newMonth)
    } else {
      setCurrentDate(newPrev.startDate)
    }

    // swiperRef.current.slideTo(1, 0)
  }

  // 更新队列 - 向后滑动
  const updateQueueForward = () => {
    currentWeekOffsetRef.current += 1
    const newOffset = currentWeekOffsetRef.current + 1
    const newNext = generateQueueData(currentDate, 1, displayMode)

    setWeekQueue((prev) => {
      const newQueue = [...prev]
      // 移除第一个元素，将新的周追加到队列末尾
      newQueue.shift()
      newQueue.push(newNext)
      return newQueue
    })

    setCurrentDate(newNext.startDate)

    // swiperRef.current.slideTo(1, 0)
  }

  // 切换到今天
  const goToToday = () => {
    setCurrentDate(now)
    initWeekQueue()
  }

  // 切换显示模式
  const changeDisplayMode = (mode: 'week' | 'two-weeks' | 'month') => {
    setDisplayMode(mode)
  }

  // 初始化
  useEffect(() => {
    initWeekQueue()
  })

  // 处理滑动结束事件
  const handleSlideChangeTransitionEnd = (swiper: any) => {
    if (swiper.activeIndex === 0) {
      // 向前滑动
      updateQueueBackward()
      swiperRef.current.slideTo(1, 0)
    } else if (swiper.activeIndex === 2) {
      // 向后滑动
      updateQueueForward()
      swiperRef.current.slideTo(1, 0)
    }
  }

  // 渲染视图
  const renderView = () => {
    return (
      <Swiper
        initialSlide={1}
        slidesPerView={1}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        onSlideChangeTransitionEnd={handleSlideChangeTransitionEnd}
        speed={300} // 控制滑动速度
        touchRatio={1} // 触摸比例，控制滑动灵敏度
        resistance={true} // 边缘抵抗
        resistanceRatio={0.85} // 抵抗比例
        className="week-swiper"
      >
        {weekQueue.map((week, index) => (
          <SwiperSlide key={`week-${week.id}-${index}`}>
            <div className="dates wrap">
              {week.dates.map((date, dateIndex) => (
                <div
                  key={dateIndex}
                  className={`col ${date.active ? 'active-day' : ''}`}
                >
                  <div className="inner">
                    <div
                      className={`num din ${date.month === chosenDate.getMonth() + 1 ? 'cur' : ''}`}
                    >
                      {date.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    )
  }

  return (
    <div className="scroll-calendar">
      <div className="container">
        <div className="title">
          <IonToolbar>
            <IonTitle>
              {chosenDate.getFullYear()}年 {monthZh[chosenDate.getMonth()]}月
            </IonTitle>
            <IonButtons collapse={true} slot="end">
              <IonButton className="dayview">
                <img src={Viewday} alt="Day view" />
              </IonButton>
              <IonButton className="weekview">
                <img src={Viewweek} alt="Week view" />
              </IonButton>
              <IonButton className="todayview" onClick={goToToday}>
                <img src={Viewtoday} alt="Today view" />
              </IonButton>
              <IonButton
                className="dayview"
                onClick={() => changeDisplayMode('week')}
              >
                单
              </IonButton>
              <IonButton
                className="todayview"
                onClick={() => changeDisplayMode('two-weeks')}
              >
                双
              </IonButton>
              <IonButton
                className="weekview"
                onClick={() => changeDisplayMode('month')}
              >
                月
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

          {renderView()}
        </div>
      </div>
    </div>
  )
}

export default ScrollCalendar

