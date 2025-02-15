import express from 'express';
import { Reservation } from './models.js';
import { authMiddleware } from './routes.js';

const router = express.Router();

// 📌 Récupérer toutes les réservations
router.get('/reservations', async (req, res) => {
    const reservations = await Reservation.find();
    res.json(reservations);
});

// 📌 Ajouter une réservation (Protégé)
router.post('/reservations', authMiddleware, async (req, res) => {
    try {
        const reservation = new Reservation(req.body);
        await reservation.save();
        res.status(201).json(reservation);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'ajout de la réservation" });
    }
});

export default router;