
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST, // L'adresse du serveur MySQL
  user: process.env.DB_USER, // Votre nom d'utilisateur MySQL
  password: process.env.DB_PASSWORD, // Votre mot de passe MySQL
  database: process.env.DB_DATABASE, // Le nom de votre base de données
});

// Vous n'avez pas besoin de connecter explicitement le pool de connexion.
// Lorsque vous faites une requête, le pool gère les connexions pour vous.

module.exports = pool;