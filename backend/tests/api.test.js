import chai from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";

const { expect } = chai;
chai.use(chaiHttp);

describe("API Tests", () => {
    let authToken = "";
    let adminUserId = ""; // Variable pour stocker l'ID utilisateur
    let testAdminEmail = `admin${Date.now()}@example.com`; // Génération d'un email unique

    it("Devrait inscrire un administrateur", (done) => {
        chai.request(app)
            .post("/api/auth/register")
            .send({ name: "Admin User", email: testAdminEmail, password: "123456", role: "admin" })
            .end((err, res) => {
                console.log("📩 Réponse Inscription :", res.body);
                expect(res).to.have.status(201);
                expect(res.body).to.have.property("user");

                adminUserId = res.body.user._id; // Stocke l'ID utilisateur
                done();
            });
    });

    // Test de connexion
    it("Devrait connecter un utilisateur", (done) => {
        chai.request(app)
            .post("/api/auth/login")
            .send({ email: testAdminEmail, password: "123456" })
            .end((err, res) => {
                console.log("📩 Réponse connexion :", res.body);
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("token");

                authToken = res.body.token; // 🔑 Stocke le token
                done();
            });
    });

    // Test récupération des catways
    it("Devrait récupérer tous les catways", (done) => {
        chai.request(app)
            .get("/api/catways")
            .set("Authorization", `Bearer ${authToken}`)
            .end((err, res) => {
                console.log("📩 Réponse récupération catways :", res.body);
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("array");
                done();
            });
    });

    // Test ajout de catway (Admin)
    it("Devrait ajouter un catway (admin)", (done) => {
        chai.request(app)
            .post("/api/catways")
            .set("Authorization", `Bearer ${authToken}`) // 🔑 Ajout du token
            .send({ catwayNumber: 10, catwayName: "Test Catway", type: "long", catwayState: "disponible" }) // ✅ Ajout de catwayName
            .end((err, res) => {
                console.log("📩 Réponse ajout catway :", res.body);
                expect(res).to.have.status(201);
                expect(res.body).to.have.property("catwayNumber").eql(10);
                expect(res.body).to.have.property("catwayName").eql("Test Catway"); // ✅ Vérification du nom
                done();
            });
    });

    // Test récupération des réservations
    it("Devrait récupérer toutes les réservations", (done) => {
        chai.request(app)
            .get("/api/reservations")
            .set("Authorization", `Bearer ${authToken}`)
            .end((err, res) => {
                console.log("📩 Réponse récupération réservations :", res.body);
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("array");
                done();
            });
    });

    // Test suppression d'un utilisateur (Admin)
    it("Devrait supprimer un utilisateur (admin)", (done) => {
        if (!adminUserId) {
            console.log("❌ Erreur : Aucun ID utilisateur disponible pour suppression.");
            return done(new Error("adminUserId non défini"));
        }

        chai.request(app)
            .delete(`/api/users/${adminUserId}`) // 🔥 Utilisation de l'ID réel
            .set("Authorization", `Bearer ${authToken}`)
            .end((err, res) => {
                console.log("📩 Réponse suppression utilisateur :", res.body);
                expect(res).to.have.status(200); // `200` si succès, `500` si erreur
                done();
            });
    });
});
