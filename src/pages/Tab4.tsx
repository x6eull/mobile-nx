import React, { useState, useEffect, useRef } from 'react'
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonButtons,
} from '@ionic/react'
import { reorderThree, reorderThreeOutline } from 'ionicons/icons'
import { Swiper, SwiperSlide } from 'swiper/react'
import './Tab4.css'
import 'swiper/css'
import { Interface } from 'readline'

interface DateDisplayProps {
  initialDate: Date
  onDayClick: (date: Date) => void
  selectedDay: Date | null
}

const Day: React.FC<DateDisplayProps> = ({
  initialDate,
  onDayClick,
  selectedDay,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate)

  // 格式化日期为字符串
  const formatDate = (date: Date): string => {
    const day = date.getDate().toString()
    return `${day}`
  }

  // 获取星期数
  const getDayOfWeek = (date: Date): string => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return daysOfWeek[date.getDay()]
  }

  const handleClick = () => {
    onDayClick(selectedDate)
  }

  // 判断是否为选定的日期
  const isSelected = (date: Date, selectedDay: Date | null): boolean => {
    return selectedDay
      ? date.toDateString() === selectedDay.toDateString()
      : false
  }

  return (
    <div
      id={`div-day`}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <p id="week">{getDayOfWeek(selectedDate)}</p> {/* 显示星期数 */}
      <div style={{ width: 'auto' }}>
        <button
          id={`${
            selectedDate.getDay() === 0 || selectedDate.getDay() === 6
              ? 'weekend'
              : 'workday'
          }${isSelected(selectedDate, selectedDay) ? 'selected' : ''}`}
          onClick={handleClick}
        >
          <span>{formatDate(selectedDate)}</span>
        </button>
      </div>
    </div>
  )
}
interface WeekProps {
  index: number
  onDayClick: (date: Date) => void
  selectedDay: Date | null
}
const Week: React.FC<WeekProps> = ({ index, onDayClick, selectedDay }) => {
  // 获取当前日期
  let Data_now = new Date()
  // 获取当前周的周一
  let monday = new Date()
  monday.setDate(
    Data_now.getDate() - Data_now.getDay() + (monday.getDay() === 0 ? -6 : 1),
  )

  let first = new Date(monday)
  first.setDate(monday.getDate() + index * 7)
  const week = []
  for (let i = 0; i < 7; i++) {
    let date = new Date(first)
    date.setDate(first.getDate() + i)
    week.push(date)
  }
  return (
    <div className="week">
      {week.map((date) => (
        <Day
          key={date.toISOString()}
          initialDate={date}
          onDayClick={onDayClick}
          selectedDay={selectedDay}
        />
      ))}
    </div>
  )
}

interface ScheduleProps {
  title: string
  data: Date
  starttime: string
  endtime: string
  description: string
  location: string
}
const Schedule: React.FC<ScheduleProps> = ({
  title,
  data,
  starttime,
  endtime,
  description,
  location,
}) => {
  // 根据title的值随机生成一个颜色，title不变，颜色不变
  function stringToColor(str: string): string {
    // 创建一个哈希值（可以使用更复杂的哈希算法，但这里我们使用简单的求和方法）
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    // 将哈希值转换为颜色（RGB）
    const r = (hash >> 16) & 0xff
    const g = (hash >> 8) & 0xff
    const b = hash & 0xff

    // 返回 # 颜色值
    return `${r.toString(16)}${g.toString(16)}${b.toString(16)}`
  }

  return (
    <div
      style={{
        display: 'flex',
        margin: '10px 20px 10px 20px',
        height: '100px',
      }}
    >
      <div
        style={{
          backgroundColor: `#${stringToColor(title)}`,
          height: '100%',
          width: '20px',
          borderTopLeftRadius: '10px',
          borderBottomLeftRadius: '10px',
          boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.2)',
        }}
      ></div>
      <div
        style={{
          backgroundColor: '#ffffff',
          height: '100%',
          width: '100%',
          borderTopRightRadius: '10px',
          borderBottomRightRadius: '10px',
          padding: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div>
          <div>{title}</div>
          <div>{location}</div>
          <div>{description}</div>
        </div>
        <div>
          {starttime} - {endtime}
        </div>
      </div>
    </div>
  )
}

const Tab4: React.FC = () => {
  const [weeks, setWeeks] = useState<number[]>([-2, -1, 0])
  const [selectedDay, setSelectedDay] = useState<Date>(new Date())

  // 使用 useRef 创建一个 swiper 引用
  const swiperRef = useRef<any>(null)
  const handleSlideChange = (swiper: any) => {
    let newweeks = weeks.slice()
    const flag = swiper.activeIndex > swiper.previousIndex ? 1 : -1
    for (let i = 0; i < 3; i++) {
      newweeks[i] = newweeks[i] + flag
    }
    if (swiper.activeIndex !== 1) {
      swiperRef.current?.slideTo(1) // 强制跳转到第二个幻灯片
    }
    setWeeks(newweeks)
  }

  const handleDayClick = (date: Date) => {
    setSelectedDay(date)
  }

  // 格式化日期为指定格式的字符串 例如：2025年  三月
  const Day2String = (date: Date): string => {
    const year = date.getFullYear()

    const months = [
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
    const month = months[date.getMonth()]

    return `${year}年  ${month}月`
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="white" style={{ marginTop: '20px' }}>
          <div
            style={{
              fontSize: '15px',
              marginLeft: '20px',
            }}
          >
            {Day2String(selectedDay)} {/* 显示选定日期 */}
          </div>
          <IonButtons collapse={true} slot="end">
            <IonButton
              slot="end"
              fill="clear"
              color={'dark'}
              size="large"
              shape="round"
              onClick={() => {}}
            >
              <IonIcon icon={reorderThree}></IonIcon>
            </IonButton>
            <IonButton
              fill="solid"
              shape="round"
              color={
                selectedDay.getDate() === new Date().getDate()
                  ? 'dark'
                  : 'light'
              }
              size="large"
              onClick={() => {
                setWeeks([-1, 0, 1])
                swiperRef.current?.slideTo(1)
                setSelectedDay(new Date())
              }}
            >
              <span
                style={{
                  color: 'white', // 设置文本颜色为白色
                }}
              >
                今
              </span>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>
        <Swiper
          initialSlide={1}
          slidesPerView={1}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => handleSlideChange(swiper)}
        >
          {weeks.map((index) => (
            <SwiperSlide key={index}>
              <Week
                index={index}
                onDayClick={handleDayClick}
                selectedDay={selectedDay}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '10px',
            paddingTop: '10px',
            paddingLeft: '20px',
            paddingRight: '20px',
          }}
        >
          <div
            id="stock"
            style={{
              height: '5px',
              width: '5%',
              backgroundColor: '#e5e8f3',
              borderRadius: '25%',
            }}
          ></div>
        </div>
        <Schedule
          title="微积分"
          data={new Date(2025, 0, 23)}
          starttime="08:00"
          endtime="09:35"
          description="随堂小测"
          location="紫金岗东2-103"
        />
        <Schedule
          title="跑步打卡"
          data={new Date(2025, 0, 23)}
          starttime="17:00"
          endtime="17:30"
          description=""
          location="东操"
        />
        <div style={{ backgroundColor: '#e5e8f3', height: '100%' }}></div>
      </IonContent>
    </IonPage>
  )
}

export default Tab4
