import spot from "./miner-logo/spot.svg";
import time from "./miner-logo/time.svg";
import "./Miner.css";
import { courseMiner } from "../../schedule-body/Schedule";

function Min({ item }: { item: courseMiner }) {
  return (
    <>
      <a className="min-wrap" href="/schedule">
        <div className="min-wrapper">
          <div className="min-head">
            <div>{item.name}</div>
          </div>
          <div className="min-body">
            <div>
              <img src={spot} />
              <span>{item.location}</span>
            </div>
            <div>
              <img src={time} />
              <span>{item.duration}</span>
            </div>
          </div>
        </div>
        <div className="min-right">{">"}</div>
      </a>
    </>
  );
}

export default Min;
