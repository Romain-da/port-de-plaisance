import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes.js'; // Importation des routes
import catwayRoutes from './catway.routes.js';
import reservationRoutes from './reservation.routes.js';

dotenv.config();
const app = express();


app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  credentials: true
}));

// Middleware global pour s'assurer que les bonnes règles CORS sont appliquées
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // Gérer les pré-vérifications CORS
  }
  next();
});

// Middleware pour parser le JSON
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connexion réussie à MongoDB Atlas !'))
  .catch(err => console.error(' Erreur de connexion à MongoDB :', err));

// Déclaration des routes API
app.use('/api', authRoutes);
app.use('/api', catwayRoutes);
app.use('/api', reservationRoutes);

//  Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));
