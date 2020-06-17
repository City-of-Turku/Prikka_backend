-- --------------------------------------------------------
-- Hôte :                        localhost
-- Version du serveur:           5.7.24 - MySQL Community Server (GPL)
-- SE du serveur:                Win64
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Listage des données de la table myturkuMemories_db.Categories : ~4 rows (environ)
DELETE FROM `Categories`;
/*!40000 ALTER TABLE `Categories` DISABLE KEYS */;
INSERT INTO `Categories` (`id`, `name`, `createdAt`, `description`) VALUES
	(1, 'School', '2020-03-04 15:35:33', ''),
	(2, 'Culture', '2020-03-09 15:35:34', ''),
	(3, 'Sport', '2020-03-09 15:35:37', ''),
	(4, 'Nature', '2020-03-09 15:35:40', '');

INSERT INTO `Categories` (`id`, `createdAt`, `updatedAt`, `nameFI`, `descriptionFI`, `nameSV`, `descriptionSV`, `nameEN`, `descriptionEN`) VALUES
    (1, '2020-03-04 15:35:33', '2020-03-04 15:35:33', 'Koulu', '', 'Skola', '', 'School',''),
    (2, '2020-03-09 15:35:34', '2020-03-04 15:35:34', 'Kultuuri', '','Kultur', '', 'Culture', ''),
    (3, '2020-03-09 15:35:37', '2020-03-04 15:35:37', 'Urheilu', '', 'Idrott', '', 'Sport', ''),
    (4, '2020-03-09 15:35:40', '2020-03-04 15:35:40', 'Luonto', '', 'Natur', '', 'Nature', '');
/*!40000 ALTER TABLE `Categories` ENABLE KEYS */;

-- Listage des données de la table myturkuMemories_db.Memories : ~15 rows (environ)
DELETE FROM `Memories`;
/*!40000 ALTER TABLE `Memories` DISABLE KEYS */;
INSERT INTO `Memories` (`id`, `title`, `position`, `createdAt`, `updatedAt`, `userId`, `categoryId`, `description`) VALUES
	(1, 'Sunday Walk', _binary 0x0000000001010000006317ED9778394E40BE00C20AF2443640, '2020-03-04 14:53:51', '2020-03-04 14:53:51', NULL, NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'),
	(2, 'ICT Show room', _binary 0x000000000101000000E142BE7476394E40000000A4BD4B3640, '2020-03-05 07:38:29', '2020-03-05 07:38:29', NULL, NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'),
	(4, 'My time at Turku', _binary 0x000000000101000000FE01F71F2F394E4001000060785C3640, '2020-03-05 08:15:22', '2020-03-05 08:15:22', NULL, NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'),
	(5, 'ICT Show room', _binary 0x000000000101000000ABD62B3E79394E4000000030C84B3640, '2020-03-05 08:30:40', '2020-03-05 08:30:40', NULL, NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'),
	(6, 'Vote for opticale', _binary 0x000000000101000000F3C774E779394E40010000009E4B3640, '2020-03-05 08:58:07', '2020-03-05 08:58:07', NULL, NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'),
	(7, 'Sweet home', _binary 0x000000000101000000CCF1087827394E40000000D85A5C3640, '2020-03-05 09:19:43', '2020-03-05 09:19:43', NULL, NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'),
	(8, 'Francois', _binary 0x000000000101000000B7FC57D1B13A4E4001000000233F3640, '2020-03-05 09:27:51', '2020-03-05 09:27:51', NULL, NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'),
	(9, 'koulu', _binary 0x00000000010100000014A3FFA19C394E4001000000714B3640, '2020-03-05 09:33:52', '2020-03-05 09:33:52', NULL, NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'),
	(10, 'ICT Show room', _binary 0x000000000101000000B366ED68EE394E40000000E0B4453640, '2020-03-05 09:42:52', '2020-03-05 09:42:52', NULL, NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'),
	(11, 'puisto', _binary 0x0000000001010000001BDB5DF2DB384E40010000E0AE4B3640, '2020-03-05 10:12:15', '2020-03-05 10:12:15', NULL, NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'),
	(12, 'Frozen lake', _binary 0x00000000010100000019895BF58F394E40010000A004633640, '2020-03-05 10:23:54', '2020-03-05 10:23:54', NULL, NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'),
	(13, 'Eating candies', _binary 0x000000000101000000646BB18DB3394E402FC24441F34A3640, '2020-03-05 10:28:30', '2020-03-05 10:28:30', NULL, NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'),
	(14, 'Talvi 2018', _binary 0x000000000101000000E95843E01F394E40000000400C433640, '2020-03-05 11:32:52', '2020-03-05 11:32:52', NULL, NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'),
	(15, 'Test', _binary 0x000000000101000000A9BA4B31393A4E4011468BFC9A433640, '2020-03-09 16:14:55', '2020-03-09 16:14:55', NULL, 3, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'),
	(16, 'T', _binary 0x000000000101000000213AC98C653A4E40E48701D7DE413640, '2020-03-09 16:15:15', '2020-03-09 16:15:15', NULL, 2, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.');
/*!40000 ALTER TABLE `Memories` ENABLE KEYS */;

-- Listage des données de la table myturkuMemories_db.Reports : ~8 rows (environ)
DELETE FROM `Reports`;
/*!40000 ALTER TABLE `Reports` DISABLE KEYS */;
INSERT INTO `Reports` (`id`, `title`, `description`, `createdAt`, `memoryId`, `userId`) VALUES
	(1, '', '', '2020-03-09 13:19:33', NULL, NULL),
	(2, '', '', '2020-03-09 13:20:16', NULL, NULL),
	(3, '', '', '2020-03-09 13:20:33', NULL, NULL),
	(4, 'Bad language', 'Using n word', '2020-03-09 13:24:58', NULL, NULL),
	(5, 'Bad language', 'Using n word', '2020-03-09 13:44:33', NULL, NULL),
	(12, 'Bad language', 'Using n word', '2020-03-09 14:14:50', 5, 1),
	(13, '', '', '2020-03-09 14:15:04', 14, 1),
	(14, '', '', '2020-03-10 06:44:28', 16, 1);
/*!40000 ALTER TABLE `Reports` ENABLE KEYS */;

-- Listage des données de la table myturkuMemories_db.Users : ~2 rows (environ)
DELETE FROM `Users`;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` (`id`, `username`, `email`, `passwordhash`, `googleId`, `facebookId`, `createdAt`, `updatedAt`, `social_media_account`) VALUES
	(1, 'user', 'email', 'pass', NULL, NULL, '2020-03-09 16:14:30', '2020-03-09 16:14:31', 0),
	(2, 'Siriusval', 'siriusval@hotmail.fr', '$2a$10$q0PSlTcTP5kOdzpjYBaVL.nQMdzl7kEjVl7LCrqfh3yBZ9M7pyEq.', NULL, NULL, '2020-03-09 17:31:33', '2020-03-09 17:31:33', 0);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
