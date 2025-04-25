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
  const [viewDate, setViewDate] = useState(today)
  const views = useMemo(() => {}, [])

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
                                    day={date.day}
                                    isToday={}
                                    selected={}
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
    </IonPage>
  )
}
