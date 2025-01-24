import logo from './schedule.svg';
import './schedule.css'; 
import Main from '../course/main/main';
import Min from '../course/miner/miner'


export interface courseMain {
    id: number,
    name: string,
    startTime: string,
    location: string,
    duration: string,
    description: string
}
export interface courseMiner {
    id: number,
    name: string,
    startTime?: string,
    location: string,
    duration: string,
    description?: string
}
function Schedule() {  
    const events:courseMiner[] = [
        {
            id: 1,
            name: '微积分甲I',
            startTime: '01:57:35',
            location: '紫金港东2-201(录播)',
            duration: '8:00-10:00',
            description: '小测'
        },
        {
            id: 2,
            name: '工程伦理',
            location: '玉泉曹光彪大楼西楼-201',
            duration: '18:50-20:30'
        },
        {
            id: 3,
            name: '工程伦理',
            location: '玉泉曹光彪大楼西楼-201',
            duration: '18:50-20:30'
        },
        {
            id: 4,
            name: '工程伦理',
            location: '玉泉曹光彪大楼西楼-201',
            duration: '18:50-20:30'
        },
        {
            id: 5,
            name: '工程伦理',
            location: '玉泉曹光彪大楼西楼-201',
            duration: '18:50-20:30'
        }
    ];

        let flag = true;
        const min = events.filter(item=>events.indexOf(item)>=1)  //把数组中第一项去掉，用于传入Min组件
        const minAssemblage = min.map(item => (
            <Min key={item.id} item={item}/>
        ))

    return (
        <div className="schedule-container">
            <div className='schedule-head'>      
                    <img src={logo}/>
                    <span className='schedule-head-head'>今日日程</span>     
                <a href="#" className='schedule-head-all'>查看全部 {'>'}</a>                               {/*缺少跳转地址*/}
            </div>
            <div className='schedule-body'>
                <Main course={events[0] as courseMain} flag={flag} />{/* 这里直接就先用上面的数据，先做一个传值*/}  {/**这里的flag是用来标志用户是否添加了备注 */}
                <div className='schedule-body-body'>{minAssemblage}</div>   {/**我们只需在这个文件处理后端传值问题即可 */}
            {/*这个地方就用数组，然后用map方法传入数据给Min组件，方法里返回Min组件，最终组成一个flexBox。*/}
            </div>
        </div>
    );
};

export default Schedule;