import express from 'express';
import { Catway } from './models.js';
import { authMiddleware } from './routes.js';

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
router.post('/catways', authMiddleware, async (req, res) => {
    try {
        const catway = new Catway(req.body);
        await catway.save();
        res.status(201).json(catway);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'ajout du catway" });
    }
});

// Supprimer un catway (Protégé)
router.delete('/catways/:id', authMiddleware, async (req, res) => {
    try {
        await Catway.findByIdAndDelete(req.params.id);
        res.json({ message: "Catway supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression du catway" });
    }
});

export default router;