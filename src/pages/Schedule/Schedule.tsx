import { useState, useRef, useMemo, useEffect } from 'react'
import { IonToolbar, IonTitle, IonPage } from '@ionic/react'
import { SwiperSlide, Swiper, SwiperClass } from 'swiper/react'
import Events from './components/Events'
import ScheduleOperations from './ScheduleOperations/ScheduleOperations'
import dayjs, { Dayjs } from 'dayjs'
import { Event as EventModel } from '@/models/Event'
import 'swiper/css'

import './Schedule.css'

type DayInfo = {
  date: number
  selected: boolean
  isToday: boolean
  eventCount: number
  isCurrentMonth: boolean
  onClick: () => void
}

const events: EventModel[] = [
  {
    uid: '1',
    dtstamp: dayjs(),
    dtstart: dayjs().hour(8).minute(0),
    dtend: dayjs().hour(9).minute(35),
    summary: '微积分(甲) Ⅱ',
    description: '随堂小测',
    location: '紫金港东2-103',
    'x-course-id': 'MATH101',
    categories: 'class',
    teacher: '苏德矿',
    term: '24年 春夏',
  },
  {
    uid: '2',
    dtstamp: dayjs(),
    dtstart: dayjs().hour(11).minute(30),
    dtend: dayjs().hour(14).minute(30),
    summary: '划水划水',
    description: '',
    location: '紫金港小剧场 B127',
    categories: 'custom',
  },
]

function Day({
  date,
  selected,
  isToday,
  eventCount,
  isCurrentMonth,
  onClick,
}: DayInfo) {
  return (
    <div className='day-container' onClick={onClick}>
      <div
        className={'day'
          .with(isToday, 'today')
          .with(selected, 'selected')
          .with(!isCurrentMonth, 'not-current-month')}
      >
        {date}
      </div>
      <div className='event-indicator'>
        {Array.from({ length: eventCount }).map((_, i) => (
          <div key={i} className='dot' />
        ))}
      </div>
    </div>
  )
}

export default function Schedule({ now }: { now: Dayjs }) {
  const swiperRef = useRef<SwiperClass>()
  const today = dayjs(now)
  // 点击选中的日期
  const [selectedDate, setSelectedDate] = useState(today)
  const selectedMonth = selectedDate.month()
  const [viewMode, setViewMode] = useState<number | 'month'>(1)
  // 左右滑动到的日期 即当前视图的第一天
  const [currentDate, setCurrentDate] = useState(() => today.startOf('isoWeek'))
  const views = useMemo(() => {
    function getViewDays(deltaView: number) {
      const currentMonth = selectedMonth
      const deltaCurrent =
        viewMode === 'month'
          ? currentDate.add(deltaView, 'month')
          : currentDate.add(deltaView * viewMode, 'week')
      if (viewMode === 'month') {
        const startOfMonth = deltaCurrent.startOf('month')
        const startOfFirstWeek = startOfMonth.startOf('isoWeek')
        const endOfLastWeek = deltaCurrent.endOf('month').endOf('isoWeek')
        return {
          newCurrentDate: startOfMonth,
          days: Array.from(
            { length: endOfLastWeek.diff(startOfFirstWeek, 'day') + 1 },
            (_, i) => {
              const date = startOfFirstWeek.add(i, 'day')
              return {
                date,
                isCurrentMonth: deltaView
                  ? date.month() === startOfMonth.month()
                  : date.month() === currentMonth,
                eventCount: 3, //todo
              }
            },
          ),
        }
      } else {
        const startOfWeek = deltaCurrent.startOf('isoWeek')
        return {
          newCurrentDate: startOfWeek,
          days: Array.from({ length: 7 * viewMode }, (_, i) => {
            const date = startOfWeek.add(i, 'day')
            return {
              date,
              eventCount: 3, //todo
              isCurrentMonth: deltaView
                ? date.month() === startOfWeek.month()
                : date.month() === currentMonth,
            }
          }),
        }
      }
    }
    return [-1, 0, 1].map((delta) => getViewDays(delta))
  }, [currentDate, viewMode, selectedMonth])
  function getViewWeekCount(view: (typeof views)[number]) {
    if (typeof viewMode === 'number') return viewMode
    return view.days.length / 7
  }
  const [nextView, setNextView] = useState(views[1])
  useEffect(() => setNextView(views[1]), [views])
  const viewWeekCount = getViewWeekCount(nextView)
  useEffect(() => {
    swiperRef.current?.slideTo(1, 0, false)
  }, [views])

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

  return (
    <IonPage>
      <div className='schedule-page'>
        <div className='container'>
          <IonToolbar className='toolbar'>
            <IonTitle>
              {selectedDate.year()}年{selectedDate.month() + 1}月
            </IonTitle>
            <ScheduleOperations
              gotoToday={() => setSelectedDate(today)}
              onClickSingle={() => setViewMode(1)}
              onClickDouble={() => setViewMode(2)}
              onClickMonth={() => setViewMode('month')}
            />
          </IonToolbar>

          <div className='calendar'>
            <div className='content'>
              <Swiper
                onSlideChangeTransitionStart={(sw) => {
                  if (sw.activeIndex !== 1) setNextView(views[sw.activeIndex])
                }}
                onSlideChangeTransitionEnd={(sw) => {
                  if (sw.activeIndex !== 1) {
                    setCurrentDate(views[sw.activeIndex].newCurrentDate)
                    setSelectedDate(views[sw.activeIndex].newCurrentDate)
                  }
                }}
                initialSlide={1}
                slidesPerView={1}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                speed={350} // 控制滑动速度
                touchRatio={1} // 触摸比例，控制滑动灵敏度
                resistance={true} // 边缘抵抗
                resistanceRatio={0.85} // 抵抗比例
                className='views'
                style={
                  {
                    '--week-count': viewWeekCount.toFixed(0),
                  } as React.CSSProperties
                }
              >
                {views.map(({ newCurrentDate, days }) => (
                  <SwiperSlide key={newCurrentDate.valueOf()} className='view'>
                    {weekdays.map((day) => (
                      <div key={day} className='weekday'>
                        {day}
                      </div>
                    ))}
                    {days.map(({ date, isCurrentMonth, eventCount }) => (
                      <Day
                        key={date.valueOf()}
                        onClick={() => setSelectedDate(date)}
                        date={date.date()}
                        isToday={date.isSame(today, 'day')}
                        selected={date.isSame(selectedDate, 'day')}
                        eventCount={eventCount}
                        isCurrentMonth={isCurrentMonth}
                      />
                    ))}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
        <Events events={events} />
      </div>
    </IonPage>
  )
}
