import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

const Login = ({ setToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, 
                { email, password },
                { withCredentials: true } // Ajout pour l'authentification
            );

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("role", response.data.role);
                setToken(response.data.token);
                navigate("/dashboard"); // Redirection après connexion
            } else {
                setError("Erreur : Aucun token reçu !");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Email ou mot de passe incorrect.");
        }
    };

    return (
        <div>
            <h2>Connexion</h2>
            {error && <p style={{ color : "red" }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Se connecter</button>
            </form>
            <p className="mt-3 text-center">Pas encore de compte ? <a href="/register">S'inscrire</a></p>
            <p className="mt-3 text-center"><a href="/documentation">📖 Documentation</a></p>
        </div>
    );
};

export default Login;
