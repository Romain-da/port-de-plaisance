import express from 'express';
import { Reservation } from './models.js';
import { authMiddleware, isAdmin } from './routes.js';
import { Catway } from "./models.js";

const router = express.Router();

// Récupérer toutes les réservations
router.get('/reservations', async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (error) {
        console.error("Erreur lors de la récupération des réservations :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des réservations" });
    }
});

// Ajouter une réservation (Protégé)
router.post('/reservations', authMiddleware, async (req, res) => {
    try {
        const { catwayNumber, clientName, boatName, checkIn, checkOut } = req.body;

        // Vérifier si le catway existe
        const catway = await Catway.findOne({ catwayNumber });
        if (!catway) {
            return res.status(400).json({ error: "Le catway sélectionné n'existe pas." });
        }

        // Vérifier si le catway est disponible
        if (catway.catwayState !== "disponible") {
            return res.status(400).json({ error: "Le catway n'est pas disponible." });
        }

        // Créer la réservation
        const reservation = new Reservation({ catwayNumber, clientName, boatName, checkIn, checkOut });
        await reservation.save();

        // Mettre à jour l'état du catway en "occupé"
        catway.catwayState = "occupé";
        await catway.save();

        res.status(201).json(reservation);
    } catch (error) {
        console.error("Erreur lors de l'ajout de la réservation :", error);
        res.status(500).json({ error: "Erreur lors de l'ajout de la réservation" });
    }
});

// Supprimer une réservation (Protégé)
router.delete('/reservations/:id', authMiddleware, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ error: "Réservation non trouvée" });
        }

        // Libérer le catway en le remettant à "disponible"
        const catway = await Catway.findOne({ catwayNumber: reservation.catwayNumber });
        if (catway) {
            catway.catwayState = "disponible";
            await catway.save();
        }

        // Supprimer la réservation
        await reservation.deleteOne();
        res.json({ message: "Réservation supprimée et catway libéré" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression de la réservation" });
    }
});

// Mettre à jour une réservation (Admin uniquement)
router.put("/reservations/:id", authMiddleware, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🔍 ID reçu pour mise à jour :", id);

        const updatedReservation = await Reservation.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedReservation) {
            return res.status(404).json({ error: "Réservation non trouvée" });
        }

        res.json(updatedReservation);
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

router.put('/reservations/:id/finish', authMiddleware, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ error: "Réservation non trouvée" });
        }

        // Libérer le catway
        const catway = await Catway.findOne({ catwayNumber: reservation.catwayNumber });
        if (catway) {
            catway.catwayState = "disponible";
            await catway.save();
        }

        res.json({ message: "Réservation terminée et catway libéré" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la validation de la fin de la réservation" });
    }
});

// Route pour terminer une réservation (Admin uniquement)
router.put("/reservations/:id/finish", authMiddleware, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findById(id);
        if (!reservation) {
            return res.status(404).json({ error: "Réservation non trouvée" });
        }

        // Remettre le catway en disponible
        await Catway.findOneAndUpdate(
            { catwayNumber: reservation.catwayNumber },
            { catwayState: "disponible" }
        );

        await Reservation.findByIdAndDelete(id);

        res.json({ message: "Réservation terminée et catway libéré" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la fin de la réservation" });
    }
});

export default router;
