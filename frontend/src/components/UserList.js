import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Form, Card } from "react-bootstrap";
import API_BASE_URL from "../config";

const UserList = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });
    const [editingUser, setEditingUser] = useState(null);
    const [updatedUser, setUpdatedUser] = useState({});

    // Récupérer les utilisateurs
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des utilisateurs", error);
            }
        };
        fetchUsers();
    }, [token]);

    // Ajouter un utilisateur
    const handleAddUser = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/users`, newUser, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers([...users, response.data]);
            setNewUser({ name: "", email: "", password: "", role: "user" });
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'utilisateur", error);
        }
    };

    // Supprimer un utilisateur
    const handleDeleteUser = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;

        try {
            await axios.delete(`${API_BASE_URL}/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(users.filter((user) => user._id !== id));
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur", error);
        }
    };

    // Activer le mode édition
    const handleEditUser = (user) => {
        setEditingUser(user._id);
        setUpdatedUser({ ...user });
    };

    // Sauvegarder les modifications
    const handleSaveUser = async () => {
        if (!editingUser) return;

        try {
            const response = await axios.put(
                `${API_BASE_URL}/api/users/${editingUser}`,
                updatedUser,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUsers(users.map(u => u._id === editingUser ? response.data : u));
            setEditingUser(null);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur", error);
        }
    };

    return (
        <Card className="p-3 mt-4">
            <h3>Gestion des Utilisateurs</h3>

            {/* Formulaire d'ajout d'un utilisateur */}
            <Form className="mb-3">
                <h5>Ajouter un Utilisateur</h5>
                <Form.Group>
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nom"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Mot de passe"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Rôle</Form.Label>
                    <Form.Select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                        <option value="user">Utilisateur</option>
                        <option value="admin">Administrateur</option>
                    </Form.Select>
                </Form.Group>
                <Button className="mt-2" onClick={handleAddUser}>Ajouter</Button>
            </Form>

            {/* Tableau des Utilisateurs */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>
                                {editingUser === user._id ? (
                                    <Form.Control
                                        type="text"
                                        value={updatedUser.name}
                                        onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
                                    />
                                ) : (
                                    user.name
                                )}
                            </td>
                            <td>{user.email}</td>
                            <td>
                                {editingUser === user._id ? (
                                    <Form.Select
                                        value={updatedUser.role}
                                        onChange={(e) => setUpdatedUser({ ...updatedUser, role: e.target.value })}
                                    >
                                        <option value="user">Utilisateur</option>
                                        <option value="admin">Administrateur</option>
                                    </Form.Select>
                                ) : (
                                    user.role
                                )}
                            </td>
                            <td>
                                {editingUser === user._id ? (
                                    <>
                                        <Button variant="success" size="sm" className="me-2" onClick={handleSaveUser}>
                                            Sauvegarder
                                        </Button>
                                        <Button variant="secondary" size="sm" onClick={() => setEditingUser(null)}>
                                            Annuler
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditUser(user)}>
                                            Modifier
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user._id)}>
                                            Supprimer
                                        </Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Card>
    );
};

export default UserList;
