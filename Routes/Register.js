const express = require('express');
const router = express.Router();
const db = require('../Database.js'); // Assurez-vous que le chemin est correct
const path = require('path');
router.use(express.urlencoded({extended: true}));
router.use(express.static(path.join(__dirname, '/../Views')))



router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../Views/register.html'));
 });

// Route POST pour l'inscription
router.post('/register', async (req, res) => {
    const { username } = req.body;

    try {
        // Vérifier si le pseudo existe déjà
        const [users] = await db.query('SELECT * FROM user WHERE pseudo = ?', [username]);
      
        if (users.length > 0) {
            return res.status(409).json({ message: 'Ce pseudo est déjà pris.' });
        }
      
        // Insérer l'utilisateur dans la base de données
        const [insertResult] = await db.query('INSERT INTO user (pseudo) VALUES (?)', [username]);
        if (insertResult.affectedRows === 0) {
            throw new Error("L'insertion n'a pas fonctionné");
        }
        
        res.status(201).send(` <html>
            <body>
              <p>Utilisateur créé avec succès! Cliquez ci-dessous pour voir la liste des courts disponibles.</p>
              <a href="/reservations">Ajouter une reservation</a>
            </body>
          </html>`);
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ message: 'Erreur lors de la vérification du pseudo ou de la création de l’utilisateur.' });
    }
});

module.exports = router;