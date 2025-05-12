import { useContext, useMemo } from 'react'
import Card, { CardIcon } from '../Card/Card'
import IconTodo from './iconTodo.svg?react'
import './Todo.css'
import { CourseCombinedContext } from '@/context/CourseCombinedContext'
import { CourseBase } from '@/models/CourseBase'
import ItemRow from '@/components/ItemRow/ItemRow'
import dayjs from 'dayjs'
import { XzzdTodoType } from '@/models/CourseTodoInfo'

const todoTypeInfo = {
  homework: { name: '作业', color: '#FFCB5E' },
  exam: { name: '考试', color: '#FF5E72' },
  questionnaire: { name: '问卷', color: '#6A8FFF' },
} satisfies Record<XzzdTodoType, { name: string; color: string }>

export default function Todo() {
  const courseCombined = useContext(CourseCombinedContext)
  const todoList = useMemo(
    () =>
      courseCombined
        .map((c) =>
          'todos' in c
            ? c.todos.map((t) => ({
                ...t,
                course: c as CourseBase,
              }))
            : [],
        )
        .flat(),
    [courseCombined],
  )
  return (
    <Card
      icon={
        <CardIcon bgColor='#ffe0e0'>
          <IconTodo className='icon-todo' />
        </CardIcon>
      }
      title='学在浙大待办'
    >
      <div className='todo-container'>
        {todoList.map((t, i) => (
          <ItemRow
            key={i}
            ribbonBackground={todoTypeInfo[t.type].color}
            title={t.title}
            subtitle={`${t.course.name} (${todoTypeInfo[t.type].name})`}
            extra={dayjs(t.endAt).format('M.D HH:mm')}
          />
        ))}
      </div>
    </Card>
  )
}
