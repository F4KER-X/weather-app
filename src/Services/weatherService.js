import { DateTime } from "luxon";

const FORCAST_URL = "https://api.openweathermap.org/data/3.0/onecall?";
const DAILY_URL = "https://api.openweathermap.org/data/2.5/weather?";

const getDailyWeather = async (city, unit) => {
  const response = await fetch(
    `${DAILY_URL}q=${city}&units=${unit}&appid=${process.env.REACT_APP_API_KEY}`
  );
  const data = await response.json();

  const {
    coord: { lon, lat },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    sys: { country, sunrise, sunset },
    wind: { speed },
    weather: [{ main, icon }],
  } = data;

  return {
    lon,
    lat,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    country,
    sunrise,
    sunset,
    speed,
    main,
    icon,
  };
};

const getForcast = async (lon, lat, unit) => {
  const response = await fetch(
    `${FORCAST_URL}lat=${lat}&lon=${lon}&units=${unit}&exclude=minutely,alerts&appid=${process.env.REACT_APP_API_KEY}`
  );
  const forcastData = await response.json();
  return forcastData;
};

const formatFinalData = async (city, unit) => {
  const dailyData = await getDailyWeather(city, unit);

  const forcastData = await getForcast(dailyData.lon, dailyData.lat, unit);

  const formattedForcastData = formatWeatherData(forcastData);

  return { ...forcastData, ...dailyData, ...formattedForcastData };
};

const formatWeatherData = (data) => {
  let { timezone, daily, hourly } = data;

  daily = daily.slice(1, 6).map((d) => {
    return {
      title: formatToLocalTime(d.dt, timezone, "ccc"),
      temp: d.temp.day,
      icon: d.weather[0].icon,
    };
  });

  hourly = hourly.slice(1, 6).map((h) => {
    return {
      title: formatToLocalTime(h.dt, timezone, "hh:mm a"),
      temp: h.temp,
      icon: h.weather[0].icon,
    };
  });

  return { timezone, daily, hourly };
};

const formatToLocalTime = (
  sec,
  zone,
  format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(sec).setZone(zone).toFormat(format);

const iconUrlFromCode = (iconCode) =>
  `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

export default formatFinalData;

export { iconUrlFromCode, formatToLocalTime };
