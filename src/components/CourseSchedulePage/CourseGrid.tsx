import React, { useEffect, useState } from 'react'
import { IonGrid, IonRow, IonCol, IonCard, IonCardContent } from '@ionic/react'
import './CourseGrid.css'
import { Course } from '../../models/Course'
import { Term } from '../../models/shared'
import courseTextVisibilityEvent from './CourseScheduleHeader'

interface CourseGridProps {
  courses: Course[]
  selectedSemester: string
  isTextVisible: boolean
}

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

const CourseGrid: React.FC<CourseGridProps> = ({
  courses,
  selectedSemester,
  isTextVisible,
}) => {
  const timeSlotHeight = 5
  const [year, term] = selectedSemester.split('-')

  const filteredCourses = courses.filter(
    (course) =>
      course.semester.year === Number(year) &&
      Term[course.semester.term] === term,
  )

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

      <IonRow className="main-content-row">
        {/* 时间列 */}
        <IonCol size="1" className="time-column">
          {timeSlots.map((slot) => (
            <div
              key={slot.index}
              className="time-slot-label"
              style={{ height: `${timeSlotHeight}vh` }}
            >
              <span>{slot.start}</span>
              <small>{slot.index}</small>
            </div>
          ))}
        </IonCol>

        {/* 天列 */}
        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
          <IonCol key={day} className="day-column">
            {filteredCourses.map((course, idx) =>
              course.classes
                .filter((classItem) => classItem.dayOfWeek === day)
                .map((classItem, classIdx) => (
                  <IonCard
                    key={`${idx}-${classIdx}`}
                    className={`course-card ${!isTextVisible ? 'hide-text' : ''}`}
                    style={{
                      position: 'absolute',
                      top: `${(classItem.startSection - 1) * timeSlotHeight}vh`,
                      height: `${classItem.sectionCount * timeSlotHeight}vh`,
                      width: 'calc(100% - 2px)',
                      left: '1px',
                      right: '1px',
                    }}
                  >
                    <IonCardContent>
                      <h5>{course.name}</h5>
                      <p>{classItem.location}</p>
                    </IonCardContent>
                  </IonCard>
                )),
            )}
          </IonCol>
        ))}
      </IonRow>
    </IonGrid>
  )
}

export default CourseGrid
