import spot from "./main-logo/spot.svg";
import time from "./main-logo/time.svg";
import remarks from "./main-logo/remarks.svg";
import "./Main.css";
import { courseMain } from "../../schedule-body/Schedule";

function Main({ course, flag }: { course: courseMain; flag: boolean }) {
  let remark = <></>;
  let className: string = "main-body-default";
  //如果flag为true，则说明用户做了备注，那么remark会变成显示备注的标签
  if (flag) {
    className = "main-body";
    remark = (
      <div>
        <img src={remarks} alt="404" />
        <span>{course.description}</span>
      </div>
    );
  }
  return (
    <a className="main-wrap" href="/schedule">
      <div className="main-head">
        <div>距上课</div>
        <div id="time">{course.startTime}</div>
        <div id="main-coursename">{course.name}</div>
      </div>
      <div className={className}>
        <div>
          <img src={spot} alt="404" />
          <span>{course.location}</span>
        </div>
        <div>
          <img src={time} alt="404" />
          <span>{course.duration}</span>
        </div>
        {remark}
      </div>
    </a>
  );
}

export default Main;
