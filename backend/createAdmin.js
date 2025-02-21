import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "./models.js"; // Vérifie que ton modèle User est bien importé

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connexion réussie à MongoDB");

        const existingAdmin = await User.findOne({ email: "admin@example.com" });
        if (existingAdmin) {
            console.log("L'administrateur existe déjà !");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash("admin1234", 10);

        const admin = new User({
            name: "Admin",
            email: "admin@example.com",
            password: hashedPassword,
            role: "admin",
        });

        await admin.save();
        console.log("Administrateur créé avec succès !");
        process.exit(0);
    } catch (error) {
        console.error("Erreur lors de la création de l'Admin :", error);
        process.exit(1);
    }
};

createAdmin();