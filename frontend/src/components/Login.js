import React, { useState } from "react";
import axios from "axios";

const Login = ({ setToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
    
            if (response.data.token) {  // Vérifie si le token est bien reçu
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("role", response.data.role);
                setToken(response.data.token);
            } else {
                setError("Erreur : Aucun token reçu !");
            }
        } catch (err) {
            setError("Email ou mot de passe incorrect.");
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
        </div>
    );
};

export default Login;