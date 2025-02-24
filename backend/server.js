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

// Définition des origines autorisées
const allowedOrigins = [
  "http://localhost:3000", // Frontend local
  "https://port-de-plaisance-d81r.onrender.com" // Frontend déployé
];

// Configuration stricte de CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Autoriser l'accès
    } else {
      console.error("❌ Origine non autorisée par CORS :", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true // Permet l'envoi des cookies et headers d'authentification
};

// Activation CORS globalement
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Gestion des requêtes préflight `OPTIONS`

// Middleware global pour forcer les en-têtes CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Middleware JSON
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connexion réussie à MongoDB Atlas"))
  .catch((err) => console.error("❌ Erreur de connexion à MongoDB :", err));

// Déclaration des routes API
app.use("/api", authRoutes);
app.use("/api", catwayRoutes);
app.use("/api", reservationRoutes);
app.use("/api", userRoutes);

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error("❌ Erreur serveur :", err.message);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || "development"}`);
});

export default app;
