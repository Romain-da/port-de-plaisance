export const isAdmin = (req, res, next) => {
    console.log("👮 Vérification admin :", req.user);

    if (!req.user || req.user.role !== "admin") {
        console.log("Accès refusé : rôle =", req.user ? req.user.role : "aucun");
        return res.status(403).json({ error: "Accès refusé : Administrateur requis" });
    }
    next();
};
