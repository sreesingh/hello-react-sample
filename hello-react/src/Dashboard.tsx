// Dashboard.tsx
import { useState } from "react";
import { Card, CardContent, Typography, Button, Box, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import DailyReport from "./dailyReport";
import background from "./assets/weather.png";

interface DashboardProps {
    dailyWeather: any;
    setDailyWeather: (data: any) => void;
    searchHistory: string[];               
    setSearchHistory: React.Dispatch<React.SetStateAction<string[]>>;
}

const Dashboard = ({ dailyWeather, setDailyWeather, searchHistory, setSearchHistory }: DashboardProps) => {
    const [city, setCity] = useState("");
    const [currentWeather, setCurrentWeather] = useState<any>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showHistory, setShowHistory] = useState(false);
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        navigate("/login"); // redirect to login page
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setShowHistory(false);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClick = async () => {
        if (!city) return alert("Enter city");
        try {
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
            const geoData = await geoRes.json();
            if (!geoData.results) return alert("City not found");
            const { latitude, longitude } = geoData.results[0];

            const currentRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            const currentData = await currentRes.json();
            setCurrentWeather(currentData.current_weather);

            //setSearchHistory(prev => [city, ...prev].slice(0, 3));
            setSearchHistory(prev => {
                const newHistory = [city, ...prev].slice(0, 3);
                return newHistory;
            });


            const dailyRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
            const dailyData = await dailyRes.json();
            setDailyWeather(dailyData.daily);

        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        }
    };

    const CurrentWeatherCard = () => {
        if (!currentWeather) return null;
        return (
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h5">Weather in {city}</Typography>
                    <Typography>Temp: {currentWeather.temperature}°C</Typography>
                    <Typography>Wind: {currentWeather.windspeed} km/h</Typography>
                    <Box sx={{ my: 2 }}>
                        <img
                            src={currentWeather.temperature > 25
                                ? "https://cdn-icons-png.flaticon.com/512/869/869869.png"
                                : "https://cdn-icons-png.flaticon.com/512/1163/1163624.png"
                            }
                            width="80"
                        />
                    </Box>
                    <Typography>Code: {currentWeather.weathercode}</Typography>
                    <Button variant="outlined" onClick={() => navigate("/daily")}>Daily Report</Button>
                </CardContent>
            </Card>
        );
    };

    return (
        <Box
            sx={{
                backgroundImage: `url(${background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "100vh",
                p: 4
            }}
        >
            <Box
                sx={{
                    maxWidth: 500,
                    margin: "auto",
                    p: 3,
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderRadius: 2,
                    textAlign: "center",
                    position: "relative"
                }}
            >
                {/* Menu Button */}
                <IconButton onClick={handleMenuOpen} sx={{ position: "absolute", top: 10, right: 10 }}>
                    <MenuIcon />
                </IconButton>

                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>

                    <MenuItem onClick={() => setShowHistory(prev => !prev)}>
                        History
                    </MenuItem>

                    {showHistory && (
                        searchHistory.length === 0 ? (
                            <MenuItem disabled>No searches yet</MenuItem>
                        ) : (
                            searchHistory.map((c, index) => (
                                <MenuItem
                                    key={index}
                                    onClick={() => {
                                        setCity(c);
                                        setShowHistory(false); // close history
                                        handleMenuClose();     // close menu
                                    }}
                                >
                                    {c}
                                </MenuItem>
                            ))
                        )
                    )}

                    <MenuItem onClick={handleLogout}>Logout</MenuItem>

                </Menu>

                <Typography variant="h4" gutterBottom>Weather Dashboard</Typography>
                <input
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
                />
                <Button variant="contained" fullWidth onClick={handleClick}>Get Weather</Button>

                <CurrentWeatherCard />
            </Box>
        </Box>
    );
};

export default Dashboard;
