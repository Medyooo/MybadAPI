-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : ven. 29 déc. 2023 à 12:59
-- Version du serveur : 8.0.31
-- Version de PHP : 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `res_badminton`
--

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pseudo` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `admin`
--

INSERT INTO `admin` (`id`, `pseudo`, `password`) VALUES
(1, 'admybad', 'admybad');

-- --------------------------------------------------------

--
-- Structure de la table `courts`
--

DROP TABLE IF EXISTS `courts`;
CREATE TABLE IF NOT EXISTS `courts` (
  `id` char(1) NOT NULL,
  `statut` enum('available','unavailable') NOT NULL DEFAULT 'available',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `courts`
--

INSERT INTO `courts` (`id`, `statut`) VALUES
('A', 'available'),
('B', 'unavailable'),
('C', 'available'),
('D', 'available');

-- --------------------------------------------------------

--
-- Structure de la table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
CREATE TABLE IF NOT EXISTS `reservation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `status` enum('confirmed','canceled') NOT NULL DEFAULT 'confirmed',
  `user_id` int NOT NULL,
  `courts_id` char(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_reservation_user_idx` (`user_id`),
  KEY `fk_reservation_courts1_idx` (`courts_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `reservation`
--

INSERT INTO `reservation` (`id`, `start_time`, `end_time`, `status`, `user_id`, `courts_id`) VALUES
(1, '2023-12-25 10:00:00', '2023-12-25 10:45:00', 'confirmed', 1, 'A'),
(2, '2023-12-26 12:00:00', '2023-12-26 12:45:00', 'confirmed', 2, 'B'),
(3, '2023-12-27 14:00:00', '2023-12-27 14:45:00', 'confirmed', 3, 'C'),
(4, '2023-12-27 21:29:51', '2023-12-27 22:14:51', 'confirmed', 10, 'A'),
(5, '2023-12-27 21:55:42', '2023-12-27 22:40:42', 'confirmed', 10, 'A'),
(6, '2023-12-27 15:00:00', '2023-12-27 15:45:00', 'confirmed', 1, 'C'),
(7, '2023-12-30 14:15:00', '2023-12-30 15:00:00', 'confirmed', 10, 'C'),
(8, '2023-12-29 16:30:00', '2023-12-29 17:15:00', 'canceled', 10, 'D'),
(23, '2024-01-03 18:00:00', '2024-01-03 18:45:00', 'confirmed', 10, 'C'),
(25, '2024-01-05 18:10:00', '2024-01-05 18:55:00', 'confirmed', 10, 'D'),
(26, '2024-01-05 15:30:00', '2024-01-05 16:15:00', 'confirmed', 10, 'D'),
(27, '2023-12-30 17:45:00', '2023-12-30 18:30:00', 'confirmed', 23, 'A');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pseudo` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pseudo_UNIQUE` (`pseudo`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `pseudo`) VALUES
(17, 'arbi'),
(9, 'david54'),
(5, 'hug458'),
(18, 'mahmoud'),
(12, 'manu00'),
(10, 'mar45'),
(21, 'maroc55'),
(16, 'maroua'),
(13, 'marwa'),
(15, 'mbappe7'),
(8, 'med'),
(7, 'med01'),
(4, 'mohamed01'),
(23, 'pogba'),
(22, 'ronaldo'),
(24, 'sabiri'),
(11, 'test1'),
(1, 'utilisateur1'),
(2, 'utilisateur2'),
(3, 'utilisateur3'),
(20, 'waf55'),
(14, 'wafa4'),
(19, 'wafa70'),
(6, 'yassine77');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `fk_reservation_courts1` FOREIGN KEY (`courts_id`) REFERENCES `courts` (`id`),
  ADD CONSTRAINT `fk_reservation_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
