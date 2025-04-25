import { useState, useRef, useMemo } from 'react'
import { IonToolbar, IonTitle, IonPage } from '@ionic/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type SwiperCore from 'swiper'
import 'swiper/css'

import './Schedule.css'
import Dayitem from './components/Dayitem'
import Events from './components/Events'
import ScheduleOperations from './ScheduleOperations/ScheduleOperations'
import dayjs, { Dayjs } from 'dayjs'

export default function Schedule({ now }: { now: Dayjs }) {
  const swiperRef = useRef<SwiperCore>()
  const today = dayjs(now)
  // 点击选中的日期
  const [selectedDate, setSelectedDate] = useState(today)
  const [viewMode, setViewMode] = useState<number | 'month'>(1)
  // 左右滑动到的日期 即当前视图的第一天
  const [currentDate, setCurrentDate] = useState(() => today.startOf('isoWeek'))
  const views = useMemo(() => {
    function getViewDays(deltaView: number) {
      const deltaFrom =
        viewMode === 'month'
          ? currentDate.add(deltaView, 'month')
          : currentDate.add(deltaView * viewMode, 'week')
      const currentMonth = deltaFrom.month()
      if (viewMode === 'month') {
        const startOfFirstWeek = deltaFrom.startOf('month').startOf('isoWeek')
        const endOfLastWeek = startOfFirstWeek.endOf('month').endOf('isoWeek')
        return Array.from(
          { length: endOfLastWeek.diff(startOfFirstWeek, 'day') + 1 },
          (_, i) => {
            const date = startOfFirstWeek.add(i, 'day')
            return {
              date,
              isCurrentMonth: date.month() === currentMonth,
              eventCount: 3, //todo
            }
          },
        )
      } else {
        const startOfWeek = deltaFrom.startOf('isoWeek')
        return Array.from({ length: 7 * viewMode }, (_, i) => {
          const date = startOfWeek.add(i, 'day')
          return {
            date,
            isCurrentMonth: date.month() === deltaFrom.month(),
            eventCount: 3, //todo
          }
        })
      }
    }
    return [-1, 0, 1].map((delta) => getViewDays(delta))
  }, [currentDate, viewMode])
  const [lastView, currentView, nextView] = views

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
  const weeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

  return (
    <IonPage>
      <div className='schedule-page'>
        <div className='container'>
          <div className='title'>
            <IonToolbar>
              <IonTitle>
                {selectedDate.year()}年 {monthZh[selectedDate.month() + 1]}月
              </IonTitle>
              <ScheduleOperations
                gotoToday={() => setSelectedDate(today)}
                onClickSingle={() => setViewMode(1)}
                onClickDouble={() => setViewMode(2)}
                onClickMonth={() => setViewMode('month')}
              />
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
                // onSlideChangeTransitionEnd={handleSlideChangeTransitionEnd}
                speed={300} // 控制滑动速度
                touchRatio={1} // 触摸比例，控制滑动灵敏度
                resistance={true} // 边缘抵抗
                resistanceRatio={0.85} // 抵抗比例
                className='week-swiper'
              >
                {views.map((v, index) => (
                  <SwiperSlide key={index}>
                    <div className='week'>
                      {weeks.map((week, index) => (
                        <div key={index} className='col'>
                          <i>{week}</i>
                          {v.map(({ date, isCurrentMonth, eventCount }, i) => (
                            <div
                              key={i}
                              onClick={() => setSelectedDate(date)}
                              className='items'
                            >
                              <Dayitem
                                day={date.date()}
                                isToday={date.isSame(today, 'day')}
                                selected={date.isSame(selectedDate, 'day')}
                                eventCount={eventCount}
                                isCurrentMonth={isCurrentMonth}
                              />
                            </div>
                          ))}
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
    </IonPage>
  )
}
