import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from './models.js'; // Assure-toi que User est bien défini dans models.js
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// 📌 Route d'inscription (Register)
router.post('/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Cet email est déjà utilisé" });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });

        // Sauvegarde dans la base de données
        await user.save();
        res.status(201).json({ message: 'Utilisateur créé avec succès' });

    } catch (error) {
        console.error("❌ Erreur lors de l'inscription :", error); // Log de l'erreur
        res.status(500).json({ error: "Erreur lors de l'inscription", details: error.message });
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

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
});

// 📌 Middleware de vérification du token JWT
export const authMiddleware = (req, res, next) => {
    console.log("🔍 Headers reçus :", req.headers); // Ajout du log pour voir tous les headers

    const authHeader = req.header('Authorization'); // Vérifie bien la majuscule "Authorization"
    console.log("🔍 Header Authorization :", authHeader);

    if (!authHeader) {
        return res.status(403).json({ error: 'Accès interdit (Aucun token reçu)' });
    }

    const token = authHeader.split(' ')[1]; // Extraire le token après "Bearer"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("✅ Token décodé :", decoded);
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalide' });
    }
};

router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: "✅ Accès autorisé", user: req.user });
});

export default router;