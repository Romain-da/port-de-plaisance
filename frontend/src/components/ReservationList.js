import React, { useState } from "react";
import axios from "axios";
import { Table, Button, Form, Modal } from "react-bootstrap";

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

    // ✅ Ajouter une réservation
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

    // ✅ Supprimer une réservation
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

    // ✅ Ouvrir le modal de modification
    const handleEditReservation = (reservation) => {
        setEditingReservation(reservation._id);
        setUpdatedReservation({ ...reservation });
    };

    // ✅ Sauvegarder la modification
    const handleSaveReservation = async () => {
        try {
            const response = await axios.put(
                `http://localhost:5000/api/reservations/${editingReservation}`,
                updatedReservation,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setReservations(reservations.map(r => r._id === editingReservation ? response.data : r));
            setEditingReservation(null);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la réservation :", error);
        }
    };

    // ✅ Terminer une réservation (admin uniquement) et rendre le catway disponible
    const handleFinishReservation = async (id, catwayNumber) => {
        try {
            await axios.put(`http://localhost:5000/api/reservations/${id}/finish`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Met à jour l'état du catway en "disponible"
            await axios.put(
                `http://localhost:5000/api/catways/updateStatus/${catwayNumber}`,
                { catwayState: "disponible" },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setReservations(reservations.filter(res => res._id !== id)); // Supprime la réservation terminée
        } catch (error) {
            console.error("Erreur lors de la validation de la réservation", error);
        }
    };

    return (
        <div className="container">
            <h3>Liste des Réservations</h3>

            {/* ✅ Ajout d'une réservation (uniquement admin) */}
            {role === "admin" && (
                <Form className="mb-3">
                    <Form.Group>
                        <Form.Control type="number" placeholder="Numéro du Catway" value={newReservation.catwayNumber}
                            onChange={(e) => setNewReservation({ ...newReservation, catwayNumber: e.target.value })} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type="text" placeholder="Nom du Client" value={newReservation.clientName}
                            onChange={(e) => setNewReservation({ ...newReservation, clientName: e.target.value })} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type="text" placeholder="Nom du Bateau" value={newReservation.boatName}
                            onChange={(e) => setNewReservation({ ...newReservation, boatName: e.target.value })} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Check-in</Form.Label>
                        <Form.Control type="date" value={newReservation.checkIn}
                            onChange={(e) => setNewReservation({ ...newReservation, checkIn: e.target.value })} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Check-out</Form.Label>
                        <Form.Control type="date" value={newReservation.checkOut}
                            onChange={(e) => setNewReservation({ ...newReservation, checkOut: e.target.value })} />
                    </Form.Group>
                    <Button onClick={handleAddReservation}>Ajouter</Button>
                </Form>
            )}

            {/* ✅ Tableau des réservations */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Catway</th>
                        <th>Client</th>
                        <th>Bateau</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        {role === "admin" && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {reservations.map((reservation) => (
                        <tr key={reservation._id}>
                            <td>{reservation.catwayNumber}</td>
                            <td>{reservation.clientName}</td>
                            <td>{reservation.boatName}</td>
                            <td>{new Date(reservation.checkIn).toLocaleDateString()}</td>
                            <td>{new Date(reservation.checkOut).toLocaleDateString()}</td>
                            {role === "admin" && (
                                <td>
                                    <Button variant="warning" className="me-2" onClick={() => handleEditReservation(reservation)}>Modifier</Button>
                                    <Button variant="danger" className="me-2" onClick={() => handleDeleteReservation(reservation._id)}>Supprimer</Button>
                                    <Button variant="success" size="sm" onClick={() => handleFinishReservation(reservation._id, reservation.catwayNumber)}>
                                        Terminer
                                    </Button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* ✅ Modal pour modifier une réservation */}
            <Modal show={!!editingReservation} onHide={() => setEditingReservation(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifier la réservation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingReservation && (
                        <Form>
                            <Form.Group>
                                <Form.Label>Nom du Client</Form.Label>
                                <Form.Control type="text" value={updatedReservation.clientName}
                                    onChange={(e) => setUpdatedReservation({ ...updatedReservation, clientName: e.target.value })} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Nom du Bateau</Form.Label>
                                <Form.Control type="text" value={updatedReservation.boatName}
                                    onChange={(e) => setUpdatedReservation({ ...updatedReservation, boatName: e.target.value })} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Check-in</Form.Label>
                                <Form.Control type="date" value={updatedReservation.checkIn}
                                    onChange={(e) => setUpdatedReservation({ ...updatedReservation, checkIn: e.target.value })} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Check-out</Form.Label>
                                <Form.Control type="date" value={updatedReservation.checkOut}
                                    onChange={(e) => setUpdatedReservation({ ...updatedReservation, checkOut: e.target.value })} />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditingReservation(null)}>Annuler</Button>
                    <Button variant="primary" onClick={handleSaveReservation}>Sauvegarder</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ReservationList;
