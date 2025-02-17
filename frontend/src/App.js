import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    useEffect(() => {
      setToken(localStorage.getItem("token")); // Met à jour le token si l'utilisateur se connecte
      
  }, []);    return (
        <Router>
            <Routes>
                {/* Si l'utilisateur est connecté, on affiche le Dashboard, sinon on le renvoie vers la connexion */}
                <Route path="/" element={!token ? <Login setToken={setToken} /> : <Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={token ? <Dashboard token={token} /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
