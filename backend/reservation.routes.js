import express from 'express';
import { Reservation } from './models.js';
import { authMiddleware } from './routes.js';

const router = express.Router();

// Récupérer toutes les réservations
router.get('/reservations', async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des réservations" });
    }
});

// Ajouter une réservation (Protégé)
router.post('/reservations', authMiddleware, async (req, res) => {
    try {
        const reservation = new Reservation(req.body);
        await reservation.save();
        res.status(201).json(reservation);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'ajout de la réservation" });
    }
});

// Supprimer une réservation (Protégé)
router.delete('/reservations/:id', authMiddleware, async (req, res) => {
    try {
        await Reservation.findByIdAndDelete(req.params.id);
        res.json({ message: "Réservation supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression de la réservation" });
    }
});

export default router;