import Calendar from "./Calendar/Calendar";
import Weather from "./weather/Weather";

function Head() {
  interface Tips {
    //天气与温馨提示的对象数组
    weather: string;
    tip: string;
  }
  let tips: Tips[] = [
    { weather: "下雨", tip: "今日有雨，记得带伞哦！" },
    { weather: "", tip: "今日气温较低，注意穿衣保暖~" },
    { weather: "多云", tip: "今日天气舒服，适合出门走走哟~" },
    { weather: "晴天", tip: "今日天气舒服，适合出门走走哟~" },
    { weather: "阴", tip: "虽然阴天，但心情也要晴朗！" },
    { weather: "霾", tip: "今日空气质量不佳，可以带上口罩隔绝污染" },
  ];

  interface calendarModel {
    //calendar部分接口与数据
    year: number;
    month: number;
    day: number;
    season: string;
    number: number;
    num: string;
  }
  const calendar: calendarModel = {
    year: 24,
    month: 12,
    day: 24,
    season: "冬",
    number: 14,
    num: "一",
  };
  interface weatherModel {
    //weather部分接口与数据
    weather: string;
    temperature: {
      min: number;
      max: number;
    };
  }

  const weatherCondition: weatherModel = {
    weather: "多云",
    temperature: {
      min: -1,
      max: 100,
    },
  };

  const tip = (
    tips.find((item) => item.weather === weatherCondition.weather) as Tips
  ).tip; //找到对应天气的温馨提醒

  //
  return (
    <>
      <Calendar {...calendar} />
      <Weather weatherData={weatherCondition} tip={tip} />
    </>
  );
}
export default Head;
