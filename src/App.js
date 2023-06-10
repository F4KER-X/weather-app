import { useEffect, useState } from "react";
import "./App.css";
import Forcast from "./Components/Forcast";
//import UilReact from "@iconscout/react-unicons/icons/uil-react";
import HeadButtons from "./Components/HeadButtons";
import Inputs from "./Components/Inputs";
import Temperature from "./Components/Temperature";
import TimeAndLocation from "./Components/TimeAndLocation";
import formatFinalData from "./Services/weatherService";

function App() {
  const [city, setCity] = useState("Montreal");
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const data = await formatFinalData(city, units);
      setWeather(data);
    };

    fetchWeather();
  }, [city, units]);

  const formatBackground = () => {
    if (!weather) return "from-cyan-700 to-blue-700";
    const threshhold = units === "metric" ? 30 : 86;

    if (weather.temp <= threshhold) return "from-cyan-700 to-blue-700";
    return "from-yellow-700 to-orange-700";
  };

  return (
    <div
      className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-b h-fit shadow-xl shadow-gray-400 ${formatBackground()}`}
    >
      <HeadButtons setCity={setCity} />
      <Inputs setCity={setCity} units={units} setUnits={setUnits} />

      {weather && (
        <>
          <TimeAndLocation weather={weather} />
          <Temperature weather={weather} />
          <Forcast title="hourly forcast" items={weather.hourly} />
          <Forcast title="daily forcast" items={weather.daily} />
        </>
      )}
    </div>
  );
}

export default App;
