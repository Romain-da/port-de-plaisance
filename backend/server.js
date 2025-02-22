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

//Configuration stricte de CORS
const corsOptions = {
  origin: [
    "http://localhost:3000", // Dev local
    "https://port-de-plaisance-d81r.onrender.com" // Frontend en production
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true, // Permet l'envoi des cookies et headers d'authentification
};

// Activation globale de CORS
app.use(cors(corsOptions));

//Middleware spécifique pour forcer CORS sur les requêtes `OPTIONS`
app.options("*", cors(corsOptions));

//Middleware pour forcer les en-têtes CORS sur toutes les requêtes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  //Répondre immédiatement aux requêtes préflight `OPTIONS`
  if (req.method === "OPTIONS") {
    return res.status(200).send();
  }

  next();
});

//Middleware JSON
app.use(express.json());

//Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion réussie à MongoDB Atlas"))
  .catch((err) => console.error("Erreur de connexion à MongoDB :", err));

//Déclaration des routes API
app.use("/api", authRoutes);
app.use("/api", catwayRoutes);
app.use("/api", reservationRoutes);
app.use("/api", userRoutes);

//Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));

export default app;
