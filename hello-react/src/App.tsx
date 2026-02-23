import { useState } from "react";
import background from "./assets/weather.png";

function App() {
  const [city, setCity] = useState("");

  const [weather, setWeather] = useState<any>(null);

  //const [clicked, setClicked] = useState(false);

  const handleClick = async () => {
    console.log("City entered:", city);
    if (!city) {
      alert("Please enter a city name.");
      return;
    }
    
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );
    const geoData = await geoResponse.json();
    if (!geoData.results) {
      alert("City not found");
      return;
    }
    const { latitude, longitude } = geoData.results[0];

    console.log("Latitude:", latitude, "Longitude:", longitude);

    /*
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    */
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
    );

    const weatherData = await weatherResponse.json();

    console.log(weatherData);
    setWeather(weatherData.daily);

  };

  return (
    <div>
    
      <h1>Weather Analytics Dashboard</h1>

      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button onClick={handleClick}>Get Weather</button>

      {/*weather && (
        <div>
          <h2>Current Weather in {city}</h2>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Wind Speed: {weather.windspeed} km/h</p>
          <img
            src={
              weather.temperature > 25
                ? "https://cdn-icons-png.flaticon.com/512/869/869869.png"
                : "https://cdn-icons-png.flaticon.com/512/1163/1163624.png"
            }
            width="100"
          />
          <p>Weather Code: {weather.weathercode}</p>
        </div>
      )*/}
      
      {weather && (
        <table border={1}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Max Temp</th>
              <th>Min Temp</th>
            </tr>
          </thead>
          <tbody>
            {weather.time.map((date: string, index: number) => (
              <tr key={date}>
                <td>{date}</td>
                <td>{weather.temperature_2m_max[index]}</td>
                <td>{weather.temperature_2m_min[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}

export default App;
