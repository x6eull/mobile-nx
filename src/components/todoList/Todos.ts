export interface TodoElement {
  id: number;
  name: string;
  dueTime: string;
  type: number;
}

export const todoContent: TodoElement[] = [
  {
    id: 1,
    name: "不定积分作业",
    dueTime: "今天 21:00 截止",
    type: 1,
  },
  {
    id: 2,
    name: "买桶装水",
    dueTime: "后天 21:00 截止",
    type: 2,
  },
  {
    id: 3,
    name: "mobile高保真绘制",
    dueTime: "1.15 21:00 截止",
    type: 3,
  },
  // 更多待办事项...
];
