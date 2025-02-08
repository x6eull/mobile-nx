import React from 'react'
import { IonGrid, IonRow, IonCol, IonCard, IonCardContent } from '@ionic/react'

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

const CourseGrid: React.FC = () => {
  return (
    <IonGrid>
      {[...Array(13)].map((_, i) => (
        <IonRow key={i}>
          <IonCol size="1" className="time-slot">
            <span>
              {8 + Math.floor(i / 2)}:{i % 2 === 0 ? '00' : '50'}
            </span>
            <small>{i + 1}</small>
          </IonCol>

          {[...Array(7)].map((_, day) => (
            <IonCol key={day} className="course-cell">
              {courses.map((course, idx) =>
                course.period === i + 1 && course.day === day + 1 ? (
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
