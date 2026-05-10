//App.tsx
import { useState } from "react";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import DailyReport from "./dailyReport";
import ProtectedRoute from "./ProtectedRoute";

function App() {
    const [dailyWeather, setDailyWeather] = useState<any>(null);
    //const [searchHistory, setSearchHistory] = useState<string[]>([]); 
    const [searchHistory, setSearchHistory] = useState<string[]>(() => {
        const saved = localStorage.getItem("searchHistory");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }, [searchHistory]);



    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Dashboard
                            dailyWeather={dailyWeather}
                            setDailyWeather={setDailyWeather}
                            searchHistory={searchHistory}      // pass down
                            setSearchHistory={setSearchHistory} // pass down
                        />
                    </ProtectedRoute>
                }
            />


            <Route
                path="/daily"
                element={
                    <ProtectedRoute>
                        <DailyReport dailyWeather={dailyWeather} />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
