const express = require('express');
const router = express.Router();
const db = require('../Database.js'); // Assurez-vous que le chemin est correct
const VerifyToken = require('../Middlewares/authMiddleware.js')




// Route GET pour récupérer la liste des courts
router.get('/courts', async (req, res) => {
    const sql = 'SELECT * FROM courts'; 
    try {
        const [results] = await db.query(sql);
        res.json({ data: results });
    } catch (error) {
        console.error('Erreur lors de la récupération des courts:', error);
        res.status(500).json({ message: "Erreur lors de la récupération des courts", error: error.message });
    }
});

// Route PATCH pour mettre à jour l'état d'un terrain
router.patch('/courts/:id',VerifyToken, async (req, res) => {
    const { id } = req.params;
    const { newState } = req.body;  // L'état mis à jour devrait être envoyé dans le corps de la requête
  
    // Vérifier si le nouvel état est valide
    if (!['available', 'unavailable'].includes(newState)) {
        return res.status(400).json({ error: 'État fourni invalide. Les états valides sont "available" et "unavailable".' });
    }
  
    try {
        const [result] = await db.query('UPDATE courts SET statut = ? WHERE id = ?', [newState, id]);
  
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Terrain non trouvé ou pas de changement d'état." });
        }
  
        return res.status(200).json({ message: `Statut du court ${id} mis à jour avec succès.`, courtId: id, newStatus: newState });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du terrain:', error);
        return res.status(500).json({ error: 'Erreur lors de la mise à jour du terrain.' });
    }
  });

module.exports = router;