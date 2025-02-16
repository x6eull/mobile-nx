import logo from "./todoList-head.svg";
import "./TodoListHead.css";
function TodoHead() {
  return (
    <div className="todo-head">
      <img src={logo} alt="404" />
      <div className="todo-head-head">待办事项</div>
      <a href="/todos" className="todo-head-all">
        查看全部 {">"}
      </a>
    </div>
  );
}

export default TodoHead;
