//Login.tsx
import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        const dummyUser = "user";
        const dummyPass = "password";

        if (username === dummyUser && password === dummyPass) {
            // Store login state locally
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("username", username);

            navigate("/"); // redirect to dashboard
        } else {
            alert("Invalid username or password");
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 400,
                margin: "auto",
                mt: 10,
                p: 4,
                backgroundColor: "rgba(255,255,255,0.9)",
                borderRadius: 2,
                textAlign: "center"
            }}
        >
            <Typography variant="h5" sx={{ mb: 2 }}>
                Login
            </Typography>

            <TextField
                label="Username"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                sx={{ mb: 2 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <Button variant="contained" fullWidth onClick={handleLogin}>
                Login
            </Button>
        </Box>
    );
};

export default Login;
