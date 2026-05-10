import { useNavigate } from "react-router-dom";

function DailyReport({ dailyWeather }: any) {
    const navigate = useNavigate();

    if (!dailyWeather) return <p>No daily data available.</p>;

    return (
        <div style={{ padding: "30px", textAlign: "center" }}>
            <h1>Daily Weather Report</h1>
            <button onClick={() => navigate("/")}>⬅ Back</button>
            <table border={1} style={{ margin: "auto", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Max Temp (°C)</th>
                        <th>Min Temp (°C)</th>
                    </tr>
                </thead>
                <tbody>
                    {dailyWeather.time.map((date: string, i: number) => (
                        <tr key={date}>
                            <td>{date}</td>
                            <td>{dailyWeather.temperature_2m_max[i]}</td>
                            <td>{dailyWeather.temperature_2m_min[i]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DailyReport;
