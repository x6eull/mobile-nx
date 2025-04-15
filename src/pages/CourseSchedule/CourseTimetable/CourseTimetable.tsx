import Timeline from '@/components/Timeline/Timeline'
import './CourseTimetable.css'
import { CourseBase } from '@/models/CourseBase'
import { CourseClassInfo } from '@/models/CourseClassInfo'
import { toChineseDay } from '@/models/shared'
import { useMemo } from 'react'

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
  courses: (CourseBase & CourseClassInfo)[]
  isTextVisible: boolean
}) {
  const courseEachDay = useMemo(() => {
    const result: {
      course: CourseBase
      classInfo: CourseClassInfo['classes'][number]
    }[][] = Array.from({ length: dayCount }, () => [])
    courses.forEach((course) => {
      course.classes.forEach((classInfo) =>
        result[classInfo.dayOfWeek - 1].push({ course, classInfo }),
      )
    })
    return result
  }, [courses])

  return (
    <div className='course-timetable'>
      <div className='date-row'>
        <div className='date'></div>
        {Array.from({ length: dayCount }, (_, dayI) => (
          <div key={dayI} className='date'>
            {toChineseDay(dayI + 1)}
          </div>
        ))}
      </div>
      <div className='table-body'>
        <div className='column header'>
          <Timeline
            blockCount={timeslotLabels.length}
            blocks={timeslotLabels.map((l, i) => ({
              fromBlock: i,
              duration: 1,
              content: (
                <div key={i} className='timeslot'>
                  <div className='label'>{l}</div>
                  <div className='order'>{i + 1}</div>
                </div>
              ),
            }))}
          />
        </div>
        {courseEachDay.map((courseThisDay, dayI) => (
          <div key={dayI} className='column'>
            <Timeline
              blockCount={timeslotLabels.length}
              blocks={courseThisDay.map(({ course, classInfo }) => ({
                fromBlock: classInfo.startSection - 1,
                duration: classInfo.sectionCount,
                content: (
                  <div className='course-outer'>
                    <div
                      className={'course'.with(
                        classInfo.weekType === 'every',
                        'full',
                      )}
                    >
                      {isTextVisible && (
                        <>
                          <div className='name'>{course.name}</div>
                          <div className='location'>{classInfo.location}</div>
                        </>
                      )}
                    </div>
                  </div>
                ),
              }))}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
