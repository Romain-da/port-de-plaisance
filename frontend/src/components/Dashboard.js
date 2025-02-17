import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CatwayList from "./CatwayList";
import ReservationList from "./ReservationList";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Container, Button, Card } from "react-bootstrap";

const Dashboard = ({ token }) => {
    const [catways, setCatways] = useState([]);
    const [reservations, setReservations] = useState([]);
    const role = localStorage.getItem("role");
    const navigate = useNavigate();

    // 📌 Fonction de déconnexion stabilisée avec `useCallback`
    const handleLogout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/"); 
    }, [navigate]); // ✅ Ajout de `navigate` comme dépendance

    // 📌 Vérification du token avec `useEffect`
    useEffect(() => {
        if (!token) {
            navigate("/");
        } else {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp < currentTime) {
                    alert("Votre session a expiré. Veuillez vous reconnecter.");
                    handleLogout(); // ✅ `handleLogout` est maintenant stable
                }
            } catch (error) {
                console.error("Erreur lors de la vérification du token :", error);
                handleLogout();
            }
        }
    }, [token, navigate, handleLogout]); // ✅ Plus de warning !

    // 📌 Récupération des données des catways et réservations
    useEffect(() => {
        const fetchData = async () => {
            try {
                const catwayRes = await axios.get("http://localhost:5000/api/catways", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCatways(catwayRes.data);

                const reservationRes = await axios.get("http://localhost:5000/api/reservations", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReservations(reservationRes.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des données", error);
            }
        };
        fetchData();
    }, [token]);

    return (
        <Container className="mt-4">
            <Card className="p-4 shadow-lg">
                <h2 className="text-center mb-3">Tableau de Bord</h2>
                <p className="text-center">
                    <strong>Rôle :</strong> {role === "admin" ? "👑 Administrateur" : "👤 Utilisateur"}
                </p>
                <Button variant="danger" className="mb-3" onClick={handleLogout}>Déconnexion</Button>

                {/* 📌 Affichage des composants Catways et Réservations */}
                <CatwayList token={token} catways={catways} setCatways={setCatways} role={role} />
                <ReservationList token={token} reservations={reservations} setReservations={setReservations} role={role} />
            </Card>
        </Container>
    );
};

export default Dashboard;
