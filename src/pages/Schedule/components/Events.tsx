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
import type { Event as EventModel } from '@/models/Event'
import './Events.css'

const Modal = (props: EventModel) => {
  return (
    <div className='model-container'>
      <IonHeader className='ion-no-border'>
        <IonToolbar>
          <div className='bar'>
            <div className='title'>
              {props.categories === 'class' ? (
                <div className='icon study'>
                  <img src={StudyIcon} alt='Study' />
                </div>
              ) : props.categories === 'custom' ? (
                <div className='icon daily'>
                  <img src={dailyIcon} alt='Daily' />
                </div>
              ) : (
                <div className='icon exam'>
                  <IonLabel>考试</IonLabel>
                </div>
              )}
              <div className='icon-label'>
                <IonLabel>
                  {(() => {
                    let categoryLabel = ''
                    if (props.categories === 'class') {
                      categoryLabel = '课程' // class 代表课程
                    } else if (props.categories === 'exam') {
                      categoryLabel = '考试' // exam 代表考试
                    } else if (props.categories === 'custom') {
                      categoryLabel = '自定义' // custom 代表自定义
                    } else {
                      categoryLabel = '出现错误，请联系求是潮维护人员'
                    }
                    return categoryLabel
                  })()}
                </IonLabel>
              </div>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <div className='content'>
        <div className='title'>{props.summary}</div>
        <IonList lines='none'>
          <IonItem>
            <IonLabel className='left'>开始时间</IonLabel>
            <div className='time'>
              <div className='time-label'>
                {props.dtstart.month() + 1}月{props.dtstart.date()}日
              </div>
              <div className='time-label'>{props.dtstart.format('HH:mm')}</div>
            </div>
          </IonItem>
          <div className='item-line'></div>
          <IonItem>
            <IonLabel className='left'>结束时间</IonLabel>
            <div className='time'>
              <div className='time-label'>
                {props.dtend.month() + 1}月{props.dtend.date()}日
              </div>
              <div className='time-label'>{props.dtend.format('HH:mm')}</div>
            </div>
          </IonItem>
          <div className='item-line'></div>
          {props.location && (
            <>
              <IonItem>
                <IonLabel className='left'>地点</IonLabel>
                <IonLabel className='right'>{props.location}</IonLabel>
              </IonItem>
              <div className='item-line'></div>
            </>
          )}
          {props.teacher && (
            <>
              <IonItem>
                <IonLabel className='left'>教师</IonLabel>
                <IonLabel className='right'>{props.teacher}</IonLabel>
              </IonItem>
              <div className='item-line'></div>
            </>
          )}
          {props.term && (
            <>
              <IonItem>
                <IonLabel className='left'>学期</IonLabel>
                <IonLabel className='right'>{props.term}</IonLabel>
              </IonItem>
              <div className='item-line'></div>
            </>
          )}
          <IonItem>
            <IonLabel className='left'>备注</IonLabel>
          </IonItem>
          <div className='item-line'></div>
          <IonItem>
            <IonTextarea
              autoGrow={true}
              placeholder='可添加成绩构成等课程说明'
              value={props.description}
            ></IonTextarea>
          </IonItem>
        </IonList>
      </div>
    </div>
  )
}

function Event(props: EventModel) {
  const modal = useRef<HTMLIonModalElement>(null)

  const [present, dismiss] = useIonModal(<Modal {...props} />, {
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
      <div className='left-color'>
        {(() => {
          if (props.categories === 'class') {
            return <div className='left-color blue'></div> // 蓝色代表课程
          } else if (props.categories === 'exam') {
            return <div className='left-color red'></div> // 红色代表考试
          } else {
            return <div className='left-color green'></div> // 绿色代表自定义
          }
        })()}
      </div>
      <div className='left'>
        <div className='title'>{props.summary}</div>
        {props.location && <div className='location'>{props.location}</div>}
      </div>
      <div className='right'>
        <div className='time'>
          {props.dtstart.format('HH:mm')} - {props.dtend.format('HH:mm')}
        </div>
      </div>

      <IonModal className='schedule-modal-study' ref={modal}></IonModal>
    </div>
  )
}

export default function Events(props: { events: EventModel[] }) {
  return (
    <div className='events'>
      {props.events.map((event) => (
        <Event key={event.uid} {...event} />
      ))}
    </div>
  )
}
