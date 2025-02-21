import express from "express";
import bcrypt from "bcryptjs";
import { User } from "./models.js";
import { authMiddleware, isAdmin } from "./routes.js"; // Assure-toi que ces middlewares existent

const router = express.Router();

// Récupérer tous les utilisateurs (Admin uniquement)
router.get("/", authMiddleware, isAdmin, async (req, res) => {
    try {
        const users = await User.find({}, "-password"); // Exclure le mot de passe des résultats
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
    }
});

// Ajouter un utilisateur (Admin uniquement)
router.post("/", authMiddleware, isAdmin, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Cet email est déjà utilisé" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: "Utilisateur créé avec succès", user: newUser });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'ajout de l'utilisateur" });
    }
});

// Supprimer un utilisateur (Admin uniquement)
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur" });
    }
});
router.get("/test", (req, res) => {
    res.send("API User fonctionne !");
});
export default router;
