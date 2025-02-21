import React, { useState } from "react";
import { Button, Table, Card, Form } from "react-bootstrap";
import axios from "axios";
import API_BASE_URL from "../config";

const CatwayList = ({ token, catways, setCatways, role }) => {
    const [editingCatway, setEditingCatway] = useState(null);
    const [updatedCatway, setUpdatedCatway] = useState({});
    const [newCatway, setNewCatway] = useState({
        catwayNumber: "",
        catwayName: "",
        type: "long",
        catwayState: "disponible",
    });

    // Filtrage des catways pour afficher uniquement les disponibles aux utilisateurs normaux
    const filteredCatways = role === "admin" ? catways : catways.filter(c => c.catwayState === "disponible");

    // Ajouter un catway
    const handleAddCatway = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/catways`, newCatway, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCatways([...catways, response.data]);
            setNewCatway({ catwayNumber: "", catwayName: "", type: "long", catwayState: "disponible" });
        } catch (error) {
            console.error("Erreur lors de l'ajout du catway", error);
        }
    };

    // Supprimer un catway
    const handleDeleteCatway = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce catway ?")) return;

        try {
            await axios.delete(`${API_BASE_URL}/api/catways/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCatways(catways.filter((catway) => catway._id !== id));
        } catch (error) {
            console.error("Erreur lors de la suppression du catway", error);
        }
    };

    // Activer le mode édition
    const handleEditCatway = (catway) => {
        setEditingCatway(catway._id);
        setUpdatedCatway({ ...catway });
    };

    // Sauvegarder les modifications
    const handleSaveCatway = async () => {
        if (!editingCatway) return;

        try {
            const response = await axios.put(
                `${API_BASE_URL}/api/catways/${editingCatway}`,
                updatedCatway,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setCatways(catways.map(c => c._id === editingCatway ? response.data : c));
            setEditingCatway(null);
        } catch (error) {
            console.error("Erreur lors de la mise à jour du catway", error);
        }
    };

    return (
        <Card className="p-3 mt-4">
            <h3>Liste des Catways</h3>

            {/* Formulaire d'ajout d'un Catway (admin uniquement) */}
            {role === "admin" && (
                <Form className="mb-3">
                    <h5>Ajouter un Catway</h5>
                    <Form.Group>
                        <Form.Label>Numéro du Catway</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Numéro"
                            value={newCatway.catwayNumber}
                            onChange={(e) => setNewCatway({ ...newCatway, catwayNumber: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Nom</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nom du catway"
                            value={newCatway.catwayName}
                            onChange={(e) => setNewCatway({ ...newCatway, catwayName: e.target.value })}
                        />
                    </Form.Group>
                    <Button className="mt-2" onClick={handleAddCatway}>Ajouter</Button>
                </Form>
            )}

            {/* Tableau des Catways */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Nom</th>
                        <th>Type</th>
                        <th>État</th>
                        {role === "admin" && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {filteredCatways.map((catway) => (
                        <tr key={catway._id}>
                            <td>{catway.catwayNumber}</td>
                            <td>
                                {editingCatway === catway._id ? (
                                    <Form.Control
                                        type="text"
                                        value={updatedCatway.catwayName}
                                        onChange={(e) => setUpdatedCatway({ ...updatedCatway, catwayName: e.target.value })}
                                    />
                                ) : (
                                    catway.catwayName
                                )}
                            </td>
                            <td>
                                {editingCatway === catway._id ? (
                                    <Form.Select
                                        value={updatedCatway.type}
                                        onChange={(e) => setUpdatedCatway({ ...updatedCatway, type: e.target.value })}
                                    >
                                        <option value="long">Long</option>
                                        <option value="short">Short</option>
                                    </Form.Select>
                                ) : (
                                    catway.type
                                )}
                            </td>
                            <td>
                                {editingCatway === catway._id ? (
                                    <Form.Select
                                        value={updatedCatway.catwayState}
                                        onChange={(e) => setUpdatedCatway({ ...updatedCatway, catwayState: e.target.value })}
                                    >
                                        <option value="disponible">Disponible</option>
                                        <option value="occupé">Occupé</option>
                                        <option value="maintenance">Maintenance</option>
                                    </Form.Select>
                                ) : (
                                    catway.catwayState
                                )}
                            </td>
                            {role === "admin" && (
                                <td>
                                    {editingCatway === catway._id ? (
                                        <>
                                            <Button variant="success" size="sm" className="me-2" onClick={handleSaveCatway}>
                                                Sauvegarder
                                            </Button>
                                            <Button variant="secondary" size="sm" onClick={() => setEditingCatway(null)}>
                                                Annuler
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditCatway(catway)}>
                                                Modifier
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDeleteCatway(catway._id)}>
                                                Supprimer
                                            </Button>
                                        </>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Card>
    );
};

export default CatwayList;
