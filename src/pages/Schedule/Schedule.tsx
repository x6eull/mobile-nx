import { useState, useRef, useMemo, useLayoutEffect } from 'react'
import { IonToolbar, IonTitle, IonPage, IonContent } from '@ionic/react'
import { SwiperSlide, Swiper, SwiperClass } from 'swiper/react'
import EventList from './EventList/EventList'
import ScheduleOperations from './ScheduleOperations/ScheduleOperations'
import dayjs from 'dayjs'
import { Event as EventModel } from '@/models/Event'
import 'swiper/css'
import { useTime } from '@/utils/hooks'
import { useGesture } from '@use-gesture/react'

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
    description: '签到',
    location: '紫金港东2-103',
    'x-course-id': 'MATH101',
    categories: 'class',
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
  {
    uid: '3',
    dtstamp: dayjs(),
    dtstart: dayjs().hour(11).minute(30),
    dtend: dayjs().hour(14).minute(30),
    summary: '微积分(甲) Ⅱ',
    description: '随堂小测'.padEnd(1000, '1 '),
    location: '紫金港东2-103',
    'x-course-id': 'MATH101'.padEnd(1000, '1 '),
    categories: 'exam',
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

export default function Schedule() {
  const swiperRef = useRef<SwiperClass>()
  const today = useTime(1000 * 5)
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
  //即将滑动到的日期（滑动动画开始时即切换，用于高度动画）
  const [nextView, setNextView] = useState(views[1])
  useLayoutEffect(() => setNextView(views[1]), [views])
  const viewWeekCount =
    typeof viewMode === 'number' ? viewMode : nextView.days.length / 7
  useLayoutEffect(() => void swiperRef.current?.slideTo(1, 0, false), [views])

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

  const bind = useGesture({
    onDrag: ({ direction: [, yDir], distance: [, yDist], cancel }) => {
      if (yDist > 50) {
        cancel?.()
        if (yDir === 1 && viewMode !== 'month') {
          // 向下拖动，放大视图
          setViewMode(viewMode === 1 ? 2 : 'month')
        } else if (yDir === -1 && viewMode !== 1) {
          // 向上拖动，缩小视图
          setViewMode(viewMode === 'month' ? 2 : 1)
        }
      }
    },
  })

  return (
    <IonPage className='schedule-page'>
      <IonToolbar className='toolbar'>
        <IonTitle>
          {selectedDate.year()}年{selectedDate.month() + 1}月
        </IonTitle>
        <ScheduleOperations
          gotoToday={() => setSelectedDate(today)}
          isToday={selectedDate.isSame(today, 'day')}
          onClickSingle={() => setViewMode(1)}
          onClickDouble={() => setViewMode(2)}
          onClickMonth={() => setViewMode('month')}
        />
      </IonToolbar>
      <IonContent {...bind()}>
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
                  '--view-mode': viewMode === 'month' ? 3 : viewMode,
                  touchAction: 'none', // 禁用默认触摸行为
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
        <EventList events={events} />
      </IonContent>
    </IonPage>
  )
}
