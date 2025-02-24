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

// Configuration CORS
const allowedOrigins = [
    "http://localhost:3000",  // Dev local
    "https://port-de-plaisance-d81r.onrender.com"  // Frontend en production
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    credentials: true
}));

// Middleware JSON
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connexion réussie à MongoDB Atlas"))
    .catch(err => console.error("❌ Erreur de connexion MongoDB :", err));

// Routes API
app.use("/api", authRoutes);
app.use("/api", catwayRoutes);
app.use("/api", reservationRoutes);
app.use("/api", userRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur port ${PORT}`));

export default app;
