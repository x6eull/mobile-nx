import { useState, useEffect, useRef } from "react";
import { TodoElement } from "../Todos";
import "./TodoItem.css";
interface Correspondence {
  1: string;
  2: string;
  3: string;
}
type Key = 1 | 2 | 3;
interface TodoItemProps extends TodoElement {
  onDelete: (id: number) => void;
}
export const todoList: TodoElement[] = [
  {
    id: 1,
    name: "不定积分作业",
    dueTime: "今天  25:00",
    type: 1,
  },
  {
    id: 2,
    name: "买桶装水",
    dueTime: "后天21:00截止",
    type: 2,
  },
  {
    id: 3,
    name: "mobile高保真绘制",
    dueTime: "01.15 21:00截止",
    type: 3,
  },
  {
    id: 4,
    name: "不定积分作业",
    dueTime: "今天  25:00",
    type: 1,
  },
];

function TodoItem({ id, name, dueTime, type, onDelete }: TodoItemProps) {
  /**处理类型与颜色的对应 */
  const correspondence: Correspondence = {
    1: "#FF5E72",
    2: "#FFCB5E",
    3: "#6A8FFF",
  };
  /**制作一个点击回弹效果，并保证动画结束后再跳转 */
  const [isAnimating, setIsAnimating] = useState(false); // 控制动画状态
  const linkRef = useRef<HTMLAnchorElement>(null); // 使用ref来引用DOM元素

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault(); // 阻止默认的跳转行为
    setIsAnimating(true); // 触发动画
  };

  useEffect(() => {
    if (isAnimating && linkRef.current) {
      // 添加动画类
      linkRef.current.style.backgroundColor = "#F8F8F8";
      linkRef.current.style.animation = "bounce 0.3s ease-out";

      // 动画完成后跳转
      const timeoutId = setTimeout(() => {
        if (linkRef.current) {
          window.location.href = linkRef.current.getAttribute("href") as string; // 跳转到目标页面
        }
        setIsAnimating(false); // 重置动画状态
      }, 300); // 动画持续时间（0.3s）

      // 清理定时器
      return () => clearTimeout(timeoutId);
    }
  }, [isAnimating]);
  /** 制作待办完成事件 */
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const handleComplete = (event: any, id: number) => {
    event.preventDefault();
    event.stopPropagation(); // 阻止事件冒泡到<a>标签
    setDeletingTodoId(id);
    setTimeout(() => {
      onDelete(id);
      setDeletingTodoId(null);
    }, 1000);
  };
  const isDeleting = deletingTodoId === id;
  return (
    <a
      ref={linkRef}
      href="/todos"
      onClick={handleClick}
      className={`todoItemWrap ${isDeleting ? "deleting" : ""}`}
      style={{
        borderLeft: "13px solid " + correspondence[type as Key],
      }}
    >
      <div className="todoItemElement">
        <span>{name}</span>
        <div>求是潮</div>
      </div>
      <div className="todoItemOther">
        <div>{dueTime}</div>
        <button
          onClick={(event) => handleComplete(event, id)}
          className={isDeleting ? "deleting-button" : ""}
        ></button>
      </div>
    </a>
  );
}

export default TodoItem;
