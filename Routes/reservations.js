const express = require('express');
const router = express.Router();
const db = require('../Database.js'); // Assurez-vous que le chemin est correct
const path = require('path');
router.use(express.urlencoded({extended: true}));
router.use(express.static(path.join(__dirname, '/../Views')))

router.get('/reservations', (req, res) => {
   res.sendFile(path.join(__dirname + '/../Views/reserve.html'));
});

router.get('/reservations/all', async (req, res) => {
    const sql = 'SELECT pseudo, reservation.id ,courts_id, status, start_time, end_time FROM user join reservation using (id) order by reservation.id ASC'; // Votre requête SQL pour récupérer toutes les réservations
    try {
        const [results] = await db.query(sql);
        res.json({ data: results });
    } catch (error) {
        console.error('Erreur lors de la récupération des réservations :', error);
        res.status(500).json({ message: "Erreur lors de la récupération des réservations", error: error.message });
    }
});

router.post('/reservations', async (req, res) => {
    const { courtId, startTime, pseudo } = req.body;
  
    try {
      // Vérifier si l'heure de début est entre 10h et 22h
      const startDateTime = new Date(startTime);
      const startHour = startDateTime.getHours();
  
      if (startHour < 10 || startHour >= 22) {
        return res.status(400).send('Les réservations ne sont autorisées qu\'entre 10h et 22h.');
      }
  
      // Vérifier si le court est disponible
      const courtStatusSql = 'SELECT statut FROM courts WHERE id = ?';
      const [courtStatusResults, courtStatusFields] = await db.execute(courtStatusSql, [courtId]);
  
      if (courtStatusResults.length > 0) {
        const courtStatus = courtStatusResults[0].statut; // Utilisez "statut" au lieu de "status"
        if (courtStatus !== 'available') {
          return res.status(400).send('Le court sélectionné n\'est pas disponible.');
        }
      } else {
        return res.status(400).send('Court introuvable.');
      }
  
            // Vérifiez si la réservation est pour la semaine en cours
        const currentDate = new Date();
        const currentWeek = getWeekNumber(currentDate); // Fonction pour obtenir le numéro de semaine

        const reservationWeek = getWeekNumber(startDateTime);

        if (reservationWeek !== currentWeek) {
        return res.status(400).send('Les réservations ne sont autorisées que pour la semaine en cours.');
        }
        
      // Récupérer les réservations existantes pour ce court
      const existingReservationsSql = 'SELECT * FROM reservation WHERE courts_id = ?';
      const [existingReservations, existingReservationsFields] = await db.execute(existingReservationsSql, [courtId]);
  
      // Vérifier s'il y a un chevauchement avec une réservation existante
      const reservationStartTime = new Date(startDateTime);
      const reservationEndTime = new Date(startDateTime);
      reservationEndTime.setMinutes(reservationEndTime.getMinutes() + 45);
  
      for (const reservation of existingReservations) {
        const existingStartTime = new Date(reservation.start_time);
        const existingEndTime = new Date(reservation.end_time);
  
        if (
          (reservationStartTime >= existingStartTime && reservationStartTime < existingEndTime) ||
          (reservationEndTime > existingStartTime && reservationEndTime <= existingEndTime)
        ) {
          return res.status(400).send('Ce court est déjà réservé pour cette période.');
        }
      }
  
      // Récupérer l'ID de l'utilisateur à partir de son pseudo en utilisant une requête SQL
      const sql = 'SELECT id FROM user WHERE pseudo = ?';
      const [results, fields] = await db.execute(sql, [pseudo]);
  
      if (results.length > 0) {
        // L'utilisateur existe, récupérez son ID
        const userId = results[0].id;
  
        // Insérer la réservation dans la base de données avec l'ID de l'utilisateur
        const insertSql = 'INSERT INTO reservation (start_time, end_time, user_id, courts_id) VALUES (?, ?, ?, ?)';
        const [insertResult, insertFields] = await db.execute(insertSql, [startDateTime, reservationEndTime, userId, courtId]);
  
        console.log('Réservation ajoutée avec succès.');
        res.status(201).send('Réservation ajoutée avec succès.');
      } else {
        // L'utilisateur n'existe pas
        res.status(401).send('Utilisateur non trouvé. Veuillez vous connecter.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réservation :', error);
      res.status(500).send('Erreur lors de l\'ajout de la réservation.');
    }
  });

  function getWeekNumber(date) {
    const currentDate = new Date(date);
    currentDate.setHours(0, 0, 0, 0);
    currentDate.setDate(currentDate.getDate() + 3 - (currentDate.getDay() + 6) % 7);
    const week1 = new Date(currentDate.getFullYear(), 0, 4);
    return 1 + Math.round(((currentDate - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }

// Modifier le statut d'une réservation par ID
router.patch('/reservations/:id' ,async (req, res) => {
    const reservationId = req.params.id;
    const newStatus = req.body.newStatus; // Supposons que vous envoyez le nouveau statut dans le corps de la requête JSON.

    try {
        // Mettez à jour le statut de la réservation en fonction de reservationId
        // Vous devrez implémenter la mise à jour dans votre base de données ici.

        // Exemple (utilisant des commentaires pour simuler l'exécution de la requête) :
        
        const updateSql = 'UPDATE reservation SET status = ? WHERE id = ?';
        await db.execute(updateSql, [newStatus, reservationId]);
        

        // Si la mise à jour réussit, vous pouvez renvoyer une réponse JSON indiquant le succès.
        res.json({ message: 'Statut de la réservation mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut de la réservation :', error);
        // Si une erreur survient lors de la mise à jour, renvoyez une réponse d'erreur avec un code 500.
        res.status(500).json({ message: 'Erreur lors de la mise à jour du statut de la réservation' });
    }
});

// Supprimer une réservation par ID
router.delete('/reservations/:id' , async (req, res) => {
    const reservationId = req.params.id;

    try {
        // Effectuez la suppression de la réservation en fonction de reservationId
        // Vous devrez implémenter la suppression dans votre base de données ici.

        // Exemple (utilisant des commentaires pour simuler l'exécution de la requête) :
        
        const deleteSql = 'DELETE FROM reservation WHERE id = ?';
        await db.execute(deleteSql, [reservationId]);

        // Si la suppression réussit, vous pouvez renvoyer une réponse JSON indiquant le succès.
        res.json({ message: 'Réservation supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la réservation :', error);
        // Si une erreur survient lors de la suppression, renvoyez une réponse d'erreur avec un code 500.
        res.status(500).json({ message: 'Erreur lors de la suppression de la réservation' });
    }
});


  router.get('/courts/:id/reservations' ,async (req, res) => {
    const courtId = req.params.id;

    try {
        // Récupérer les réservations pour le court spécifié (courtId) depuis votre base de données
        const reservationsSql = 'SELECT pseudo, reservation.id ,courts_id, status, start_time, end_time FROM user join reservation using (id) WHERE courts_id = ?';
        const [reservations, fields] = await db.execute(reservationsSql, [courtId]);

        // Afficher les réservations sous forme de réponse JSON ou HTML, selon vos besoins
        res.json({ reservations });
        // ou
        // res.render('reservations', { reservations }); // Utilisez votre moteur de modèle

    } catch (error) {
        console.error('Erreur lors de la récupération des réservations :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des réservations' });
    }

 });
  
module.exports = router;