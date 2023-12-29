require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const database = require('./Database.js');
const VerifyToken = require('./Middlewares/authMiddleware.js')
app.use(express.json());

const reservationsRoutes = require('./Routes/reservations'); 
const registerRoutes = require('./Routes/Register'); 
const AuthRoutes = require('./Routes/Auth'); 
const courtsRoutes = require('./Routes/courts'); 


app.use('/', reservationsRoutes);
app.use('/', registerRoutes);
app.use('/Auth', AuthRoutes);
app.use('/', courtsRoutes);





  // Démarrage du serveur
  const port = process.env.PORT; // Utilisez le port 8000 par défaut
  app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
  });
  