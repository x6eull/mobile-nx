import { CourseBase } from '@/models/CourseBase'
import './SemesterGrade.css'
import { CourseGradeInfo } from '@/models/CourseGradeInfo'

export default function SemesterGrade({
  credits,
  gpa,
  creditsYear,
  gpaYear,
  courses,
}: {
  credits: number
  gpa: number
  creditsYear: number
  gpaYear: number
  courses: (CourseBase & CourseGradeInfo)[]
}) {
  return (
    <div className='semester-grade'>
      <div className='summary'>
        <div className='field'>
          <div className='label'>学期学分</div>
          <div className='value'>{credits.toFixed(1)}</div>
        </div>
        <div className='field'>
          <div className='label'>学期均绩</div>
          <div className='value'>{gpa.toFixed(2)}</div>
        </div>
        <div className='field'>
          <div className='label'>学年学分</div>
          <div className='value'>{creditsYear.toFixed(1)}</div>
        </div>
        <div className='field'>
          <div className='label'>学年均绩</div>
          <div className='value'>{gpaYear.toFixed(2)}</div>
        </div>
      </div>
      <div className='course-list'>
        {courses.map((course) => (
          <div key={course.id} className='item'>
            <div className='info'>
              <div className='name'>{course.name}</div>
              <div className='credits'>{course.credit} 学分</div>
            </div>
            <div className='score'>
              {course.rawScore} / {course.rawGradePoint}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
