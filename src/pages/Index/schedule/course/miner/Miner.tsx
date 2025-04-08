import spot from './miner-logo/spot.svg'
import time from './miner-logo/time.svg'
import './Miner.css'
import { EventBrief } from '../../schedule-body/Schedule'

export default function Min(props: { item: EventBrief }) {
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
