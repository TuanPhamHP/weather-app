import React, { useState, useEffect } from "react";

function formatDate(date, gmt) {
  const hours =
    date.getUTCHours() + gmt < 0 ? `${date.getUTCHours() + gmt + 24}` : date.getUTCHours() + gmt;
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const seconds = date.getSeconds();
  return `${hours} : ${minutes}`;
}

function WeatherCard({ weather, weatherHly }) {
  const t = new Date();
  const [time, setTime] = useState(formatDate(t));
  const [weatherHrly, setWeatherHrly] = useState(weatherHly);
  useEffect(() => {
    const date = new Date();
    formatDate(date, weather.timezone / 3600);
    setTimeout(() => {
      const now = new Date();
      let newTime = formatDate(now, +(weather.timezone / 3600));
      setTime(newTime);
      setWeatherHrly(weatherHly);
    }, 1);
    const timeInterval = setInterval(() => {
      const now = new Date();
      let newTime = formatDate(now, +(weather.timezone / 3600));
      setTime(newTime);
    }, 6000);
    return () => {
      clearInterval(timeInterval);
    };
  });
  const getWeather = () => {
    switch (weather.weather[0].main) {
      case "Rain":
        return "rainny-day";
      case "Clouds":
        return "cloudy-day";
      case "Clear":
        return "clear-sky";
      case "Smoke":
        return "smoke-day";
      case "Mist":
          return "mist-day";
      default:
        return "";
    }
  };
  const getTemp = () => {
    if (weather.main.temp < 292) {
      return "cold-day";
    } else if (292 < weather.main.temp && weather.main.temp < 300) {
      return "fresh-day";
    } else if (weather.main.temp > 300) {
      return "hot-day";
    }
  };
  const setDefaultWeather = () => {
    localStorage.clear();
    localStorage.setItem("initValue", JSON.stringify(weather));
  };
  const getHourlyTemp = () => {
    if (!weatherHrly) {
      return;
    }
    // console.log(weatherHrly);
    const parseToDate = mls => {
      let ct = new Date(mls * 1000);
      let ch = `${JSON.stringify(ct.getHours())} : 00`;
      return <p className='time'>{ch}</p>;
    };
    const toDay = weatherHrly.filter(item => {
      if (
        new Date(item.dt * 1000).getHours() > new Date().getHours() &&
        new Date(item.dt * 1000).getHours() < 24
      ) {
        return item;
      }
    });
    const hourlyTemp = toDay.map(item => {
      return (
        <div key={item.dt} className='hourly-items'>
          {parseToDate(item.dt)}
          <p className='temp'>
            {(item.temp - 273.15).toFixed(1)}
            <sup>°C</sup>
          </p>
          <p className='description'>{item.weather[0].description}</p>
        </div>
      );
    });
    return hourlyTemp;
  };

  return (
    <div >
      <div
        key={Math.random() * Date.now()}
        className={`weather-card main-card ${getWeather()} ${getTemp()}`}
      >
        <button className='set-default' onClick={setDefaultWeather}>
          Set as default
        </button>
        <p className='weather-name'>{weather.name}</p>
        <p className='weather-temp'>
          {(weather.main.temp - 273.15).toFixed(1)}
          <sup>°C</sup>
        </p>
        <div className='weather-temp--minmax'>
          {" "}
          <p className='weather-temp--min'>
            Min :{(weather.main.temp_min - 273.15).toFixed(1)}
            <sup>°C</sup>
          </p>
          <p className='weather-temp--max'>
            Max :{(weather.main.temp_max - 273.15).toFixed(1)}
            <sup>°C</sup>
          </p>
        </div>
        <p className='weather-description'>{weather.weather[0].description}</p>
        <p className='weather-humidity'>Humidity :{weather.main.humidity}%</p>
        <p className='notice notice-cold'>
          Beware, my friends to day is quite cold . Keep your self warm .
        </p>
        <p className='notice notice-cool'>
          What a nice day. My friends, to day is a good day . Keep your self up .
        </p>
        <p className='notice notice-hot'>
          Beware, my friends to day is a hot day . Keep your self calm and have a good day .
        </p>
        <div className='hourly-wrapper'>{getHourlyTemp()}</div>
        <p className='weather-time'>{time}</p>
        <p className='weather-GMT'>
          Time Zone : GMT
          {weather.timezone < 0 ? `${weather.timezone / 3600}` : `+${weather.timezone / 3600}`}
        </p>
      </div>
    </div>
  );
}
export default WeatherCard;
