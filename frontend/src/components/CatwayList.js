import React, { useState } from "react";
import { Button, Table, Card, Form } from "react-bootstrap";
import axios from "axios";

const CatwayList = ({ token, catways, setCatways, role }) => {
    const [editingCatway, setEditingCatway] = useState(null); // Catway en cours de modification
    const [updatedCatway, setUpdatedCatway] = useState({}); // Nouveaux détails du Catway

    const handleEditCatway = (catway) => {
        setEditingCatway(catway._id);
        setUpdatedCatway({ ...catway }); // Pré-remplir avec les valeurs actuelles
    };

    const handleSaveCatway = async () => {
        try {
            const response = await axios.put(
                `http://localhost:5000/api/catways/${editingCatway}`,
                updatedCatway,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setCatways(catways.map(c => c._id === editingCatway ? response.data : c));
            setEditingCatway(null); // Quitter le mode édition
        } catch (error) {
            console.error("Erreur lors de la mise à jour du catway", error);
        }
    };

    return (
        <Card className="p-3 mt-4">
            <h3>Liste des Catways</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Type</th>
                        <th>État</th>
                        {role === "admin" && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {catways.map((catway) => (
                        <tr key={catway._id}>
                            <td>{catway.catwayNumber}</td>
                            <td>{catway.type}</td>
                            <td>{catway.catwayState}</td>
                            {role === "admin" && (
                                <td>
                                    {editingCatway === catway._id ? (
                                        <>
                                            <Form.Control
                                                type="text"
                                                value={updatedCatway.type}
                                                onChange={(e) => setUpdatedCatway({ ...updatedCatway, type: e.target.value })}
                                            />
                                            <Form.Control
                                                type="text"
                                                value={updatedCatway.catwayState}
                                                onChange={(e) => setUpdatedCatway({ ...updatedCatway, catwayState: e.target.value })}
                                            />
                                            <Button variant="success" size="sm" onClick={handleSaveCatway}>
                                                Sauvegarder
                                            </Button>
                                            <Button variant="secondary" size="sm" onClick={() => setEditingCatway(null)}>
                                                Annuler
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="warning" size="sm" onClick={() => handleEditCatway(catway)}>
                                                Modifier
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
