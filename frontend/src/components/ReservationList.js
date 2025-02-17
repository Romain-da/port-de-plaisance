import React, { useState } from "react";
import axios from "axios";

const ReservationList = ({ token, reservations, setReservations, role }) => {
    const [newReservation, setNewReservation] = useState({
        catwayNumber: "",
        clientName: "",
        boatName: "",
        checkIn: "",
        checkOut: "",
    });

    const [editingReservation, setEditingReservation] = useState(null);
    const [updatedReservation, setUpdatedReservation] = useState({});

    const handleAddReservation = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/reservations", newReservation, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReservations([...reservations, response.data]);
            setNewReservation({ catwayNumber: "", clientName: "", boatName: "", checkIn: "", checkOut: "" });
        } catch (error) {
            console.error("Erreur lors de l'ajout de la réservation", error);
        }
    };

    const handleDeleteReservation = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?");
        if (!confirmation) return;

        try {
            await axios.delete(`http://localhost:5000/api/reservations/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReservations(reservations.filter((reservation) => reservation._id !== id));
        } catch (error) {
            console.error("Erreur lors de la suppression de la réservation", error);
        }
    };

    const handleEditReservation = (reservation) => {
        setEditingReservation(reservation._id);
        setUpdatedReservation({ ...reservation });
    };

    const handleSaveReservation = async () => {
        console.log("📝 ID de la réservation en cours de mise à jour :", editingReservation);
        console.log("📝 Données envoyées :", updatedReservation);
    
        try {
            const response = await axios.put(
                `http://localhost:5000/api/reservations/${editingReservation}`,
                updatedReservation,
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            console.log("✅ Réponse du serveur :", response.data);
            setReservations(reservations.map(r => r._id === editingReservation ? response.data : r));
            setEditingReservation(null);
        } catch (error) {
            console.error("❌ Erreur lors de la mise à jour de la réservation :", error);
        }
    };

    return (
        <div>
            <h3>Liste des Réservations</h3>

            {/* L'ajout de réservation est réservé aux admins */}
            {role === "admin" && (
                <div>
                    <input
                        type="number"
                        placeholder="Numéro du Catway"
                        value={newReservation.catwayNumber}
                        onChange={(e) => setNewReservation({ ...newReservation, catwayNumber: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Nom du Client"
                        value={newReservation.clientName}
                        onChange={(e) => setNewReservation({ ...newReservation, clientName: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Nom du Bateau"
                        value={newReservation.boatName}
                        onChange={(e) => setNewReservation({ ...newReservation, boatName: e.target.value })}
                    />
                    <input
                        type="date"
                        value={newReservation.checkIn}
                        onChange={(e) => setNewReservation({ ...newReservation, checkIn: e.target.value })}
                    />
                    <input
                        type="date"
                        value={newReservation.checkOut}
                        onChange={(e) => setNewReservation({ ...newReservation, checkOut: e.target.value })}
                    />
                    <button onClick={handleAddReservation}>Ajouter</button>
                </div>
            )}

            <ul>
                {reservations.map((reservation) => (
                    <li key={reservation._id}>
                        {editingReservation === reservation._id ? (
                            <div>
                                <input
                                    type="text"
                                    value={updatedReservation.clientName}
                                    onChange={(e) => setUpdatedReservation({ ...updatedReservation, clientName: e.target.value })}
                                />
                                <input
                                    type="text"
                                    value={updatedReservation.boatName}
                                    onChange={(e) => setUpdatedReservation({ ...updatedReservation, boatName: e.target.value })}
                                />
                                <input
                                    type="date"
                                    value={updatedReservation.checkIn}
                                    onChange={(e) => setUpdatedReservation({ ...updatedReservation, checkIn: e.target.value })}
                                />
                                <input
                                    type="date"
                                    value={updatedReservation.checkOut}
                                    onChange={(e) => setUpdatedReservation({ ...updatedReservation, checkOut: e.target.value })}
                                />
                                <button onClick={handleSaveReservation}>Sauvegarder</button>
                                <button onClick={() => setEditingReservation(null)}>Annuler</button>
                            </div>
                        ) : (
                            <>
                                {reservation.clientName} - {reservation.boatName} - {reservation.checkIn} à {reservation.checkOut}

                                {/* Seuls les admins peuvent modifier ou supprimer une réservation */}
                                {role === "admin" && (
                                    <>
                                        <button onClick={() => handleEditReservation(reservation)}>Modifier</button>
                                        <button onClick={() => handleDeleteReservation(reservation._id)}>Supprimer</button>
                                    </>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReservationList;
