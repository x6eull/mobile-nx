import "./Calendar.css";

function Calendar({
  year,
  month,
  day,
  season,
  number,
  num,
}: {
  year: number;
  month: number;
  day: number;
  season: string;
  number: number;
  num: string;
}) {
  return (
    <div className="calendar-container">
      <div className="calendar-item1">
        {year}年{month}月{day}日
      </div>
      <div className="calendar-item2">
        <div>
          {season}
          {number}周
        </div>
        <div>星期{num}</div>
      </div>
    </div>
  );
}

export default Calendar;
