import React from 'react'
import {
  IonCard,
  IonCardContent,
  IonRow,
  IonCol,
  IonProgressBar,
} from '@ionic/react'

const courses = [
  { name: '语言与社会', credits: 4, score: 4.5, total: 90 },
  { name: '高等数学', credits: 4, score: 4.5, total: 90 },
  { name: '计算机科学与基础', credits: 4, score: 4.5, total: 90 },
  { name: '军训', credits: 2, score: 4.5, total: 90 },
  { name: '基础鹦鹉', credits: 7, score: 4.5, total: 90 },
  { name: '语言与社会', credits: 3, score: '缺修', total: 0 },
]

const CourseList: React.FC = () => {
  return (
    <>
      {courses.map((course, index) => (
        <IonCard key={index}>
          <IonCardContent>
            <IonRow>
              <IonCol>
                <h4>
                  {course.name} {course.credits} 学分
                </h4>
              </IonCol>
              <IonCol className="ion-text-right">
                <h4>
                  {course.score}/{course.total}
                </h4>
              </IonCol>
            </IonRow>
            {course.total > 0 && (
              <IonProgressBar
                value={Number(course.score) / Number(course.total) || 0} 
                color="primary"
              ></IonProgressBar>
            )}
          </IonCardContent>
        </IonCard>
      ))}
    </>
  )
}

export default CourseList
