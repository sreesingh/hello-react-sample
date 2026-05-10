import { useState, useRef, useEffect } from "react";
import "./App.css";
import background from "./assets/weather.png";
import { Routes, Route, useNavigate } from "react-router-dom";
import DailyReport from "./dailyReport";

interface HamburgerIconProps {
  onClick: () => void;
}

function HamburgerIcon({ onClick }: HamburgerIconProps) {
  return (
    <div
      style={{ position: "absolute", top: 20, right: 20, cursor: "pointer" }}
      onClick={onClick}
    >
      <div style={{ width: 30, height: 3, background: "black", margin: "5px 0" }} />
      <div style={{ width: 30, height: 3, background: "black", margin: "5px 0" }} />
      <div style={{ width: 30, height: 3, background: "black", margin: "5px 0" }} />
    </div>
  );
}

function App() {
  const [city, setCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [dailyWeather, setDailyWeather] = useState<any>(null);
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const handleClickHamburger = () => {
    setShowMenu(!showMenu); // Toggle menu visibility
  };
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false); 

  const showDailyReport = () => {
    navigate("/daily");
  };


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

    
    const currentResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    const currentWeatherData = await currentResponse.json();
    console.log(currentWeatherData);
    setCurrentWeather(currentWeatherData.current_weather);

    setSearchHistory(prev => {
      const newHistory = [city, ...prev]; // add new city at the start
      return newHistory.slice(0, 3);      // keep only last 3
    });

    const dailyResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    const dailyWeatherData = await dailyResponse.json();
    console.log(dailyWeatherData);
    setDailyWeather(dailyWeatherData.daily);
    
  };

  // Current weather card
  const CurrentWeatherCard = () => {
    if (!currentWeather) return null;

    return (
      <div>
        <h2>Current Weather in {city}</h2>
        <p>Temperature: {currentWeather.temperature}°C</p>
        <p>Wind Speed: {currentWeather.windspeed} km/h</p>
        <img
          src={
            currentWeather.temperature > 25
              ? "https://cdn-icons-png.flaticon.com/512/869/869869.png"
              : "https://cdn-icons-png.flaticon.com/512/1163/1163624.png"
          }
          width="100"
        />
        <p>Weather Code: {currentWeather.weathercode}</p>
        <button onClick={() => navigate("/daily")}>Daily Report</button>
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "40px",
        position: "relative",
      }}
    >
    <div
        style={{
          background: "rgba(255,255,255,0.85)",
          padding: "30px",
          borderRadius: "12px",
          maxWidth: "600px",
          margin: "auto",
          textAlign: "center",
          position: "relative",
        }}
    >
      <HamburgerIcon onClick={handleClickHamburger} />
      <Routes>
        <Route path = "/"
          element={
            <div>
              {showMenu && (
                <div
                  ref={menuRef}
                  style={{
                    position: "absolute",
                    top: 60,
                    right: 20,
                    background: "white",
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    padding: 10,
                    width: 120,
                    textAlign: "left",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  }}
                >
                  <p
                    style={{ margin: 0, cursor: "pointer", fontWeight: "bold" }}
                    onClick={() => setShowHistory(!showHistory)}
                  >
                    History
                  </p>
                  {showHistory &&
                    (searchHistory.length === 0 ? (
                      <p style={{ margin: 0, fontStyle: "italic" }}>No searches yet</p>
                    ) : (
                      searchHistory.map((c, index) => (
                        <p
                          key={index}
                          style={{ margin: 0, cursor: "pointer", padding: "2px 0" }}
                          onClick={() => {
                            setCity(c); // set input to that city
                            setShowMenu(false); // close menu after selecting
                            setShowHistory(false); // collapse History
                          }}
                        >
                          {c}
                        </p>
                      ))
                    ))}
                </div>
              )}
              <h1>Weather Analytics Dashboard</h1>
              <input
                type="text"
                placeholder="Enter city name"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <button onClick={handleClick}>Get Weather</button>
              <CurrentWeatherCard />
            </div>
          }
        />
        <Route path = "/daily"
          element={
            <DailyReport dailyWeather={dailyWeather} />
          }
        />
      </Routes>
    </div>
    </div>
  );
}

export default App;
