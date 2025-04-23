import React, { useState, useRef } from 'react'
import { IonToolbar, IonTitle, IonButtons, IonButton } from '@ionic/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type SwiperCore from 'swiper'
import 'swiper/css'

import { Dayview, Weekview, Todayview } from './icon/icon'
import './Calendar.css'
import Dayitem from './components/Dayitem'
import Events from './components/Events'

// TODO: 简化逻辑
interface DateItem {
  year: number
  month: number
  day: number
  active: number // 0: 无  1: 今天
  event: number
}

interface WeekData {
  baseDate: Date
  dates: DateItem[]
}

const Calendar: React.FC = () => {
  const now = new Date()
  const [current, setCurrent] = useState(now)

  const [chosenDate, setChosenDate] = useState(now)

  const swiperRef = useRef<SwiperCore>()

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
  const generateQueueData = (
    base: Date,
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

    if (mode === 'month') {
      const monthStart = new Date(
        base.getFullYear(),
        base.getMonth() + offset,
        1,
      )
      const monthEnd = new Date(
        base.getFullYear(),
        base.getMonth() + 1 + offset,
        0,
      )

      const nextbaseDate = new Date(
        base.getFullYear(),
        base.getMonth() + Math.floor(offset / 2),
        1,
      )

      const queueStart = getWeekStart(monthStart)

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
          day: date.getDate(),
          active: date.toDateString() === now.toDateString() ? 1 : 0,
          event: 1, // TODO: 获取逻辑
        })
      }

      return {
        baseDate: nextbaseDate,
        dates: monthDates,
      }
    }

    const totalDays = mode === 'week' ? 7 : 14

    const queueStart = getWeekStart(base)

    const nextbaseDate = new Date(queueStart)
    nextbaseDate.setDate(
      nextbaseDate.getDate() + Math.floor((offset / 2) * totalDays),
    )

    // 添加偏移
    queueStart.setDate(queueStart.getDate() + offset * totalDays)

    const queueDates: DateItem[] = []

    // 生成的数据
    for (let j = 0; j < totalDays; j++) {
      const date = new Date(queueStart)
      date.setDate(queueStart.getDate() + j)
      queueDates.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        active: date.toDateString() === now.toDateString() ? 1 : 0,
        event: 1, // TODO: 获取逻辑
      })
    }

    // 计算周日
    const weekEnd = new Date(queueStart)
    weekEnd.setDate(queueStart.getDate() + 6)

    return {
      baseDate: nextbaseDate,
      dates: queueDates,
    }
  }

  // 初始化周队列
  const initWeekQueue = (mode: 'week' | 'two-weeks' | 'month', base: Date) => {
    const currentWeek = generateQueueData(base, 0, mode)
    const prevWeek = generateQueueData(base, -1, mode)
    const nextWeek = generateQueueData(base, 1, mode)

    // setWeekQueue((weekQueue) => [prevWeek, currentWeek, nextWeek])
    return [prevWeek, currentWeek, nextWeek]
  }

  // 队列 -表示当前、上一个和下一个周
  const [weekQueue, setWeekQueue] = useState<WeekData[]>(
    initWeekQueue(displayMode, now),
  )

  // 更新队列 - 向前滑动
  const updateQueueBackward = () => {
    // currentWeekOffsetRef.current -= 1
    // const newOffset = displayMode === 'month'  ? currentMonthOffsetRef.current : currentWeekOffsetRef.current - 1
    const newPrev = generateQueueData(current, -2, displayMode)

    setWeekQueue((prev) => {
      const newQueue = [...prev]
      // 移除最后一个元素，将新的周插入到队列开头
      newQueue.pop()
      newQueue.unshift(newPrev)
      return newQueue
    })

    setCurrent(newPrev.baseDate)
  }

  // 更新队列 - 向后滑动
  const updateQueueForward = () => {
    // currentWeekOffsetRef.current += 1
    // const newOffset = currentWeekOffsetRef.current + 1
    const newNext = generateQueueData(current, 2, displayMode)

    setWeekQueue((prev) => {
      const newQueue = [...prev]
      // 移除第一个元素，将新的周追加到队列末尾
      newQueue.shift()
      newQueue.push(newNext)
      return newQueue
    })

    setCurrent(newNext.baseDate)
  }

  // 切换到今天
  const goToToday = () => {
    setCurrent(now)
    setWeekQueue(initWeekQueue(displayMode, now))
  }

  // 切换显示模式
  const changeDisplayMode = (mode: 'week' | 'two-weeks' | 'month') => {
    setDisplayMode(mode)
    setWeekQueue(initWeekQueue(mode, current))
  }

  // 处理滑动结束事件
  const handleSlideChangeTransitionEnd = (swiper: SwiperCore) => {
    if (swiper.activeIndex === 0) {
      // 向前滑动
      updateQueueBackward()
      if (swiperRef.current) {
        swiperRef.current.slideTo(1, 0)
      }
    } else if (swiper.activeIndex === 2) {
      // 向后滑动
      updateQueueForward()
      if (swiperRef.current) {
        swiperRef.current.slideTo(1, 0)
      }
    }
  }

  // 处理日期点击事件
  const handleDateClick = (date: DateItem) => {
    setChosenDate(new Date(date.year, date.month - 1, date.day))
  }

  return (
    <>
      <div className='calendar'>
        <div className='container'>
          <div className='title'>
            <IonToolbar>
              <IonTitle>
                {chosenDate.getFullYear()}年 {monthZh[chosenDate.getMonth()]}月
              </IonTitle>
              <IonButtons collapse={true} slot='end'>
                <Dayview />
                <Weekview />
                <Todayview onClick={goToToday} />
                <IonButton
                  className='dayview'
                  onClick={() => changeDisplayMode('week')}
                >
                  单
                </IonButton>
                <IonButton
                  className='todayview'
                  onClick={() => changeDisplayMode('two-weeks')}
                >
                  双
                </IonButton>
                <IonButton
                  className='weekview'
                  onClick={() => changeDisplayMode('month')}
                >
                  月
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </div>

          <div className='calendar'>
            <div className='content'>
              <div className='calendar-left'>
                <div className='left-line'></div>
              </div>
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
                className='week-swiper'
              >
                {weekQueue.map((queue, index) => (
                  <SwiperSlide key={`week-${index}`}>
                    <div className='week'>
                      {weeks.map((week, index) => (
                        <div key={index} className='col'>
                          <i>{week}</i>
                          {queue.dates.map(
                            (date, dateIndex) =>
                              dateIndex % 7 === index &&
                              weekQueue[1].dates.length > dateIndex && (
                                <div
                                  key={dateIndex}
                                  onClick={() => handleDateClick(date)}
                                  className='items'
                                >
                                  <Dayitem
                                    date={date}
                                    chosen={
                                      date.year === chosenDate.getFullYear() &&
                                      date.month ===
                                        chosenDate.getMonth() + 1 &&
                                      date.day === chosenDate.getDate()
                                    }
                                  />
                                </div>
                              ),
                          )}
                        </div>
                      ))}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className='bottom'>
              <div className='bottom-line'></div>
            </div>
          </div>
        </div>
        <Events events={[]} />
      </div>
    </>
  )
}

export default Calendar
