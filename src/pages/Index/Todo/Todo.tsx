import Card, { CardIcon } from '../Card/Card'
import IconTodo from './iconTodoList.svg?react'
import './Todo.css'

function TodoItem({
  name,
  dueTime,
  type,
}: {
  name: string
  dueTime: string
  type: string
}) {
  /**处理类型与颜色的对应 */
  const correspondence: Record<string, string> = {
    作业: '#FF5E72',
    测试: '#FFCB5E',
    讨论: '#6A8FFF',
  }

  return (
    <div
      className='todo-item-wrap'
      style={{
        borderLeft: '13px solid ' + correspondence[type],
      }}
    >
      <div className='todo-item-element'>
        <div className='todo-name'>{name}</div>
        <div className='todo-type'>{type}</div>
      </div>
      <div className='todo-item-other'>
        <div>{dueTime}</div>
      </div>
    </div>
  )
}

export default function Todo({
  todoInfo,
}: {
  todoInfo: {
    id: number
    name: string
    dueTime: string
    type: string
  }[]
}) {
  return (
    <Card
      icon={
        <CardIcon bgColor='var(--todo-icon-background)'>
          <IconTodo />
        </CardIcon>
      }
      title='学在浙大待办'
    >
      <div
        className='todolist'
        style={{
          justifyContent: todoInfo.length > 3 ? 'space-around' : 'flex-start',
        }}
      >
        {todoInfo.slice(0, 10).map((item) => (
          <TodoItem
            key={item.id}
            name={item.name}
            dueTime={item.dueTime}
            type={item.type}
          />
        ))}
        <div className='todo-footer'>
          {todoInfo.length > 3 ? '别拉啦,最多显示最近10条待办哦' : ''}
        </div>
      </div>
    </Card>
  )
}
