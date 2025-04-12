import React from 'react'
import { IonProgressBar } from '@ionic/react'
import './CourseList.css'

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
    <div className='course-list'>
      {courses.map((course, index) => (
        <div key={index} className='course-item'>
          <div className='course-header'>
            <div className='course-name'>
              {course.name}{' '}
              <span className='course-credits'>{course.credits} 学分</span>
            </div>
            <div className='course-score'>
              {course.score}/{course.total}
            </div>
          </div>
          {course.total > 0 && (
            <IonProgressBar
              value={Number(course.score) / Number(course.total)}
              color='primary'
              className='course-progress'
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default CourseList
