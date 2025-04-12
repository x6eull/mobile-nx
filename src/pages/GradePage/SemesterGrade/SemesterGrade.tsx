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
  credits: string
  gpa: string
  creditsYear: string
  gpaYear: string
  courses: (CourseBase & CourseGradeInfo)[]
}) {
  return (
    <div className='semester-grade'>
      <div className='summary'>
        <div className='field'>
          <div className='label'>学期学分</div>
          <div className='value'>{credits}</div>
        </div>
        <div className='field'>
          <div className='label'>学期均绩</div>
          <div className='value'>{gpa}</div>
        </div>
        <div className='field'>
          <div className='label'>学年学分</div>
          <div className='value'>{creditsYear}</div>
        </div>
        <div className='field'>
          <div className='label'>学年均绩</div>
          <div className='value'>{gpaYear}</div>
        </div>
      </div>
      <div className='course-list'>
        {courses.map((course) => (
          <div key={course.id} className='item'>
            <div className='header'>
              <div className='info'>
                <div className='name'>{course.name}</div>
                <div className='credits'>{course.credit} 学分</div>
              </div>
              <div className='course-score'>
                {course.rawScore} / {course.rawGradePoint}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
