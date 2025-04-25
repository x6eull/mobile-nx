import {
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTextarea,
  IonToolbar,
  useIonModal,
} from '@ionic/react'
import { useRef } from 'react'
import StudyIcon from '../icon/Study.svg'
import dailyIcon from '../icon/Daily.svg'

import './Events.css'

interface EventProps {
  type: '课程' | '日程'
  date: Date
  title: string
  starttime: string
  endtime: string
  description: string
  teacher?: string
  term?: string
  location: string
}

interface EventsProps {
  events: EventProps[] | null
}

function Event({
  type,
  date,
  title,
  starttime,
  endtime,
  description,
  teacher,
  term,
  location,
}: EventProps) {
  const modal = useRef<HTMLIonModalElement>(null)

  const Modal = () => {
    return (
      <div className='model-container'>
        <IonHeader className='ion-no-border'>
          <IonToolbar>
            <div className='bar'>
              <div className='title'>
                {type === '课程' ? (
                  <div className='icon study'>
                    <img src={StudyIcon} alt='Study' />
                  </div>
                ) : (
                  <div className='icon daily'>
                    <img src={dailyIcon} alt='Daily' />
                  </div>
                )}
                <div className='icon-label'>
                  <IonLabel>课程</IonLabel>
                </div>
              </div>
            </div>
          </IonToolbar>
        </IonHeader>

        <div className='content'>
          <div className='title'>{title}</div>
          <IonList lines='none'>
            <IonItem>
              <IonLabel className='left'>开始时间</IonLabel>
              <div className='time'>
                <div className='time-label'>
                  {date.getMonth() + 1}月{date.getDate()}日
                </div>
                <div className='time-label'>{starttime}</div>
              </div>
            </IonItem>
            <div className='item-line'></div>
            <IonItem>
              <IonLabel className='left'>结束时间</IonLabel>
              <div className='time'>
                <div className='time-label'>
                  {date.getMonth() + 1}月{date.getDate()}日
                </div>
                <div className='time-label'>{endtime}</div>
              </div>
            </IonItem>
            <div className='item-line'></div>
            <IonItem>
              <IonLabel className='left'>地点</IonLabel>
              <IonLabel className='right'>{location}</IonLabel>
            </IonItem>
            <div className='item-line'></div>
            {teacher && (
              <>
                <IonItem>
                  <IonLabel className='left'>教师</IonLabel>
                  <IonLabel class='right'>{teacher}</IonLabel>
                </IonItem>
                <div className='item-line'></div>
              </>
            )}
            {term && (
              <>
                <IonItem>
                  <IonLabel className='left'>学期</IonLabel>
                  <IonLabel class='right'>{term}</IonLabel>
                </IonItem>
                <div className='item-line'></div>
              </>
            )}
            <IonItem>
              <IonLabel className='left'>备注</IonLabel>
            </IonItem>
            <div className='item-line'></div>
            <IonItem>
              {/* TODO: 编辑保存 */}
              <IonTextarea
                autoGrow={true}
                placeholder='可添加成绩构成等课程说明'
                value={description}
              ></IonTextarea>
            </IonItem>
          </IonList>
        </div>
      </div>
    )
  }

  const [present, dismiss] = useIonModal(Modal, {
    dismiss: (data: string, role: string) => dismiss(data, role),
  })

  function openModal() {
    present({
      initialBreakpoint: 1,
      breakpoints: [0, 1],
      cssClass: 'modal-study',
    })
  }

  return (
    <div className='event' onClick={openModal}>
      <div className='left-color red'></div>
      <div className='left'>
        <div className='title'>{title}</div>
        <div className='location'>{location}</div>
      </div>
      <div className='right'>
        <div className='time'>
          {starttime} - {endtime}
        </div>
      </div>

      <IonModal className='schedule-modal-study' ref={modal}></IonModal>
    </div>
  )
}

export default function Events({ events }: EventsProps) {
  if (!events) {
    return <></>
  }

  return (
    <div className='events'>
      {events.map((event, index) => (
        <Event
          type={event.type}
          key={index}
          date={event.date}
          title={event.title}
          starttime={event.starttime}
          endtime={event.endtime}
          description={event.description}
          location={event.location}
        />
      ))}
      <Event
        type='课程'
        date={new Date()}
        title='微积分(甲) Ⅱ'
        starttime='08:00'
        endtime='09:35'
        description='随堂小测'
        teacher='苏德矿'
        term='24年 春夏'
        location='紫金港东2-103'
      />
      <Event
        type='日程'
        date={new Date()}
        title='划水划水'
        starttime='11:30'
        endtime='14:30'
        description=''
        location='紫金港小剧场 B127'
      />
    </div>
  )
}
