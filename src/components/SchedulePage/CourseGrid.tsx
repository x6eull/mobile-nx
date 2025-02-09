import React from 'react'
import { IonGrid, IonRow, IonCol, IonCard, IonCardContent } from '@ionic/react'
import './CourseGrid.css'

const courses = [
  { name: '微积分（甲）II', period: 1, day: 1, location: '紫金港东 2-201' },
  { name: '大学物理（甲）I', period: 1, day: 2, location: '紫金港东 1B-306' },
  {
    name: '信息与电子工程导论',
    period: 1,
    day: 3,
    location: '紫金港东 1A-214',
  },
  { name: '常微分方程', period: 3, day: 5, location: '紫金港东 2-201' },
  { name: '工程训练', period: 8, day: 5, location: '紫金港东 工实习中心-208' },
  { name: '大脑与社会', period: 11, day: 6, location: '紫金港东 6-208' },
  { name: '形势与政策', period: 12, day: 7, location: '紫金港东 1A-207' },
]

const timeSlots = [
  { start: '08:00', index: 1 },
  { start: '08:50', index: 2 },
  { start: '10:00', index: 3 },
  { start: '10:50', index: 4 },
  { start: '11:40', index: 5 },
  { start: '13:25', index: 6 },
  { start: '14:15', index: 7 },
  { start: '15:05', index: 8 },
  { start: '16:15', index: 9 },
  { start: '17:05', index: 10 },
  { start: '18:50', index: 11 },
  { start: '19:40', index: 12 },
  { start: '20:30', index: 13 },
]

const CourseGrid: React.FC = () => {
  return (
    <IonGrid className="course-grid">
      <IonRow className="weekday-row">
        <IonCol size="1"></IonCol>
        {['一', '二', '三', '四', '五', '六', '日'].map((day, index) => (
          <IonCol key={index} className="weekday-cell">
            {day}
          </IonCol>
        ))}
      </IonRow>

      {timeSlots.map((slot, i) => (
        <IonRow key={i} className="time-row">
          <IonCol size="1" className="time-slot">
            <div className="time-text">
              <span>{slot.start}</span>
              <small>{slot.index}</small>
            </div>
          </IonCol>

          {[...Array(7)].map((_, day) => (
            <IonCol key={day} className="course-cell">
              {courses.map((course, idx) =>
                course.period === slot.index && course.day === day + 1 ? (
                  <IonCard key={idx} className="course-card">
                    <IonCardContent>
                      <h5>{course.name}</h5>
                      <p>{course.location}</p>
                    </IonCardContent>
                  </IonCard>
                ) : null,
              )}
            </IonCol>
          ))}
        </IonRow>
      ))}
    </IonGrid>
  )
}

export default CourseGrid

