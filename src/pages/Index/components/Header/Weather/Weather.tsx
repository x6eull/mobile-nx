import './Weather.css'

interface weatherModel {
  weather: string
  temperature: {
    min: number
    max: number
  }
}

export default function Weather(props: {
  weatherData: weatherModel
  tip: string
}) {
  return (
    <div className="weather-container1">
      <div className="weather">
        <div>{props.weatherData.weather}</div>
        <div>
          {props.weatherData.temperature.min}/
          {props.weatherData.temperature.max}
          &#176;C
        </div>
      </div>
      <div className="weather-tip">{props.tip}</div>
    </div>
  )
}
