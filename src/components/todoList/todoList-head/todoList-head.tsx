import logo from './todoList-head.svg';
import './todoList-head.css';
function TodoHead(){
    return(
        <div className='todo-head'>
            <img src={logo}/>
            <div className='todo-head-head'>待办事项</div>
            <a href="#" className='todo-head-all'>查看全部 {'>'}</a>                               {/*缺少跳转地址*/}
        </div>
    )
}

export default TodoHead;