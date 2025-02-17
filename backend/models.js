import mongoose from 'mongoose';

// Modèle utilisateur avec rôle
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" } // Ajout du rôle
  });
  
  export const User = mongoose.model("User", UserSchema);

// Modèle des Catways
const CatwaySchema = new mongoose.Schema({
    catwayNumber: { type: Number, required: true, unique: true },
    type: { type: String, enum: ['long', 'short'], required: true },
    catwayState: { type: String, required: true }
});
export const Catway = mongoose.model('Catway', CatwaySchema);

// Modèle des Réservations
const ReservationSchema = new mongoose.Schema({
    catwayNumber: { type: Number, required: true },
    clientName: { type: String, required: true },
    boatName: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true }
});
export const Reservation = mongoose.model('Reservation', ReservationSchema);

