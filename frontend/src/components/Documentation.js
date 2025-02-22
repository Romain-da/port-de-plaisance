import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Documentation = () => {
    const navigate = useNavigate();

    return (
        <Container className="mt-5">
            <Card className="p-4 shadow-lg">
                <h2 className="text-center">Documentation</h2>
                <p className="mt-3">
                    Bienvenue dans l'application de gestion du port de plaisance. Voici les principales fonctionnalités :
                </p>
                <ul>
                    <li>Inscription et connexion sécurisée</li>
                    <li>Gestion des Catways (ajout, modification, suppression)</li>
                    <li>Réservation des Catways</li>
                    <li>Accès restreint aux administrateurs</li>
                    <li>Statistiques et tableau de bord</li>
                </ul>
                <p>Pour l'ajout d'un catway</p>
                <ul>
                    <li>Ajouter le numéro</li>
                    <li>Ajouter le  nom, type du catway</li>
                    <li>Cliquer sur ajouter</li>
                </ul>
                <p>Pour ajouter une réservation</p>
                <ul>
                    <li>Ajouter le numéro du catway, nom du client et du catway</li>
                    <li>choisir la date</li>
                    <li>Cliquer sur ajouter</li>
                </ul>
                <p>Modifier/Terminer une réservation</p>
                <ul>
                    <li>Cliquer sur modidier pour modifier la date, le nom...</li>
                    <li>Cliquer sur terminer pour finir la réservation</li>
                </ul>
                
                <p>Pour toute question, contactez-nous.</p>
                <Button className="mt-3" onClick={() => navigate("/")}>Retour à l'accueil</Button>
            </Card>
        </Container>
    );
};

export default Documentation;
