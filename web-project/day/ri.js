document.addEventListener("DOMContentLoaded", () => {
    const currentDateElement = document.getElementById("current-date");
    const scheduleListContainer = document.getElementById("schedule-list-container");
  
    const schedules = [
      { title: "数学课", time: "08:00 - 09:30" },
      { title: "跑步", time: "17:00 - 17:30" },
    ];
  
    // 设置当前日期
    const today = new Date();
    currentDateElement.textContent = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
  
    // 加载日程
    schedules.forEach((schedule) => {
      const item = document.createElement("div");
      item.className = "schedule-item";
      item.innerHTML = `<div class="title">${schedule.title}</div><div class="time">${schedule.time}</div>`;
      scheduleListContainer.appendChild(item);
    });
  });
  