import './CourseTimetable.css'
import { CourseBase } from '@/models/CourseBase'
import { CourseClassInfo } from '@/models/CourseClassInfo'
import { toChineseDay } from '@/models/shared'
import React from 'react'

interface CourseGridProps {
  courses: (CourseBase & CourseClassInfo)[]
  selectedSemester: string
  isTextVisible: boolean
}

const dayCount = 7
const timeslotLabels = [
  '08:00',
  '08:50',
  '10:00',
  '10:50',
  '11:40',
  '13:25',
  '14:15',
  '15:05',
  '16:15',
  '17:05',
  '18:50',
  '19:40',
  '20:30',
]

export default function CourseTimetable({
  courses,
  isTextVisible,
}: {
  courses: Pick<CourseBase & CourseClassInfo, 'name' | 'classes'>[]
  isTextVisible: boolean
}) {
  return (
    <div className='course-timetable'>
      <table>
        <tr>
          <th scope='column'></th>
          {Array.from({ length: dayCount }, (_, i) => (
            <th scope='column' key={i} className='day'>
              {toChineseDay(i + 1)}
            </th>
          ))}
        </tr>
        {timeslotLabels.map((label, timeslotI) => (
          <tr key={label}>
            <th scope='row'>
              <div className='label'>{label}</div>
              <div className='order'>{timeslotI + 1}</div>
            </th>
            {Array.from({ length: dayCount }, (_, dayI) => {
              const courseNow = courses.findX((course) =>
                course.classes.find(
                  (c) =>
                    c.dayOfWeek === dayI + 1 &&
                    c.startSection <= timeslotI + 1 &&
                    c.startSection + c.sectionCount - 1 >= timeslotI + 1,
                ),
              )
              if (!courseNow)
                //空单元格
                return <td key={dayI}></td>
              const [course, classInfo] = courseNow
              if (classInfo.startSection !== timeslotI + 1)
                return <React.Fragment key={dayI}></React.Fragment>
              return (
                <td
                  className={'has-class'.with(
                    //如果每周都上 加个full类
                    classInfo.weekType === 'every',
                    'full',
                  )}
                  rowSpan={classInfo.sectionCount}
                  key={dayI}
                >
                  <div className='block'>
                    {course.name}
                    <br />
                    {classInfo.location}
                  </div>
                </td>
              )
            })}
          </tr>
        ))}
      </table>
    </div>
  )
}
