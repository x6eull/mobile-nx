import spot from '../../../../assets/svg/Schedule/Current/spot.svg'
import time from '../../../../assets/svg/Schedule/Current/time.svg'
import remarks from '../../../../assets/svg/Schedule/Current/remarks.svg'
import './CurrentCourse.css'
import { CourseMain } from '../../Schedule'

export default function CurrentCourse(props: {
  course: CourseMain
  flag: boolean
}) {
  let remark = <></>
  let className: string = 'main-body-default'
  //如果props.flag为true，则说明用户做了备注，那么remark会变成显示备注的标签
  if (props.flag) {
    className = 'main-body'
    remark = (
      <div>
        <img src={remarks} alt="404" />
        <span>{props.course.description}</span>
      </div>
    )
  }
  return (
    <a className="main-wrap" href="/schedule">
      <div className="main-head">
        <div>距上课</div>
        <div className="time">{props.course.startTime}</div>
        <div className="main-coursename">{props.course.name}</div>
      </div>
      <div className={className}>
        <div>
          <img src={spot} alt="404" />
          <span>{props.course.location}</span>
        </div>
        <div>
          <img src={time} alt="404" />
          <span>{props.course.duration}</span>
        </div>
        {remark}
      </div>
    </a>
  )
}
