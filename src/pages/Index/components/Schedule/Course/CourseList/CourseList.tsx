import spot from '@/pages/Index/assets/svg/Schedule/List/spot.svg'
import time from '@/pages/Index/assets/svg/Schedule/List/time.svg'
import './CourseList.css'
import { EventBrief } from '../../Schedule'

export default function CourseList(props: { item: EventBrief }) {
  return (
    <>
      <a className="min-wrap" href="/schedule">
        <div className="min-wrapper">
          <div className="min-head">
            <div>{props.item.name}</div>
          </div>
          <div className="min-body">
            <div>
              <img src={spot} alt="404" />
              <span>{props.item.location}</span>
            </div>
            <div>
              <img src={time} alt="404" />
              <span>{props.item.duration}</span>
            </div>
          </div>
        </div>
        <div className="min-right">{'>'}</div>
      </a>
    </>
  )
}
