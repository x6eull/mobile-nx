import './todoItem.css';

function TodoItem ({name,dueTime}:{name: string,dueTime: string}) {
  
  function handleClick () {

  }

  return (
    <>
      <div className='todoItemWrap'>
        <div className='todoItemElement'>
          <span>{name}</span>
          <div>求是潮</div>
        </div>
        <div className='todoItemOther'>
          <div>{dueTime}</div>
          <button onClick={handleClick}></button>
        </div>
      </div>
    </>
  )
}

export default TodoItem;