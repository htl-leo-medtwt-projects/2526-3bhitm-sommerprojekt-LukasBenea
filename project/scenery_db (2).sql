-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Erstellungszeit: 15. Jun 2026 um 23:47
-- Server-Version: 10.4.28-MariaDB
-- PHP-Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `scenery_db`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cities`
--

CREATE TABLE `cities` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `country` varchar(100) NOT NULL,
  `continent` enum('Europe','Asia','America','Africa','Oceania') NOT NULL,
  `description` text DEFAULT NULL,
  `hero_image` varchar(255) DEFAULT NULL,
  `population` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `cities`
--

INSERT INTO `cities` (`id`, `name`, `country`, `continent`, `description`, `hero_image`, `population`, `created_at`, `latitude`, `longitude`) VALUES
(1, 'Vienna', 'Austria', 'Europe', 'The capital of Austria, known for its imperial architecture and vibrant cultural scene.', 'vienna.jpg', 1900000, '2026-04-20 18:22:43', 48.2082000, 16.3738000),
(2, 'New York', 'USA', 'America', 'The city that never sleeps, home to iconic landmarks and diverse neighborhoods.', 'newYork.jpg', 8400000, '2026-04-20 18:22:43', 40.7128000, -74.0060000),
(3, 'Tokyo', 'Japan', 'Asia', 'A bustling metropolis blending ultramodern and traditional culture.', 'tokyo.jpg', 13960000, '2026-04-20 18:22:43', 35.6762000, 139.6503000),
(4, 'Sydney', 'Australia', 'Oceania', 'Known for its stunning harbour and iconic Opera House.', 'sydney.jpg', 5300000, '2026-04-20 18:22:43', -33.8688000, 151.2093000),
(5, 'Nairobi', 'Kenya', 'Africa', 'A vibrant city and gateway to some of Africa\'s best wildlife reserves.', 'nairobi.jpg', 4400000, '2026-04-20 18:22:43', -1.2921000, 36.8219000),
(6, 'Paris', 'France', 'Europe', 'The city of light, known for its iconic Eiffel Tower, world-class cuisine and romantic atmosphere.', 'paris.jpg', 2161000, '2026-04-21 08:12:44', 48.8566000, 2.3522000),
(7, 'Barcelona', 'Spain', 'Europe', 'A vibrant Mediterranean city famous for its unique architecture, beaches and lively culture.', 'barcelona.jpg', 1620000, '2026-04-21 08:12:44', 41.3851000, 2.1734000),
(8, 'Dubai', 'UAE', 'Asia', 'A futuristic desert metropolis that rose from the sands to become one of the worlds most iconic skylines.', 'dubai.jpg', 3331000, '2026-04-21 08:12:44', 25.2048000, 55.2708000),
(9, 'London', 'UK', 'Europe', 'A timeless city blending centuries of history with a cutting-edge modern culture and skyline.', 'london.jpg', 8982000, '2026-04-21 08:12:44', 51.5074000, -0.1278000),
(10, 'Singapore', 'Singapore', 'Asia', 'A stunning city-state where futuristic architecture meets lush tropical greenery.', 'singapore.jpg', 5850000, '2026-04-21 08:12:44', 1.3521000, 103.8198000),
(11, 'Cairo', 'Egypt', 'Africa', 'One of the worlds oldest cities, home to ancient wonders and a buzzing modern metropolis.', 'cairo.jpg', 21323000, '2026-04-21 08:12:44', 30.0444000, 31.2357000);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `city_of_week`
--

CREATE TABLE `city_of_week` (
  `id` int(11) NOT NULL,
  `city_id` int(11) NOT NULL,
  `week_start` date NOT NULL,
  `week_end` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `collections`
--

CREATE TABLE `collections` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `collections`
--

INSERT INTO `collections` (`id`, `user_id`, `name`, `description`, `created_at`) VALUES
(5, 6, 'Cool', '', '2026-05-06 07:22:23');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `collection_photos`
--

CREATE TABLE `collection_photos` (
  `id` int(11) NOT NULL,
  `collection_id` int(11) NOT NULL,
  `photo_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `collection_photos`
--

INSERT INTO `collection_photos` (`id`, `collection_id`, `photo_id`) VALUES
(19, 5, 6),
(94, 5, 8),
(96, 5, 10),
(97, 5, 15);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `photo_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `likes`
--

INSERT INTO `likes` (`id`, `user_id`, `photo_id`, `created_at`) VALUES
(10, 1, 2, '2026-05-05 05:58:47'),
(11, 1, 3, '2026-05-05 05:59:03'),
(24, 19, 11, '2026-06-01 19:48:13'),
(29, 6, 8, '2026-06-02 07:42:38'),
(42, 6, 4, '2026-06-02 10:12:48'),
(44, 6, 5, '2026-06-02 10:17:20'),
(54, 6, 1, '2026-06-02 11:18:02'),
(65, 6, 10, '2026-06-02 11:36:35'),
(70, 6, 11, '2026-06-02 12:46:25'),
(72, 6, 3, '2026-06-02 12:46:34'),
(74, 6, 2, '2026-06-13 21:33:10'),
(75, 6, 15, '2026-06-15 20:07:34');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `photos`
--

CREATE TABLE `photos` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `city_id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `title` varchar(150) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `year_taken` year(4) DEFAULT NULL,
  `exif_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`exif_data`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `photos`
--

INSERT INTO `photos` (`id`, `user_id`, `city_id`, `image_path`, `title`, `description`, `year_taken`, `exif_data`, `created_at`) VALUES
(1, 2, 3, 'tokyo1.jpg', 'Tokyo at Night', 'A beautiful picture of Tokyos skyline at night', '2024', '{\"camera\": \"Sony Alpha 7 III\", \"focal_length\": \"35 mm\", \"aperture\": \"f/8\", \"shutter_speed\": \"6 seconds\", \"iso\": \"100\", \"mode\": \"Manual (M)\", \"white_balance\": \"4800K (cool)\"}', '2026-04-20 19:12:02'),
(2, 3, 3, 'tokyo2.jpg', 'Shibuya Crossing', 'The famous Shibuya crossing at rush hour', '2023', '{\"camera\": \"Canon EOS R5\", \"focal_length\": \"24 mm\", \"aperture\": \"f/5.6\", \"shutter_speed\": \"1/100 seconds\", \"iso\": \"400\", \"mode\": \"Aperture Priority\", \"white_balance\": \"5500K (daylight)\"}', '2026-04-20 19:12:02'),
(3, 4, 3, 'tokyo3.jpg', 'Shinjuku Golden Hour', 'Shinjuku district during golden hour', '2024', '{\"camera\": \"Nikon Z6\", \"focal_length\": \"50 mm\", \"aperture\": \"f/4\", \"shutter_speed\": \"1/250 seconds\", \"iso\": \"200\", \"mode\": \"Manual (M)\", \"white_balance\": \"6000K (warm)\"}', '2026-04-20 19:12:02'),
(4, 2, 3, 'tokyo4.jpg', 'Shinjuku Nights', 'The neon lights of Shinjuku reflecting on wet streets after rain.', '2024', '{\"camera\": \"Sony Alpha 7 IV\", \"focal_length\": \"24 mm\", \"aperture\": \"f/2.8\", \"shutter_speed\": \"1/60 seconds\", \"iso\": \"1600\", \"mode\": \"Manual (M)\", \"white_balance\": \"3200K (tungsten)\"}', '2026-04-21 08:12:44'),
(5, 3, 3, 'tokyo5.jpg', 'Senso-ji Temple', 'The ancient Senso-ji temple bathed in early morning light.', '2023', '{\"camera\": \"Canon EOS R6\", \"focal_length\": \"16 mm\", \"aperture\": \"f/8\", \"shutter_speed\": \"1/200 seconds\", \"iso\": \"100\", \"mode\": \"Aperture Priority\", \"white_balance\": \"5500K (daylight)\"}', '2026-04-21 08:12:44'),
(6, 4, 3, 'tokyo6.jpg', 'Tokyo Tower', 'Tokyo Tower glowing orange against a deep blue evening sky.', '2024', '{\"camera\": \"Nikon Z7\", \"focal_length\": \"70 mm\", \"aperture\": \"f/5.6\", \"shutter_speed\": \"1/125 seconds\", \"iso\": \"400\", \"mode\": \"Manual (M)\", \"white_balance\": \"4500K (cloudy)\"}', '2026-04-21 08:12:44'),
(7, 2, 3, 'tokyo7.jpg', 'Harajuku Street', 'The colorful and eccentric fashion scene of Harajuku on a Sunday afternoon.', '2023', '{\"camera\": \"Fujifilm X-T4\", \"focal_length\": \"35 mm\", \"aperture\": \"f/4\", \"shutter_speed\": \"1/250 seconds\", \"iso\": \"200\", \"mode\": \"Aperture Priority\", \"white_balance\": \"6000K (daylight)\"}', '2026-04-21 08:12:44'),
(8, 3, 3, 'tokyo8.jpg', 'Akihabara Electric Town', 'The dazzling electronics district of Akihabara lit up at night.', '2024', '{\"camera\": \"Sony Alpha 7 III\", \"focal_length\": \"28 mm\", \"aperture\": \"f/3.5\", \"shutter_speed\": \"1/80 seconds\", \"iso\": \"800\", \"mode\": \"Manual (M)\", \"white_balance\": \"3500K (tungsten)\"}', '2026-04-21 08:12:44'),
(9, 4, 3, 'tokyo9.jpg', 'Mount Fuji View', 'A rare clear day offering a stunning view of Mount Fuji from the city.', '2023', '{\"camera\": \"Canon EOS R5\", \"focal_length\": \"100 mm\", \"aperture\": \"f/8\", \"shutter_speed\": \"1/500 seconds\", \"iso\": \"100\", \"mode\": \"Manual (M)\", \"white_balance\": \"5500K (daylight)\"}', '2026-04-21 08:12:44'),
(10, 6, 3, 'tokyo10.jpg', 'Tsukiji Market', 'The bustling energy of Tsukiji market at the crack of dawn.', '2024', '{\"camera\": \"Nikon Z6\", \"focal_length\": \"24 mm\", \"aperture\": \"f/4\", \"shutter_speed\": \"1/100 seconds\", \"iso\": \"800\", \"mode\": \"Aperture Priority\", \"white_balance\": \"4000K (fluorescent)\"}', '2026-04-21 08:12:44'),
(11, 19, 2, 'photo_6a1de1f3d0553.jpg', 'ecec', '', NULL, '{\"camera\":\"\",\"focal_length\":\"\",\"aperture\":\"\",\"shutter_speed\":\"\",\"iso\":\"\",\"mode\":\"\",\"white_balance\":\"\"}', '2026-06-01 19:48:03'),
(12, 6, 1, 'photo_6a1e5c575f588.jpg', 'big house', 'really big house', NULL, '{\"camera\":\"\",\"focal_length\":\"\",\"aperture\":\"\",\"shutter_speed\":\"\",\"iso\":\"\",\"mode\":\"\",\"white_balance\":\"\"}', '2026-06-02 04:30:15'),
(15, 6, 11, 'photo_6a305b75b120b.jpg', 'Kairo', 'Really nice city', NULL, '{\"camera\":\"\",\"focal_length\":\"\",\"aperture\":\"\",\"shutter_speed\":\"\",\"iso\":\"\",\"mode\":\"\",\"white_balance\":\"\"}', '2026-06-15 20:07:17');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `photo_tags`
--

CREATE TABLE `photo_tags` (
  `id` int(11) NOT NULL,
  `photo_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `photo_tags`
--

INSERT INTO `photo_tags` (`id`, `photo_id`, `tag_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 5),
(4, 2, 4),
(5, 3, 6),
(6, 3, 2),
(37, 1, 4),
(38, 1, 2),
(39, 1, 1),
(40, 2, 8),
(41, 2, 7),
(42, 2, 5),
(43, 3, 2),
(44, 3, 1),
(45, 3, 6),
(46, 4, 1),
(47, 4, 8),
(48, 4, 7),
(49, 5, 4),
(50, 5, 2),
(51, 5, 6),
(52, 6, 3),
(53, 6, 4),
(54, 6, 5),
(55, 7, 5),
(56, 7, 1),
(57, 7, 8),
(58, 8, 1),
(59, 8, 2),
(60, 8, 6),
(61, 9, 4),
(62, 9, 2),
(63, 9, 5),
(64, 10, 5),
(65, 10, 7),
(66, 10, 8),
(67, 11, 39),
(68, 12, 6),
(69, 12, 4),
(70, 12, 8),
(71, 12, 40),
(82, 15, 4),
(83, 15, 6),
(84, 15, 40),
(85, 15, 2),
(86, 15, 42);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `tags`
--

INSERT INTO `tags` (`id`, `name`) VALUES
(4, 'Architecture'),
(3, 'Café'),
(39, 'ce'),
(6, 'Golden Hour'),
(42, 'Jojos'),
(40, 'nice'),
(1, 'Night'),
(8, 'Park'),
(7, 'Rain'),
(41, 'Sight'),
(2, 'Skyline'),
(5, 'Street');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `bio` text DEFAULT NULL,
  `profilbild` varchar(255) DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `bio`, `profilbild`, `cover_image`, `created_at`) VALUES
(1, 'lukas', 'lukas@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, '2026-04-20 18:22:43'),
(2, 'bebe', 'bebe', '$2y$10$ICSeJM5h2lmcBl3VflUdCOnQfNvhYpMSFLF2RiTYLgFdv.V6xgW0W', NULL, NULL, NULL, '2026-04-21 07:14:06'),
(3, 'lukas12', 'lukas12', '$2y$10$ivptPFKVt4P84fnURt5b0e2Y/jIlpTl.B4E01Ha0MinLXBzkPR0YO', NULL, NULL, NULL, '2026-04-21 13:47:24'),
(4, 'Lukasbenea', 'Lukasbenea', '$2y$10$4iFH3OsnLiSXKbdbaevezOyA74LKWnl0.81/t/OvtJFsgYG4GoRUC', NULL, NULL, NULL, '2026-04-22 10:02:50'),
(5, 'beneatomi@yahoo.de', 'beneatomi@yahoo.de', '$2y$10$QQ6bDwgGPMs22WiTOEtUnOeYLAOCk.6EC7XmWAd7owzXb3oBDwlZi', NULL, NULL, NULL, '2026-04-23 16:03:35'),
(6, 'anna', 'anna@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'halllo', 'avatar_6a304541ec7bc.jpeg', 'cover_6a304489b1bb6.jpeg', '2026-04-28 14:04:52'),
(7, 'marco', 'marco@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, '2026-04-28 14:04:52'),
(8, 'sofia', 'sofia@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, '2026-04-28 14:04:52'),
(9, 'dummy1', 'dummy1@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(10, 'dummy2', 'dummy2@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(11, 'dummy3', 'dummy3@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(12, 'dummy4', 'dummy4@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(13, 'dummy5', 'dummy5@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(14, 'dummy6', 'dummy6@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(15, 'dummy7', 'dummy7@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(16, 'dummy8', 'dummy8@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(17, 'dummy9', 'dummy9@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(18, 'dummy10', 'dummy10@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(19, 'dummy11', 'dummy11@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(20, 'dummy12', 'dummy12@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(21, 'dummy13', 'dummy13@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(22, 'dummy14', 'dummy14@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(23, 'dummy15', 'dummy15@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(24, 'dummy16', 'dummy16@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(25, 'dummy17', 'dummy17@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(26, 'dummy18', 'dummy18@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(27, 'dummy19', 'dummy19@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(28, 'dummy20', 'dummy20@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(29, 'dummy21', 'dummy21@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(30, 'dummy22', 'dummy22@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(31, 'dummy23', 'dummy23@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(32, 'dummy24', 'dummy24@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(33, 'dummy25', 'dummy25@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(34, 'dummy26', 'dummy26@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(35, 'dummy27', 'dummy27@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(36, 'dummy28', 'dummy28@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(37, 'dummy29', 'dummy29@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(38, 'dummy30', 'dummy30@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(39, 'dummy31', 'dummy31@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(40, 'dummy32', 'dummy32@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(41, 'dummy33', 'dummy33@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(42, 'dummy34', 'dummy34@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(43, 'dummy35', 'dummy35@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(44, 'dummy36', 'dummy36@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(45, 'dummy37', 'dummy37@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(46, 'dummy38', 'dummy38@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(47, 'dummy39', 'dummy39@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(48, 'dummy40', 'dummy40@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(49, 'dummy41', 'dummy41@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(50, 'dummy42', 'dummy42@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(51, 'dummy43', 'dummy43@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(52, 'dummy44', 'dummy44@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(53, 'dummy45', 'dummy45@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(54, 'dummy46', 'dummy46@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(55, 'dummy47', 'dummy47@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(56, 'dummy48', 'dummy48@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(57, 'dummy49', 'dummy49@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(58, 'dummy50', 'dummy50@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(59, 'dummy51', 'dummy51@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(60, 'dummy52', 'dummy52@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(61, 'dummy53', 'dummy53@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(62, 'dummy54', 'dummy54@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(63, 'dummy55', 'dummy55@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(64, 'dummy56', 'dummy56@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(65, 'dummy57', 'dummy57@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(66, 'dummy58', 'dummy58@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(67, 'dummy59', 'dummy59@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(68, 'dummy60', 'dummy60@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(69, 'dummy61', 'dummy61@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(70, 'dummy62', 'dummy62@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(71, 'dummy63', 'dummy63@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(72, 'dummy64', 'dummy64@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(73, 'dummy65', 'dummy65@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(74, 'dummy66', 'dummy66@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(75, 'dummy67', 'dummy67@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(76, 'dummy68', 'dummy68@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(77, 'dummy69', 'dummy69@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(78, 'dummy70', 'dummy70@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(79, 'dummy71', 'dummy71@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(80, 'dummy72', 'dummy72@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(81, 'dummy73', 'dummy73@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(82, 'dummy74', 'dummy74@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(83, 'dummy75', 'dummy75@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(84, 'dummy76', 'dummy76@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(85, 'dummy77', 'dummy77@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(86, 'dummy78', 'dummy78@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(87, 'dummy79', 'dummy79@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(88, 'dummy80', 'dummy80@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(89, 'dummy81', 'dummy81@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(90, 'dummy82', 'dummy82@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(91, 'dummy83', 'dummy83@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(92, 'dummy84', 'dummy84@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(93, 'dummy85', 'dummy85@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(94, 'dummy86', 'dummy86@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(95, 'dummy87', 'dummy87@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(96, 'dummy88', 'dummy88@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(97, 'dummy89', 'dummy89@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(98, 'dummy90', 'dummy90@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(99, 'dummy91', 'dummy91@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(100, 'dummy92', 'dummy92@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(101, 'dummy93', 'dummy93@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(102, 'dummy94', 'dummy94@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(103, 'dummy95', 'dummy95@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(104, 'dummy96', 'dummy96@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(105, 'dummy97', 'dummy97@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(106, 'dummy98', 'dummy98@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(107, 'dummy99', 'dummy99@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(108, 'dummy100', 'dummy100@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(109, 'dummy101', 'dummy101@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(110, 'dummy102', 'dummy102@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(111, 'dummy103', 'dummy103@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(112, 'dummy104', 'dummy104@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(113, 'dummy105', 'dummy105@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(114, 'dummy106', 'dummy106@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(115, 'dummy107', 'dummy107@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(116, 'dummy108', 'dummy108@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(117, 'dummy109', 'dummy109@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(118, 'dummy110', 'dummy110@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(119, 'dummy111', 'dummy111@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(120, 'dummy112', 'dummy112@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(121, 'dummy113', 'dummy113@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(122, 'dummy114', 'dummy114@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(123, 'dummy115', 'dummy115@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(124, 'dummy116', 'dummy116@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(125, 'dummy117', 'dummy117@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(126, 'dummy118', 'dummy118@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(127, 'dummy119', 'dummy119@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(128, 'dummy120', 'dummy120@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(129, 'dummy121', 'dummy121@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(130, 'dummy122', 'dummy122@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(131, 'dummy123', 'dummy123@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(132, 'dummy124', 'dummy124@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(133, 'dummy125', 'dummy125@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(134, 'dummy126', 'dummy126@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(135, 'dummy127', 'dummy127@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(136, 'dummy128', 'dummy128@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(137, 'dummy129', 'dummy129@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(138, 'dummy130', 'dummy130@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(139, 'dummy131', 'dummy131@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(140, 'dummy132', 'dummy132@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(141, 'dummy133', 'dummy133@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(142, 'dummy134', 'dummy134@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(143, 'dummy135', 'dummy135@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(144, 'dummy136', 'dummy136@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(145, 'dummy137', 'dummy137@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(146, 'dummy138', 'dummy138@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(147, 'dummy139', 'dummy139@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(148, 'dummy140', 'dummy140@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(149, 'dummy141', 'dummy141@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(150, 'dummy142', 'dummy142@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(151, 'dummy143', 'dummy143@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(152, 'dummy144', 'dummy144@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(153, 'dummy145', 'dummy145@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(154, 'dummy146', 'dummy146@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(155, 'dummy147', 'dummy147@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(156, 'dummy148', 'dummy148@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(157, 'dummy149', 'dummy149@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(158, 'dummy150', 'dummy150@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(159, 'dummy151', 'dummy151@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(160, 'dummy152', 'dummy152@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(161, 'dummy153', 'dummy153@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(162, 'dummy154', 'dummy154@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(163, 'dummy155', 'dummy155@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(164, 'dummy156', 'dummy156@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(165, 'dummy157', 'dummy157@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(166, 'dummy158', 'dummy158@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(167, 'dummy159', 'dummy159@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(168, 'dummy160', 'dummy160@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(169, 'dummy161', 'dummy161@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(170, 'dummy162', 'dummy162@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(171, 'dummy163', 'dummy163@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(172, 'dummy164', 'dummy164@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(173, 'dummy165', 'dummy165@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(174, 'dummy166', 'dummy166@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(175, 'dummy167', 'dummy167@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(176, 'dummy168', 'dummy168@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(177, 'dummy169', 'dummy169@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(178, 'dummy170', 'dummy170@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(179, 'dummy171', 'dummy171@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(180, 'dummy172', 'dummy172@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(181, 'dummy173', 'dummy173@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(182, 'dummy174', 'dummy174@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(183, 'dummy175', 'dummy175@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(184, 'dummy176', 'dummy176@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(185, 'dummy177', 'dummy177@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(186, 'dummy178', 'dummy178@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(187, 'dummy179', 'dummy179@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(188, 'dummy180', 'dummy180@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(189, 'dummy181', 'dummy181@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(190, 'dummy182', 'dummy182@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(191, 'dummy183', 'dummy183@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(192, 'dummy184', 'dummy184@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(193, 'dummy185', 'dummy185@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(194, 'dummy186', 'dummy186@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(195, 'dummy187', 'dummy187@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(196, 'dummy188', 'dummy188@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(197, 'dummy189', 'dummy189@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(198, 'dummy190', 'dummy190@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(199, 'dummy191', 'dummy191@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(200, 'dummy192', 'dummy192@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(201, 'dummy193', 'dummy193@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(202, 'dummy194', 'dummy194@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(203, 'dummy195', 'dummy195@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(204, 'dummy196', 'dummy196@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(205, 'dummy197', 'dummy197@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(206, 'dummy198', 'dummy198@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(207, 'dummy199', 'dummy199@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03'),
(208, 'dummy200', 'dummy200@scenery.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uRpFkIF/u', NULL, NULL, NULL, '2026-05-28 07:56:03');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `visited_cities`
--

CREATE TABLE `visited_cities` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `city_id` int(11) NOT NULL,
  `visited_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `visited_cities`
--

INSERT INTO `visited_cities` (`id`, `user_id`, `city_id`, `visited_at`) VALUES
(3, 9, 3, '2026-05-28 07:58:27'),
(4, 10, 3, '2026-05-28 07:58:27'),
(5, 11, 3, '2026-05-28 07:58:27'),
(6, 12, 3, '2026-05-28 07:58:27'),
(7, 13, 3, '2026-05-28 07:58:27'),
(8, 14, 3, '2026-05-28 07:58:27'),
(9, 15, 3, '2026-05-28 07:58:27'),
(10, 16, 3, '2026-05-28 07:58:27'),
(11, 17, 3, '2026-05-28 07:58:27'),
(12, 18, 3, '2026-05-28 07:58:27'),
(13, 19, 3, '2026-05-28 07:58:27'),
(14, 20, 3, '2026-05-28 07:58:27'),
(15, 21, 3, '2026-05-28 07:58:27'),
(16, 22, 3, '2026-05-28 07:58:27'),
(17, 23, 3, '2026-05-28 07:58:27'),
(18, 24, 3, '2026-05-28 07:58:27'),
(19, 25, 3, '2026-05-28 07:58:27'),
(20, 26, 3, '2026-05-28 07:58:27'),
(21, 27, 3, '2026-05-28 07:58:27'),
(22, 28, 3, '2026-05-28 07:58:27'),
(23, 29, 3, '2026-05-28 07:58:27'),
(24, 30, 3, '2026-05-28 07:58:27'),
(25, 31, 3, '2026-05-28 07:58:27'),
(26, 32, 3, '2026-05-28 07:58:27'),
(27, 33, 3, '2026-05-28 07:58:27'),
(28, 34, 3, '2026-05-28 07:58:27'),
(29, 35, 3, '2026-05-28 07:58:27'),
(30, 36, 3, '2026-05-28 07:58:27'),
(31, 37, 3, '2026-05-28 07:58:27'),
(32, 38, 3, '2026-05-28 07:58:27'),
(33, 39, 3, '2026-05-28 07:58:27'),
(34, 40, 3, '2026-05-28 07:58:27'),
(35, 41, 3, '2026-05-28 07:58:27'),
(36, 42, 3, '2026-05-28 07:58:27'),
(37, 43, 3, '2026-05-28 07:58:27'),
(38, 44, 3, '2026-05-28 07:58:27'),
(39, 45, 3, '2026-05-28 07:58:27'),
(40, 46, 3, '2026-05-28 07:58:27'),
(41, 47, 3, '2026-05-28 07:58:27'),
(42, 48, 3, '2026-05-28 07:58:27'),
(43, 49, 3, '2026-05-28 07:58:27'),
(44, 50, 3, '2026-05-28 07:58:27'),
(45, 51, 3, '2026-05-28 07:58:27'),
(46, 52, 3, '2026-05-28 07:58:27'),
(47, 53, 3, '2026-05-28 07:58:27'),
(48, 54, 3, '2026-05-28 07:58:27'),
(49, 55, 3, '2026-05-28 07:58:27'),
(50, 56, 3, '2026-05-28 07:58:27'),
(51, 57, 3, '2026-05-28 07:58:27'),
(52, 58, 3, '2026-05-28 07:58:27'),
(53, 59, 3, '2026-05-28 07:58:27'),
(54, 60, 3, '2026-05-28 07:58:27'),
(55, 61, 3, '2026-05-28 07:58:27'),
(56, 62, 3, '2026-05-28 07:58:27'),
(57, 63, 3, '2026-05-28 07:58:27'),
(58, 64, 3, '2026-05-28 07:58:27'),
(59, 65, 3, '2026-05-28 07:58:27'),
(60, 66, 3, '2026-05-28 07:58:27'),
(61, 67, 3, '2026-05-28 07:58:27'),
(62, 68, 3, '2026-05-28 07:58:27'),
(63, 69, 3, '2026-05-28 07:58:27'),
(64, 70, 3, '2026-05-28 07:58:27'),
(65, 71, 3, '2026-05-28 07:58:27'),
(66, 72, 3, '2026-05-28 07:58:27'),
(67, 73, 3, '2026-05-28 07:58:27'),
(68, 74, 3, '2026-05-28 07:58:27'),
(69, 75, 3, '2026-05-28 07:58:27'),
(70, 76, 3, '2026-05-28 07:58:27'),
(71, 77, 3, '2026-05-28 07:58:27'),
(72, 78, 3, '2026-05-28 07:58:27'),
(130, 9, 2, '2026-05-28 07:58:27'),
(131, 10, 2, '2026-05-28 07:58:27'),
(132, 11, 2, '2026-05-28 07:58:27'),
(133, 12, 2, '2026-05-28 07:58:27'),
(134, 13, 2, '2026-05-28 07:58:27'),
(135, 14, 2, '2026-05-28 07:58:27'),
(136, 15, 2, '2026-05-28 07:58:27'),
(137, 16, 2, '2026-05-28 07:58:27'),
(138, 17, 2, '2026-05-28 07:58:27'),
(139, 18, 2, '2026-05-28 07:58:27'),
(140, 19, 2, '2026-05-28 07:58:27'),
(141, 20, 2, '2026-05-28 07:58:27'),
(142, 21, 2, '2026-05-28 07:58:27'),
(143, 22, 2, '2026-05-28 07:58:27'),
(144, 23, 2, '2026-05-28 07:58:27'),
(145, 24, 2, '2026-05-28 07:58:27'),
(146, 25, 2, '2026-05-28 07:58:27'),
(147, 26, 2, '2026-05-28 07:58:27'),
(148, 27, 2, '2026-05-28 07:58:27'),
(149, 28, 2, '2026-05-28 07:58:27'),
(150, 29, 2, '2026-05-28 07:58:27'),
(151, 30, 2, '2026-05-28 07:58:27'),
(152, 31, 2, '2026-05-28 07:58:27'),
(153, 32, 2, '2026-05-28 07:58:27'),
(154, 33, 2, '2026-05-28 07:58:27'),
(155, 34, 2, '2026-05-28 07:58:27'),
(156, 35, 2, '2026-05-28 07:58:27'),
(157, 36, 2, '2026-05-28 07:58:27'),
(158, 37, 2, '2026-05-28 07:58:27'),
(159, 38, 2, '2026-05-28 07:58:27'),
(160, 39, 2, '2026-05-28 07:58:27'),
(161, 40, 2, '2026-05-28 07:58:27'),
(162, 41, 2, '2026-05-28 07:58:27'),
(163, 42, 2, '2026-05-28 07:58:27'),
(164, 43, 2, '2026-05-28 07:58:27'),
(165, 44, 2, '2026-05-28 07:58:27'),
(166, 45, 2, '2026-05-28 07:58:27'),
(167, 46, 2, '2026-05-28 07:58:27'),
(168, 47, 2, '2026-05-28 07:58:27'),
(169, 48, 2, '2026-05-28 07:58:27'),
(170, 49, 2, '2026-05-28 07:58:27'),
(171, 50, 2, '2026-05-28 07:58:27'),
(172, 51, 2, '2026-05-28 07:58:27'),
(173, 52, 2, '2026-05-28 07:58:27'),
(174, 53, 2, '2026-05-28 07:58:27'),
(175, 54, 2, '2026-05-28 07:58:27'),
(176, 55, 2, '2026-05-28 07:58:27'),
(177, 56, 2, '2026-05-28 07:58:27'),
(178, 57, 2, '2026-05-28 07:58:27'),
(179, 58, 2, '2026-05-28 07:58:27'),
(193, 20, 6, '2026-05-28 07:58:27'),
(194, 21, 6, '2026-05-28 07:58:27'),
(195, 22, 6, '2026-05-28 07:58:27'),
(196, 23, 6, '2026-05-28 07:58:27'),
(197, 24, 6, '2026-05-28 07:58:27'),
(198, 25, 6, '2026-05-28 07:58:27'),
(199, 26, 6, '2026-05-28 07:58:27'),
(200, 27, 6, '2026-05-28 07:58:27'),
(201, 28, 6, '2026-05-28 07:58:27'),
(202, 29, 6, '2026-05-28 07:58:27'),
(203, 30, 6, '2026-05-28 07:58:27'),
(204, 31, 6, '2026-05-28 07:58:27'),
(205, 32, 6, '2026-05-28 07:58:27'),
(206, 33, 6, '2026-05-28 07:58:27'),
(207, 34, 6, '2026-05-28 07:58:27'),
(208, 35, 6, '2026-05-28 07:58:27'),
(209, 36, 6, '2026-05-28 07:58:27'),
(210, 37, 6, '2026-05-28 07:58:27'),
(211, 38, 6, '2026-05-28 07:58:27'),
(212, 39, 6, '2026-05-28 07:58:27'),
(213, 40, 6, '2026-05-28 07:58:27'),
(214, 41, 6, '2026-05-28 07:58:27'),
(215, 42, 6, '2026-05-28 07:58:27'),
(216, 43, 6, '2026-05-28 07:58:27'),
(217, 44, 6, '2026-05-28 07:58:27'),
(218, 45, 6, '2026-05-28 07:58:27'),
(219, 46, 6, '2026-05-28 07:58:27'),
(220, 47, 6, '2026-05-28 07:58:27'),
(221, 48, 6, '2026-05-28 07:58:27'),
(222, 49, 6, '2026-05-28 07:58:27'),
(223, 50, 6, '2026-05-28 07:58:27'),
(224, 51, 6, '2026-05-28 07:58:27'),
(225, 52, 6, '2026-05-28 07:58:27'),
(226, 53, 6, '2026-05-28 07:58:27'),
(227, 54, 6, '2026-05-28 07:58:27'),
(256, 30, 9, '2026-05-28 07:58:27'),
(257, 31, 9, '2026-05-28 07:58:27'),
(258, 32, 9, '2026-05-28 07:58:27'),
(259, 33, 9, '2026-05-28 07:58:27'),
(260, 34, 9, '2026-05-28 07:58:27'),
(261, 35, 9, '2026-05-28 07:58:27'),
(262, 36, 9, '2026-05-28 07:58:27'),
(263, 37, 9, '2026-05-28 07:58:27'),
(264, 38, 9, '2026-05-28 07:58:27'),
(265, 39, 9, '2026-05-28 07:58:27'),
(266, 40, 9, '2026-05-28 07:58:27'),
(267, 41, 9, '2026-05-28 07:58:27'),
(268, 42, 9, '2026-05-28 07:58:27'),
(269, 43, 9, '2026-05-28 07:58:27'),
(270, 44, 9, '2026-05-28 07:58:27'),
(271, 45, 9, '2026-05-28 07:58:27'),
(272, 46, 9, '2026-05-28 07:58:27'),
(273, 47, 9, '2026-05-28 07:58:27'),
(274, 48, 9, '2026-05-28 07:58:27'),
(275, 49, 9, '2026-05-28 07:58:27'),
(276, 50, 9, '2026-05-28 07:58:27'),
(277, 51, 9, '2026-05-28 07:58:27'),
(278, 52, 9, '2026-05-28 07:58:27'),
(279, 53, 9, '2026-05-28 07:58:27'),
(280, 54, 9, '2026-05-28 07:58:27'),
(281, 55, 9, '2026-05-28 07:58:27'),
(282, 56, 9, '2026-05-28 07:58:27'),
(283, 57, 9, '2026-05-28 07:58:27'),
(284, 58, 9, '2026-05-28 07:58:27'),
(285, 59, 9, '2026-05-28 07:58:27'),
(287, 40, 7, '2026-05-28 07:58:27'),
(288, 41, 7, '2026-05-28 07:58:27'),
(289, 42, 7, '2026-05-28 07:58:27'),
(290, 43, 7, '2026-05-28 07:58:27'),
(291, 44, 7, '2026-05-28 07:58:27'),
(292, 45, 7, '2026-05-28 07:58:27'),
(293, 46, 7, '2026-05-28 07:58:27'),
(294, 47, 7, '2026-05-28 07:58:27'),
(295, 48, 7, '2026-05-28 07:58:27'),
(296, 49, 7, '2026-05-28 07:58:27'),
(297, 50, 7, '2026-05-28 07:58:27'),
(298, 51, 7, '2026-05-28 07:58:27'),
(299, 52, 7, '2026-05-28 07:58:27'),
(300, 53, 7, '2026-05-28 07:58:27'),
(301, 54, 7, '2026-05-28 07:58:27'),
(302, 55, 7, '2026-05-28 07:58:27'),
(303, 56, 7, '2026-05-28 07:58:27'),
(304, 57, 7, '2026-05-28 07:58:27'),
(305, 58, 7, '2026-05-28 07:58:27'),
(306, 59, 7, '2026-05-28 07:58:27'),
(318, 50, 8, '2026-05-28 07:58:27'),
(319, 51, 8, '2026-05-28 07:58:27'),
(320, 52, 8, '2026-05-28 07:58:27'),
(321, 53, 8, '2026-05-28 07:58:27'),
(322, 54, 8, '2026-05-28 07:58:27'),
(323, 55, 8, '2026-05-28 07:58:27'),
(324, 56, 8, '2026-05-28 07:58:27'),
(325, 57, 8, '2026-05-28 07:58:27'),
(326, 58, 8, '2026-05-28 07:58:27'),
(327, 59, 8, '2026-05-28 07:58:27'),
(328, 60, 8, '2026-05-28 07:58:27'),
(329, 61, 8, '2026-05-28 07:58:27'),
(330, 62, 8, '2026-05-28 07:58:27'),
(331, 63, 8, '2026-05-28 07:58:27'),
(332, 64, 8, '2026-05-28 07:58:27'),
(333, 60, 1, '2026-05-28 07:58:27'),
(334, 61, 1, '2026-05-28 07:58:27'),
(335, 62, 1, '2026-05-28 07:58:27'),
(336, 63, 1, '2026-05-28 07:58:27'),
(337, 64, 1, '2026-05-28 07:58:27'),
(338, 65, 1, '2026-05-28 07:58:27'),
(339, 66, 1, '2026-05-28 07:58:27'),
(340, 67, 1, '2026-05-28 07:58:27'),
(341, 68, 1, '2026-05-28 07:58:27'),
(342, 69, 1, '2026-05-28 07:58:27'),
(343, 70, 1, '2026-05-28 07:58:27'),
(344, 71, 1, '2026-05-28 07:58:27'),
(348, 70, 10, '2026-05-28 07:58:27'),
(349, 71, 10, '2026-05-28 07:58:27'),
(350, 72, 10, '2026-05-28 07:58:27'),
(351, 73, 10, '2026-05-28 07:58:27'),
(352, 74, 10, '2026-05-28 07:58:27'),
(353, 75, 10, '2026-05-28 07:58:27'),
(354, 76, 10, '2026-05-28 07:58:27'),
(355, 77, 10, '2026-05-28 07:58:27'),
(356, 78, 10, '2026-05-28 07:58:27'),
(357, 79, 10, '2026-05-28 07:58:27'),
(363, 80, 4, '2026-05-28 07:58:27'),
(364, 81, 4, '2026-05-28 07:58:27'),
(365, 82, 4, '2026-05-28 07:58:27'),
(366, 83, 4, '2026-05-28 07:58:27'),
(367, 84, 4, '2026-05-28 07:58:27'),
(368, 85, 4, '2026-05-28 07:58:27'),
(369, 86, 4, '2026-05-28 07:58:27'),
(370, 87, 4, '2026-05-28 07:58:27'),
(378, 90, 11, '2026-05-28 07:58:27'),
(379, 91, 11, '2026-05-28 07:58:27'),
(380, 92, 11, '2026-05-28 07:58:27'),
(381, 93, 11, '2026-05-28 07:58:27'),
(382, 94, 11, '2026-05-28 07:58:27'),
(385, 100, 5, '2026-05-28 07:58:27'),
(386, 101, 5, '2026-05-28 07:58:27'),
(387, 102, 5, '2026-05-28 07:58:27'),
(388, 103, 5, '2026-05-28 07:58:27'),
(397, 6, 1, '2026-06-02 09:37:16'),
(399, 6, 9, '2026-06-02 09:43:45'),
(400, 6, 2, '2026-06-02 11:23:22'),
(402, 6, 3, '2026-06-15 18:33:20');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `city_of_week`
--
ALTER TABLE `city_of_week`
  ADD PRIMARY KEY (`id`),
  ADD KEY `city_id` (`city_id`);

--
-- Indizes für die Tabelle `collections`
--
ALTER TABLE `collections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indizes für die Tabelle `collection_photos`
--
ALTER TABLE `collection_photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `collection_id` (`collection_id`),
  ADD KEY `photo_id` (`photo_id`);

--
-- Indizes für die Tabelle `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `photo_id` (`photo_id`);

--
-- Indizes für die Tabelle `photos`
--
ALTER TABLE `photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `city_id` (`city_id`);

--
-- Indizes für die Tabelle `photo_tags`
--
ALTER TABLE `photo_tags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `photo_id` (`photo_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indizes für die Tabelle `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indizes für die Tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indizes für die Tabelle `visited_cities`
--
ALTER TABLE `visited_cities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `city_id` (`city_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `cities`
--
ALTER TABLE `cities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT für Tabelle `city_of_week`
--
ALTER TABLE `city_of_week`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `collections`
--
ALTER TABLE `collections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT für Tabelle `collection_photos`
--
ALTER TABLE `collection_photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT für Tabelle `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT für Tabelle `photos`
--
ALTER TABLE `photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT für Tabelle `photo_tags`
--
ALTER TABLE `photo_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT für Tabelle `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=212;

--
-- AUTO_INCREMENT für Tabelle `visited_cities`
--
ALTER TABLE `visited_cities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=403;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `city_of_week`
--
ALTER TABLE `city_of_week`
  ADD CONSTRAINT `city_of_week_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`);

--
-- Constraints der Tabelle `collections`
--
ALTER TABLE `collections`
  ADD CONSTRAINT `collections_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints der Tabelle `collection_photos`
--
ALTER TABLE `collection_photos`
  ADD CONSTRAINT `collection_photos_ibfk_1` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`),
  ADD CONSTRAINT `collection_photos_ibfk_2` FOREIGN KEY (`photo_id`) REFERENCES `photos` (`id`);

--
-- Constraints der Tabelle `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`photo_id`) REFERENCES `photos` (`id`);

--
-- Constraints der Tabelle `photos`
--
ALTER TABLE `photos`
  ADD CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `photos_ibfk_2` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`);

--
-- Constraints der Tabelle `photo_tags`
--
ALTER TABLE `photo_tags`
  ADD CONSTRAINT `photo_tags_ibfk_1` FOREIGN KEY (`photo_id`) REFERENCES `photos` (`id`),
  ADD CONSTRAINT `photo_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`);

--
-- Constraints der Tabelle `visited_cities`
--
ALTER TABLE `visited_cities`
  ADD CONSTRAINT `visited_cities_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `visited_cities_ibfk_2` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
