import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CatwayList from "./CatwayList";
import ReservationList from "./ReservationList";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import UserList from "./UserList";

const Dashboard = ({ token }) => {
    const [catways, setCatways] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [users, setUsers] = useState([]);
    const role = localStorage.getItem("role");
    const navigate = useNavigate();

    // Fonction de déconnexion stabilisée avec `useCallback`
    const handleLogout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
    }, [navigate]);

    // Vérification du token avec `useEffect`
    useEffect(() => {
        if (!token) {
            navigate("/");
        } else {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp < currentTime) {
                    alert("Votre session a expiré. Veuillez vous reconnecter.");
                    handleLogout();
                }
            } catch (error) {
                console.error("Erreur lors de la vérification du token :", error);
                handleLogout();
            }
        }
    }, [token, navigate, handleLogout]);

    // Récupération des données des catways, réservations et utilisateurs
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

                if (role === "admin") {
                    const userRes = await axios.get("http://localhost:5000/api/users", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUsers(userRes.data);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données", error);
            }
        };
        fetchData();
    }, [token, role]);

    return (
        <Container className="mt-4">
            <Card className="p-4 shadow-lg">
                <h2 className="text-center mb-3">Tableau de Bord</h2>
                <p className="text-center">
                    <strong>Rôle :</strong> {role === "admin" ? "Administrateur" : "Utilisateur"}
                </p>
                <Button variant="danger" className="mb-3" onClick={handleLogout}>Déconnexion</Button>

                {/* Affichage des statistiques */}
                <Row className="mb-4">
                    <Col md={4}>
                        <Card className="p-3 shadow text-center">
                            <h5>Total des Catways</h5>
                            <h3>{catways.length}</h3>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="p-3 shadow text-center">
                            <h5>Total des Réservations</h5>
                            <h3>{reservations.length}</h3>
                        </Card>
                    </Col>
                    {role === "admin" && (
                        <Col md={4}>
                            <Card className="p-3 shadow text-center">
                                <h5>Total des Utilisateurs</h5>
                                <h3>{users.length}</h3>
                            </Card>
                        </Col>
                    )}
                </Row>

                {/* Affichage des Catways et Réservations */}
                <CatwayList token={token} catways={catways} setCatways={setCatways} role={role} />
                <ReservationList token={token} reservations={reservations} setReservations={setReservations} role={role} />
                {role === "admin" && <UserList token={token} />}
            </Card>
            
        </Container>
    );
};

export default Dashboard;
