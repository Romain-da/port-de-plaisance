import express from 'express';
import { Catway } from './models.js';
import { authMiddleware, isAdmin } from './routes.js';

const router = express.Router();

// Récupérer tous les catways
router.get('/catways', async (req, res) => {
    try {
        const catways = await Catway.find();
        res.json(catways);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des catways" });
    }
});

// Ajouter un catway (Protégé)
router.post('/catways', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { catwayNumber, catwayName, type, catwayState } = req.body;
        if (!catwayNumber || !catwayName || !type || !catwayState) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires." });
        }

        const catway = new Catway({ catwayNumber, catwayName, type, catwayState });
        await catway.save();
        res.status(201).json(catway);
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout du catway :", error);
        res.status(500).json({ error: "Erreur lors de l'ajout du catway", details: error.message });
    }
});

// Supprimer un catway (Protégé)
router.delete('/catways/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const catway = await Catway.findByIdAndDelete(req.params.id);
        if (!catway) {
            return res.status(404).json({ error: "Catway non trouvé" });
        }
        res.json({ message: "Catway supprimé avec succès" });
    } catch (error) {
        console.error("❌ Erreur lors de la suppression du catway :", error);
        res.status(500).json({ error: "Erreur lors de la suppression du catway" });
    }
});

// Modifier un catway (Admin uniquement)
router.put('/catways/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCatway = await Catway.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedCatway) {
            return res.status(404).json({ error: "Catway non trouvé" });
        }

        res.json(updatedCatway);
    } catch (error) {
        console.error("❌ Erreur lors de la modification du catway :", error);
        res.status(500).json({ error: "Erreur lors de la modification du catway" });
    }
});

export default router;
