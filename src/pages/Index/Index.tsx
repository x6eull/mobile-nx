import { IonContent, IonPage } from '@ionic/react'
import Header from './Header/Header'
import Today from './Today/Today'
import './Index.css'
import { useTime } from '@/utils/hooks'
import dayjs from 'dayjs'
import BundledWidgets from '../../../widgets/BundledWidget'
import Todo from './Todo/Todo'

const tips = [
  { weather: '下雨', tip: '今日有雨，记得带伞哦！' },
  { weather: '', tip: '今日气温较低，注意穿衣保暖~' },
  { weather: '多云', tip: '今日天气舒服，适合出门走走哟~' },
  { weather: '晴天', tip: '今日天气舒服，适合出门走走哟~' },
  { weather: '阴', tip: '虽然阴天，但心情也要晴朗！' },
  { weather: '霾', tip: '今日空气质量不佳，可以带上口罩隔绝污染' },
]

export default function Index() {
  const startUpDate = useTime(-1)
  // mock data
  const events = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `微积分-event${i + 1}`,
      startAt: dayjs(startUpDate).add(15, 'minute'),
      endAt: dayjs(startUpDate).add(30, 'minute'),
      location: '紫金港东0-000(录播)',
      description: 'desc',
    })),
    weekOfSemester = '夏1周',
    weather = '多云',
    tempMin = 4,
    tempMax = 18
  // 5s 更新header的日期
  const date = useTime(1000 * 5)

  const tip = tips.find((item) => item.weather === weather)?.tip ?? ''

  const todos = [
    {
      id: 1,
      name: '创业讲座听后感',
      dueTime: '2025.05.07 23:00',
      type: '作业',
    },
    {
      id: 2,
      name: 'Paraphrasing',
      dueTime: '2025.05.07 23:00',
      type: '测试',
    },
    {
      id: 3,
      name: 'mobile高保真绘制',
      dueTime: '2025.05.07 23:00',
      type: '讨论',
    },
    {
      id: 4,
      name: '不定积分作业',
      dueTime: '2025.05.07 23:00',
      type: '作业',
    },
  ]

  return (
    <IonPage>
      <IonContent className='index-container'>
        <Header
          date={date}
          weekOfSemester={weekOfSemester}
          weather={weather}
          tempMin={tempMin}
          tempMax={tempMax}
          tip={tip}
        />
        <div className='cards'>
          <Today events={events} />
          <BundledWidgets />
          <Todo todoInfo={todos} />
        </div>
      </IonContent>
    </IonPage>
  )
}
