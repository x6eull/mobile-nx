import TodoItem from "./todoList-body/todoItem";
import TodoHead from "./todoList-head/todoList-head";
import { todoElement } from "./todos";
import './todoList.css'

function TodoList() {
    const todos: todoElement[] = [{
        id : 1,
        name : '不定积分作业',
        dueTime  : '今天  25:00'
      },
      {
        id : 2,
        name : '不定积分作业',
        dueTime  : '今天  25:00'
      },
      {
        id : 3,
        name : '不定积分作业',
        dueTime  : '今天  25:00'
      },
      {
        id : 4,
        name : '不定积分作业',
        dueTime  : '今天  25:00'// 应该是传数据才对
      }
    ]

    const todo = todos.map(item => (
        <TodoItem key={item.id} name={item.name} dueTime={item.dueTime}/>
    ))
    let footer:string = '';
    if(todos.length>3){
      footer = '别拉啦,最多显示最近10条待办哦';
    }
    return (
        <div className="todowrapper">
            <TodoHead/>
            <div className="todolist">{todo}<span id="footer">{footer}</span></div>
        </div>
    )
}


export default TodoList;