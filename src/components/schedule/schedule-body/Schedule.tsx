import logo from "./schedule.svg";
import "./Schedule.css";
import Main from "../course/main/Main";
import Min from "../course/miner/Miner";

/**第一项中传递的接口 */
export interface courseMain {
  id: number;
  name: string;
  startTime: string;
  location: string;
  duration: string;
  description: string;
}
/**events数组中传递的接口 */
export interface courseMiner {
  id: number;
  name: string;
  startTime?: string;
  location: string;
  duration: string;
  description?: string;
}
function Schedule() {
  const events: courseMiner[] = [
    {
      id: 1,
      name: "微积分甲I",
      startTime: "01:57:35",
      location: "紫金港东2-201(录播)",
      duration: "8:00-10:00",
      description: "小测",
    },
    {
      id: 2,
      name: "工程伦理",
      location: "玉泉曹光彪大楼西楼-201",
      duration: "18:50-20:30",
    },
    {
      id: 3,
      name: "工程伦理",
      location: "玉泉曹光彪大楼西楼-201",
      duration: "18:50-20:30",
    },
    {
      id: 4,
      name: "工程伦理",
      location: "玉泉曹光彪大楼西楼-201",
      duration: "18:50-20:30",
    },
    {
      id: 5,
      name: "工程伦理",
      location: "玉泉曹光彪大楼西楼-201",
      duration: "18:50-20:30",
    },
  ];

  let scheduleBody = (
    <div>
      <div className="schedule-emoji">(⑅˃◡˂⑅)</div>
      <div className="schedule-none">今日无事</div>
    </div>
  );
  if (events.length >= 1) {
    /** flag表示用户是否设置备注 */
    let flag = true;
    /** 把数组中第一项去掉，用于传入Min组件*/
    const min = events.filter((item) => events.indexOf(item) >= 1);
    let minAssemblage = min.map((item) => <Min key={item.id} item={item} />);
    let scheduleClass: string = "schedule-body-body";
    if (minAssemblage.length === 0) {
      scheduleClass = "schedule-fighting";
      minAssemblage = [
        <div key={0}>d====(￣▽￣*)b</div>,
        <div key={1} className="schedule-fighting-font">
          Fighting!!!
        </div>,
      ];
    }
    scheduleBody = (
      <div className="schedule-body">
        <Main course={events[0] as courseMain} flag={flag} />
        <div className={scheduleClass}>{minAssemblage}</div>
        {/**我们只需在这个文件处理后端传值问题即可 */}
        {/*这个地方就用数组，然后用map方法传入数据给Min组件，方法里返回Min组件，最终组成一个flexBox。*/}
      </div>
    );
  }
  return (
    <div className="schedule-container">
      <div className="schedule-head">
        <img src={logo} alt="404" />
        <span className="schedule-head-head">今日日程</span>
        <a href="/schedule" className="schedule-head-all">
          查看全部 {">"}
        </a>
      </div>
      {scheduleBody}
    </div>
  );
}

export default Schedule;
