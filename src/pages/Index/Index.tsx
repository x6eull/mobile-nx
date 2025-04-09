import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import Header from './Header/Header'
import Schedule from './Today/Today'
import TodoList from './TodoList/TodoList'
import QuickLink from './QuickLink/QuickLink'
import './Index.css'
import { useTime } from '@/utils/hooks'

const mockEvents = [
  {
    id: 1,
    name: '微积分甲I',
    startTime: '01:57:35',
    location: '紫金港东2-201(录播)',
    duration: '8:00-10:00',
    description: '小测',
  },
  {
    id: 2,
    name: '工程伦理',
    location: '玉泉曹光彪大楼西楼-201',
    duration: '18:50-20:30',
  },
  {
    id: 3,
    name: '工程伦理',
    location: '玉泉曹光彪大楼西楼-201',
    duration: '18:50-20:30',
  },
  {
    id: 4,
    name: '工程伦理',
    location: '玉泉曹光彪大楼西楼-201',
    duration: '18:50-20:30',
  },
  {
    id: 5,
    name: '工程伦理',
    location: '玉泉曹光彪大楼西楼-201',
    duration: '18:50-20:30',
  },
] as const
const tips = [
  { weather: '下雨', tip: '今日有雨，记得带伞哦！' },
  { weather: '', tip: '今日气温较低，注意穿衣保暖~' },
  { weather: '多云', tip: '今日天气舒服，适合出门走走哟~' },
  { weather: '晴天', tip: '今日天气舒服，适合出门走走哟~' },
  { weather: '阴', tip: '虽然阴天，但心情也要晴朗！' },
  { weather: '霾', tip: '今日空气质量不佳，可以带上口罩隔绝污染' },
]
export default function Index() {
  // mock data
  const events = mockEvents,
    weekOfSemester = '夏4周',
    weather = '多云',
    tempMin = 4,
    tempMax = 18
  const date = useTime(1000 * 5)

  const tip = tips.find((item) => item.weather === weather)?.tip ?? ''
  return (
    <IonPage>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">首页</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="index-container">
        <Header
          date={date}
          weekOfSemester={weekOfSemester}
          weather={weather}
          tempMin={tempMin}
          tempMax={tempMax}
          tip={tip}
        />
        <div className="cards">
          <Schedule events={events} />
          <TodoList />
          <QuickLink />
        </div>
      </IonContent>
    </IonPage>
  )
}
