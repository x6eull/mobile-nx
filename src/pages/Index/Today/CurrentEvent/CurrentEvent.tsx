import spot from './spot.svg'
import time from './time.svg'
import remarks from './remarks.svg'
import './CurrentEvent.css'
import { EventDetail } from '../Today'

export default function CurrentEvent(props: {
  event: EventDetail
  flag: boolean
}) {
  let remark = <></>
  let className: string = 'current-event-body-default'
  //如果props.flag为true，则说明用户做了备注，那么remark会变成显示备注的标签
  if (props.flag) {
    className = 'current-event-body'
    remark = (
      <div>
        <img src={remarks} alt="404" />
        <span>{props.event.description}</span>
      </div>
    )
  }
  return (
    <a className="current-event-wrap" href="/schedule">
      <div className="current-event-head">
        <div>距上课</div>
        <div className="time">{props.event.startTime}</div>
        <div className="current-event-name">{props.event.name}</div>
      </div>
      <div className={className}>
        <div>
          <img src={spot} alt="404" />
          <span>{props.event.location}</span>
        </div>
        <div>
          <img src={time} alt="404" />
          <span>{props.event.duration}</span>
        </div>
        {remark}
      </div>
    </a>
  )
}
