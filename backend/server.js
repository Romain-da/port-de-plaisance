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

// 🔹 Définition des URLs autorisées (dev et prod)
const FRONTEND_URLS = [
  "http://localhost:3000", // Dev local
  "https://port-de-plaisance-d81r.onrender.com" // Frontend en production
];

// Configuration CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || FRONTEND_URLS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS non autorisé"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true, // Permet l'envoi des cookies et tokens
};

// Activation de CORS avec options
app.use(cors(corsOptions));

// Middleware spécifique pour forcer CORS sur `OPTIONS`
app.options("*", cors(corsOptions));

// Middleware pour ajouter les en-têtes CORS à chaque requête
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (FRONTEND_URLS.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  // Gérer les requêtes préflight `OPTIONS`
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Connexion MongoDB avec gestion des erreurs
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion réussie à MongoDB Atlas"))
  .catch((err) => {
    console.error("Erreur de connexion à MongoDB :", err);
    process.exit(1); // Arrête le serveur en cas d'erreur critique
  });

// Déclaration des routes API
app.use("/api", authRoutes);
app.use("/api", catwayRoutes);
app.use("/api", reservationRoutes);
app.use("/api", userRoutes);

// 🚀 Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT} ou en production`));

export default app;