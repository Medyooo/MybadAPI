const express = require('express');
const router = express.Router();
const db = require('../Database.js'); // Assurez-vous que le chemin est correct
const path = require('path');
const jwt = require('jsonwebtoken');


router.use(express.urlencoded({extended: true}));
router.use(express.static(path.join(__dirname, '/../Views')))


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../Views/auth.html'));
 });
 router.get('/AdminPage',(req, res) => {
    res.sendFile(path.join(__dirname + '/../Views/admin.html'));
 });

// Clé secrète pour signer les JWT
const SECRET =  process.env.SECRET;

// Route pour l'authentification et la fourniture d'un JWT
router.post('/', async (req, res) => {
    const { pseudo, password } = req.body;

    if (!pseudo || !password) {
        return res.status(400).json({ message: 'Pseudo et mot de passe sont requis' });
    }

    try {
        // Utilisation de votre requête pour vérifier le pseudo et le mot de passe
        const [rows] = await db.query('SELECT pseudo FROM admin WHERE pseudo = ? AND password = ?', [pseudo, password]);

        if (rows.length > 0) {
            const user = rows[0];
            const token = jwt.sign({
                pseudo: user.pseudo
            }, SECRET, { expiresIn: 120 }); // Token valide pour 2min
           
            // Envoyer une réponse HTML
            return res.status(200).send(`
                <html>
                <body>
                    <p>Connexion réussie! Bienvenue, ${pseudo}</p>
                    <a href="/Auth/AdminPage">Admin Page</a>
                </body>
                </html>
            `);
            

        } else {
            return res.status(401).json({ message: 'Pseudo ou mot de passe incorrect' });
        }
    } catch (error) {
        console.error("Erreur lors de l'authentification:", error);
        return res.status(500).json({ "msg": "Erreur interne du serveur", "error": error.message });
    }
});



module.exports = router;