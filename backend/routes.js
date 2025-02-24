import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User, Catway } from "./models.js";

dotenv.config();
const router = express.Router();

// Middleware d'authentification (Vérifie le token JWT)
export const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        console.log("⛔ Accès interdit - Aucun token fourni !");
        return res.status(403).json({ error: "Accès interdit" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("⛔ Token invalide :", error.message);
        res.status(401).json({ error: "Token invalide" });
    }
};

// Middleware pour vérifier si l'utilisateur est admin
export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        console.log("⛔ Accès refusé : rôle =", req.user ? req.user.role : "aucun");
        return res.status(403).json({ error: "Accès refusé : Administrateur requis" });
    }
    next();
};

// Route de connexion (Login)
router.post("/login", async (req, res) => {
    try {
        console.log("🔑 Tentative de connexion :", req.body.email);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email et mot de passe requis." });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: "Email ou mot de passe incorrect" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Email ou mot de passe incorrect" });

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, role: user.role });
    } catch (error) {
        console.error("❌ Erreur lors de la connexion :", error.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Route d'inscription (Register)
router.post("/register", async (req, res) => {
    try {
        console.log("📝 Inscription :", req.body);
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) return res.status(400).json({ error: "Tous les champs sont obligatoires." });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Cet email est déjà utilisé." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role: role || "user" });
        await newUser.save();

        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        console.error("❌ Erreur lors de l'inscription :", error.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Route pour récupérer tous les utilisateurs (Admin)
router.get("/users", authMiddleware, isAdmin, async (req, res) => {
    try {
        const users = await User.find({}, "-password");
        res.json(users);
    } catch (error) {
        console.error("❌ Erreur récupération utilisateurs :", error.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Route pour ajouter un Catway (Admin)
router.post("/catways", authMiddleware, isAdmin, async (req, res) => {
    try {
        console.log("⚓ Ajout d'un catway :", req.body);
        const catway = new Catway(req.body);
        await catway.save();
        res.status(201).json(catway);
    } catch (error) {
        console.error("❌ Erreur ajout catway :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

export default router;
