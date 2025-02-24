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

// Liste des origines autorisées (Frontend)
const allowedOrigins = [
    "http://localhost:3000",  // Dev local
    "https://port-de-plaisance-d81r.onrender.com"  // Frontend en production
];

// Configuration CORS
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`❌ CORS bloqué pour cette origine : ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    credentials: true
};

// Activation CORS
app.use(cors(corsOptions));

// Middleware spécifique pour gérer les requêtes `OPTIONS` (préflight)
app.options("*", cors(corsOptions));

// Forcer les en-têtes CORS sur chaque réponse
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return res.status(204).send(); // Réponse vide avec code 204
    }

    next();
});

// Middleware JSON
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connexion réussie à MongoDB Atlas"))
    .catch(err => console.error("❌ Erreur de connexion MongoDB :", err));

// Vérification que MongoDB est bien connecté avant de lancer le serveur
mongoose.connection.on("error", (err) => {
    console.error("❌ Erreur MongoDB détectée :", err);
});

// Routes API
app.use("/api", authRoutes);
app.use("/api", catwayRoutes);
app.use("/api", reservationRoutes);
app.use("/api", userRoutes);

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error("❌ Erreur serveur :", err.message);
    res.status(500).json({ error: "Erreur interne du serveur" });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur port ${PORT}`));

export default app;
