import { useState } from 'react'
import TodoItem from './todoList-body/TodoItem'
import TodoHead from './todoList-head/TodoListHead'
import './TodoList.css'
import NoneTodo from './NoneTodo/NoneTodo'
import { todoList as initialTodos } from './todoList-body/TodoItem'
/**将TodoItem组件在此拼装为整体 */
function TodoList() {
  const [todos, setTodos] = useState(initialTodos)

  const handleDelete = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }
  /**这里todoBody默认是没有待办时的情况 */
  let todoBody = <NoneTodo />
  /**footer指的是拉到最下面时的提示，默认情况下无，只有在待办大于3个时会显示 */
  let footer: string = ''
  let todoClass: string = 'todolist-more'
  if (todos.length >= 1) {
    const todo = todos
      .slice(0, 10)
      .map((item) => (
        <TodoItem
          key={item.id}
          id={item.id}
          name={item.name}
          dueTime={item.dueTime}
          type={item.type}
          onDelete={handleDelete}
        />
      ))
    if (todos.length > 3) {
      /**只有在待办事项大于3个时,TodoItem才会超出组件高度，显示提示词 */
      footer = '别拉啦,最多显示最近10条待办哦'
    } else {
      /**待办事项不大于3个时，组件从头开始摆放 */
      todoClass = 'todolist-less'
    }
    todoBody = (
      <div className={todoClass}>
        {todo}
        <span id="footer">{footer}</span>
      </div>
    )
  }
  return (
    <div className="todowrapper">
      <TodoHead />
      {todoBody}
    </div>
  )
}

export default TodoList
