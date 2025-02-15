import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes.js'; // Importation des routes
import catwayRoutes from './catway.routes.js';
import reservationRoutes from './reservation.routes.js';

dotenv.config();
const app = express();

// 📌 Middlewares
app.use(cors());
app.use(express.json());

// 📌 Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connexion réussie à MongoDB Atlas !'))
  .catch(err => console.error('❌ Erreur de connexion à MongoDB :', err));

// 📌 Déclaration des routes API
app.use('/api', authRoutes);
app.use('/api', catwayRoutes);
app.use('/api', reservationRoutes);

// 📌 Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));
