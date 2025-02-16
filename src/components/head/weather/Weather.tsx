import "./Weather.css";

interface weatherModel {
  weather: string;
  temperature: {
    min: number;
    max: number;
  };
}
function Weather({
  weatherData,
  tip,
}: {
  weatherData: weatherModel;
  tip: string;
}) {
  return (
    <div className="weather-container1">
      <div className="weather">
        <div>{weatherData.weather}</div>
        <div>
          {weatherData.temperature.min}/{weatherData.temperature.max}&#176;C
        </div>
      </div>
      <div id="weather-tip">{tip}</div>
    </div>
  );
}

export default Weather;
