import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from './models.js'; // Assure-toi que ce chemin est correct

dotenv.config();

const router = express.Router();

// 📌 Middleware de vérification du token JWT
export const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'Accès interdit' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token invalide' });
    }
};

// 📌 Route d'inscription (Register) (⚠️ Supprime `authMiddleware` ici)
router.post('/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Cet email est déjà utilisé" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const assignedRole = role === "admin" ? "admin" : "user"; // Vérification du rôle

        const user = new User({ name, email, password: hashedPassword, role: assignedRole });
        await user.save();

        res.status(201).json({ message: 'Utilisateur créé avec succès', user });

    } catch (error) {
        console.error("❌ Erreur lors de l'inscription :", error);
        res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
});

// 📌 Route de connexion (Login)
router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ token, role: user.role });

    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
});
// 📌 Middleware pour vérifier si l'utilisateur est admin
export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ error: "Accès refusé : Administrateur requis" });
    }
    next();
};
export default router;