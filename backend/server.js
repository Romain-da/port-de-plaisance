import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes.js";
import catwayRoutes from "./catway.routes.js";
import reservationRoutes from "./reservation.routes.js";
import userRoutes from "./user.routes.js";

dotenv.config();
const app = express();

// Liste des origines autorisées
const allowedOrigins = [
    "http://localhost:3000",  // Développement local
    "https://port-de-plaisance-d81r.onrender.com",  // API Backend Render
    "https://port-de-plaisance-1.onrender.com"  // Frontend Render (Ajouté ici)
];

// Configuration CORS
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`❌ CORS bloqué pour l'origine : ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    credentials: true
};

// Activation de CORS
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Gère les requêtes préflight OPTIONS

// Middleware pour ajouter les en-têtes CORS sur chaque réponse
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return res.status(204).send();
    }

    next();
});

// Middleware JSON
app.use(express.json());

// Connexion MongoDB avec gestion des erreurs
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connexion réussie à MongoDB Atlas"))
    .catch(err => {
        console.error("❌ Erreur de connexion MongoDB :", err);
        process.exit(1);
    });

mongoose.connection.on("error", (err) => {
    console.error("❌ Erreur MongoDB détectée :", err);
});

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/catways", catwayRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/users", userRoutes);

// Route de test
app.get("/api/status", (req, res) => {
    res.json({ message: "🚀 API en ligne et fonctionnelle !" });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error("❌ Erreur serveur :", err.message);
    res.status(500).json({ error: "Erreur interne du serveur" });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur port ${PORT}`));

export default app;
