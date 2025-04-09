import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import Header from './Header/Header'
import Today from './Today/Today'
// import TodoList from './TodoList/TodoList'
// import QuickLink from './QuickLink/QuickLink'
import './Index.css'
import { useTime } from '@/utils/hooks'

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
  const events = [
      {
        id: 1,
        name: '微积分甲I',
        startTime: '01:57:35',
        location: '紫金港东2-201(录播)',
        duration: '8:00-10:00',
        description: '小测',
      },
      ...Array.from({ length: 10 }, (_, i) => ({
        id: i + 2,
        name: `课程${i + 2}`,
        location: '紫金港东2-201(录播)',
        duration: '8:00-10:00',
      })),
    ] as const,
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
          <Today events={events} />
          {/* <TodoList />
          <QuickLink /> */}
        </div>
      </IonContent>
    </IonPage>
  )
}
