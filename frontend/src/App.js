import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import NavigationBar from "./components/Navbar"; 
import Register from "./components/Register"; 
import Documentation from "./components/Documentation";

function App() {
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    useEffect(() => {
        setToken(localStorage.getItem("token")); // Met à jour le token si l'utilisateur se connecte
    }, []);

    // Fonction de déconnexion
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setToken(null);
    };

    return (
        <Router>
            {/*Affiche la Navbar uniquement si l'utilisateur est connecté */}
            {token && <NavigationBar token={token} handleLogout={handleLogout} />}
            
            <Routes>
                {/* Redirection vers Login si non connecté, sinon Dashboard */}
                <Route path="/" element={!token ? <Login setToken={setToken} /> : <Navigate to="/dashboard" />} />
                <Route path="/register" element={<Register />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/dashboard" element={token ? <Dashboard token={token} /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
