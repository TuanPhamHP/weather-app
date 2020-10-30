import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import WeatherCard from "./components/WeatherCard";
import "./assets/style/main.scss";
const KEY = "f5ff5f05cff9a15fb369cecc24fe826c";
const initialWeather = {
  coord: {
    lon: 107.83,
    lat: 16.17,
  },
  weather: [
    {
      id: 802,
      main: "Clouds",
      description: "scattered clouds",
      icon: "03d",
    },
  ],
  base: "stations",
  main: {
    temp: 303.64,
    feels_like: 308.79,
    temp_min: 302.15,
    temp_max: 305.15,
    pressure: 1008,
    humidity: 74,
  },
  visibility: 10000,
  wind: {
    speed: 2.1,
    deg: 200,
  },
  clouds: {
    all: 40,
  },
  dt: 1592363664,
  sys: {
    type: 1,
    id: 9310,
    country: "VN",
    sunrise: 1592345821,
    sunset: 1592392935,
  },
  timezone: 25200,
  id: 1562822,
  name: "Vietnam",
  cod: 200,
};
function App() {
  const [weather, setWeather] = useState(initialWeather);
  const [weatherHly, setWeatherHly] = useState(null);
  const [query, setQuery] = useState([]);
  const [search, setSearch] = useState([]);
  const [hourly, setHourly] = useState(
    JSON.parse(localStorage.getItem("initValue"))
      ? JSON.parse(localStorage.getItem("initValue")).coord
      : initialWeather.coord
  );
  const reg = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${KEY}`;
  const regH = `https://api.openweathermap.org/data/2.5/onecall?lat=${hourly.lat}&lon=${hourly.lon}&exclude=minutely,daily&appid=${KEY}`;
  const handleSearch = useCallback(async () => {
    try {
      const result = await Axios.get(reg);
      setWeather(result.data);
      setHourly(result.data.coord);
    } catch (error) {
      console.log(error);
      setWeather(
        JSON.parse(localStorage.getItem("initValue"))
          ? JSON.parse(localStorage.getItem("initValue"))
          : initialWeather
      );
      setHourly(
        JSON.parse(localStorage.getItem("initValue"))
          ? JSON.parse(localStorage.getItem("initValue")).coord
          : initialWeather.coord
      );
    }
  }, [regH, hourly, reg]);
  useEffect(() => {
    handleSearch();
  }, [query]);

  useEffect(() => {
    try {
      const resultH = Axios.get(regH);
      resultH.then((respond) => {
        setWeatherHly(respond.data.hourly);
        console.log(respond.data.hourly);
      });
    } catch (err) {
      const resultH = Axios.get(regH);
      resultH.then((respond) => setWeatherHly(respond.data.hourly));
    }
  }, [hourly]);

  const handleUpdate = (e) => {
    let string = e.target.value;
    setSearch(string);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let x = search;
    setQuery(search);
    setSearch("");
  };
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
  return (
    <div className={`App ${getWeather()}`}>
      <form action="submit" onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="search hereeeeeee"
          onChange={handleUpdate}
          value={search}
          className="search-box"
        />
      </form>
      <WeatherCard weather={weather} weatherHly={weatherHly} />
    </div>
  );
}

export default App;
