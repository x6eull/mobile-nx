import { IonHeader, IonItem, IonList, useIonModal } from '@ionic/react'
import iconEvent from '../event.svg'
import type { Event as EventModel } from '@/models/Event'
import './EventList.css'
import { throwF } from '@/utils/func'
import { ReactNode, useContext } from 'react'
import { CourseCombinedContext } from '@/context/CourseCombinedContext'
import { CourseClassInfo } from '@/models/CourseClassInfo'
import { CourseBase } from '@/models/CourseBase'

function EventDetailField({
  label,
  value,
}: {
  label: string
  value: ReactNode
}) {
  return (
    // 最后一个元素不需要分割线，在CSS中隐藏
    <IonItem lines='full' className='field'>
      <div slot='start' className='label'>
        {label}
      </div>
      <div slot='end' className='value'>
        {value}
      </div>
    </IonItem>
  )
}

function EventDetail({ event }: { event: EventModel }) {
  const courseCombined = useContext(CourseCombinedContext)
  const courseId = event['x-course-id']
  const courseRelatedInfo: { label: string; value: string }[] = []
  if (courseId) {
    const courseIdInfo = { label: '选课号', value: courseId }
    courseRelatedInfo.push(courseIdInfo)
    const course = courseCombined.find((course) => course.id === courseId) as
      | undefined
      | (CourseBase & Partial<CourseClassInfo>)
    if (course) {
      courseRelatedInfo.push({ label: '课程名', value: course.name })
      courseRelatedInfo.push({ label: '教师', value: course.teacherName ?? '' })
    } else courseIdInfo.value = '? ' + courseId
  }
  const fields = [
    { label: '开始时间', value: event.dtstart.format('YYYY-MM-DD HH:mm') },
    { label: '结束时间', value: event.dtend.format('YYYY-MM-DD HH:mm') },
    { label: '地点', value: event.location },
    ...courseRelatedInfo,
    { label: '备注', value: event.description },
  ]
  return (
    <div className='event-detail'>
      <IonHeader className='header ion-no-border'>
        <div className='title'>
          <div className='icon daily'>
            <img src={iconEvent} alt='Daily' />
          </div>
          <div className='icon-label'>
            {event.categories === 'class'
              ? '课程'
              : event.categories === 'exam'
                ? '考试'
                : event.categories === 'custom'
                  ? '日程'
                  : throwF(new Error('Unknown event category'))}
          </div>
        </div>
      </IonHeader>
      <div className='content'>
        <div className='title'>{event.summary}</div>
        <IonList className='fields' lines='none'>
          {fields.map(({ label, value }) => (
            <EventDetailField key={label} label={label} value={value} />
          ))}
        </IonList>
      </div>
    </div>
  )
}

function Event({ event }: { event: EventModel }) {
  const [present] = useIonModal(EventDetail, { event })
  function openModal() {
    present({
      initialBreakpoint: 0.6,
      breakpoints: [0, 0.6, 1],
      cssClass: 'modal-event-detail',
    })
  }

  return (
    <div
      className='event'
      onClick={openModal}
      style={
        {
          //TODO 生成事件颜色
          '--ribbon-background':
            event.categories === 'class'
              ? '#2196f3'
              : event.categories === 'exam'
                ? '#f44336'
                : '#4caf50',
        } as React.CSSProperties
      }
    >
      <div className='info'>
        <div className='title'>{event.summary}</div>
        {event.location && <div className='location'>{event.location}</div>}
      </div>
      <div className='time'>
        {event.dtstart.format('HH:mm')} - {event.dtend.format('HH:mm')}
      </div>
    </div>
  )
}

export default function EventList({ events }: { events: EventModel[] }) {
  return (
    <div className='schedule-events'>
      {events.map((ev) => (
        <Event key={ev.uid} event={ev} />
      ))}
    </div>
  )
}
