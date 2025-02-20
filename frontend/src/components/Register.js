import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";

const Register = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/auth/register", user);
            alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
            navigate("/"); // Rediriger vers la page de connexion
        } catch (err) {
            setError("Erreur lors de l'inscription. Vérifiez vos informations.");
        }
    };

    return (
        <Container className="mt-5">
            <Card className="p-4 shadow-lg">
                <h2 className="text-center">Inscription</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleRegister}>
                    <Form.Group>
                        <Form.Label>Nom</Form.Label>
                        <Form.Control type="text" name="name" value={user.name} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={user.email} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Mot de passe</Form.Label>
                        <Form.Control type="password" name="password" value={user.password} onChange={handleChange} required />
                    </Form.Group>
                    <Button type="submit" className="mt-3">S'inscrire</Button>
                </Form>
                <p className="mt-3 text-center">
                    Déjà un compte ? <a href="/">Se connecter</a>
                </p>
            </Card>
        </Container>
    );
};

export default Register;
