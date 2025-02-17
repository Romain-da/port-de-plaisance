import express from 'express';
import { Reservation } from './models.js';
import { authMiddleware, isAdmin } from './routes.js';

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
router.post('/reservations', authMiddleware, isAdmin, async (req, res) => {
    try {
        const reservation = new Reservation(req.body);
        await reservation.save();
        res.status(201).json(reservation);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'ajout de la réservation" });
    }
});

// Supprimer une réservation (Protégé)
router.delete('/reservations/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        await Reservation.findByIdAndDelete(req.params.id);
        res.json({ message: "Réservation supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression de la réservation" });
    }
});

// 📌 Route pour mettre à jour une réservation (Admin uniquement)
router.put("/reservations/:id", authMiddleware, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🔍 ID reçu pour mise à jour :", id);

        const updatedReservation = await Reservation.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!updatedReservation) {
            return res.status(404).json({ error: "Réservation non trouvée" });
        }

        res.json(updatedReservation);
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

export default router;