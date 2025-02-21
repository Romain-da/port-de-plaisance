import express from 'express';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from './models.js';
import { Catway } from './models.js';

dotenv.config();

const router = express.Router();

// Middleware de vérification du token JWT
export const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        console.log("Accès interdit - Aucun token fourni !");
        return res.status(403).json({ error: 'Accès interdit' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Token invalide :", error.message);
        res.status(401).json({ error: 'Token invalide' });
    }
};

// Route d'inscription (Register)
router.post('/auth/register', async (req, res) => {
    try {
        console.log("Données reçues pour inscription :", req.body);
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Cet email est déjà utilisé." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const assignedRole = role === "admin" ? "admin" : "user";

        const user = new User({ name, email, password: hashedPassword, role: assignedRole });
        await user.save();

        res.status(201).json({ message: 'Utilisateur créé avec succès', user });

    } catch (error) {
        console.error("Erreur lors de l'inscription :", error.message);
        res.status(500).json({ error: "Erreur lors de l'inscription", details: error.message });
    }
});

// Route de connexion (Login)
router.post('/auth/login', async (req, res) => {
    try {
        console.log("Tentative de connexion :", req.body.email);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email et mot de passe requis." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log("Utilisateur non trouvé !");
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Mot de passe incorrect !");
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ token, role: user.role });

    } catch (error) {
        console.error("Erreur lors de la connexion :", error.message);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
});

// Middleware pour vérifier si l'utilisateur est admin
export const isAdmin = (req, res, next) => {
    console.log("🔍 Vérification admin :", req.user);

    if (!req.user || req.user.role !== "admin") {
        console.log("Accès refusé : rôle =", req.user ? req.user.role : "aucun");
        return res.status(403).json({ error: "Accès refusé : Administrateur requis" });
    }
    next();
};

// Récupérer tous les utilisateurs (Admin uniquement)
router.get("/users", authMiddleware, isAdmin, async (req, res) => {
    try {
        const users = await User.find({}, "-password"); // Exclure le mot de passe des résultats
        res.json(users);
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error.message);
        res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
    }
});

// Ajouter un utilisateur (Admin uniquement)
router.post("/users", authMiddleware, isAdmin, async (req, res) => {
    try {
        console.log("Données reçues pour ajout d'utilisateur :", req.body);
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Cet email est déjà utilisé." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur :", error.message);
        res.status(500).json({ error: "Erreur lors de l'ajout de l'utilisateur" });
    }
});

// Supprimer un utilisateur (Admin uniquement)
router.delete("/users/:id", authMiddleware, isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé." });
        }

        res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur :", error.message);
        res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur" });
    }
});


router.post('/catways', authMiddleware, isAdmin, async (req, res) => {
    try {
        console.log("Données reçues pour ajout de catway :", req.body); // Ajout du log

        const catway = new Catway(req.body);
        await catway.save();
        res.status(201).json(catway);
    } catch (error) {
        console.error("Erreur lors de l'ajout du catway :", error);
        res.status(500).json({ error: "Erreur lors de l'ajout du catway", details: error.message });
    }
});
export default router;
