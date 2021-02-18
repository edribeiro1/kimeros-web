
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for tracking
CREATE DATABASE IF NOT EXISTS `tracking` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `tracking`;

-- Dumping structure for table tracking.alerta
CREATE TABLE IF NOT EXISTS `alerta` (
  `ale_id` int NOT NULL AUTO_INCREMENT,
  `ale_id_ale_tip` int NOT NULL,
  `ale_id_rastreado` int NOT NULL,
  `ale_data` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ale_lido` tinyint(1) NOT NULL DEFAULT '0',
  `ale_id_usuario` int NOT NULL,
  PRIMARY KEY (`ale_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table tracking.alerta_tipo
CREATE TABLE IF NOT EXISTS `alerta_tipo` (
  `ale_tip_id` int NOT NULL AUTO_INCREMENT,
  `ale_tip_descricao` varchar(100) NOT NULL,
  PRIMARY KEY (`ale_tip_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table tracking.equipamento
CREATE TABLE IF NOT EXISTS `equipamento` (
  `equ_id` int NOT NULL AUTO_INCREMENT,
  `equ_numero_serie` varchar(50) NOT NULL,
  `equ_id_produto` int NOT NULL,
  `equ_numero_chip` varchar(50) DEFAULT NULL,
  `equ_id_usuario` int NOT NULL,
  PRIMARY KEY (`equ_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table tracking.evento
CREATE TABLE IF NOT EXISTS `evento` (
  `eve_id` int NOT NULL AUTO_INCREMENT,
  `eve_id_equipamento` int NOT NULL,
  `eve_id_rastreado` int NOT NULL,
  `eve_id_usuario` int NOT NULL,
  `eve_localizacao` point NOT NULL,
  `eve_velocidade` float DEFAULT NULL,
  `eve_data_gps` datetime NOT NULL,
  `eve_data_servidor` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `eve_ignicao` tinyint(1) DEFAULT '0' COMMENT '0-ignicao desligada 1-ignicao ligada',
  `eve_gps` tinyint(1) DEFAULT '0' COMMENT '0-sem gps 1-com gps',
  `eve_gprs` tinyint(1) DEFAULT '0',
  `eve_bateria` int DEFAULT '0' COMMENT 'porcentagem',
  PRIMARY KEY (`eve_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10470 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table tracking.instalacao
CREATE TABLE IF NOT EXISTS `instalacao` (
  `ins_id` int NOT NULL AUTO_INCREMENT,
  `ins_id_equipamento` int NOT NULL,
  `ins_id_rastreado` int NOT NULL,
  `ins_id_usuario` int NOT NULL,
  PRIMARY KEY (`ins_id`),
  KEY `ins_id_equipamento` (`ins_id_equipamento`),
  KEY `ins_id_rastreado` (`ins_id_rastreado`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table tracking.produto
CREATE TABLE IF NOT EXISTS `produto` (
  `pro_id` int NOT NULL AUTO_INCREMENT,
  `pro_descricao` varchar(50) NOT NULL,
  `pro_fabricante` varchar(100) NOT NULL,
  PRIMARY KEY (`pro_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table tracking.rastreado
CREATE TABLE IF NOT EXISTS `rastreado` (
  `ras_id` int NOT NULL AUTO_INCREMENT,
  `ras_descricao` varchar(100) NOT NULL,
  `ras_identificacao` varchar(10) NOT NULL,
  `ras_tipo` enum('Moto','Carro','Bicicleta','Caminho','Pessoa') NOT NULL,
  `ras_id_usuario` int NOT NULL,
  PRIMARY KEY (`ras_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table tracking.ultimo_evento
CREATE TABLE IF NOT EXISTS `ultimo_evento` (
  `ult_eve_id` int NOT NULL AUTO_INCREMENT,
  `ult_eve_id_equipamento` int NOT NULL,
  `ult_eve_id_rastreado` int NOT NULL,
  `ult_eve_id_usuario` int NOT NULL,
  `ult_eve_localizacao` point NOT NULL,
  `ult_eve_velocidade` float DEFAULT NULL,
  `ult_eve_data_gps` datetime NOT NULL,
  `ult_eve_data_servidor` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ult_eve_ignicao` tinyint(1) DEFAULT '0',
  `ult_eve_gps` tinyint(1) DEFAULT '0',
  `ult_eve_gprs` tinyint DEFAULT '0',
  `ult_eve_bateria` int DEFAULT '0',
  PRIMARY KEY (`ult_eve_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table tracking.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `usu_id` int NOT NULL AUTO_INCREMENT,
  `usu_usuario` varchar(100) NOT NULL,
  `usu_senha` varchar(100) NOT NULL,
  `usu_email` varchar(150) NOT NULL,
  `usu_nome` varchar(200) NOT NULL,
  `usu_admin` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`usu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
