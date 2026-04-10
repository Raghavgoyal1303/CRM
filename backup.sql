-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: Tricity Verified_db
-- ------------------------------------------------------
-- Server version	8.0.38

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_company` (`company_id`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
INSERT INTO `activity_logs` VALUES ('000924e6-9f58-4d93-a057-684fcf8e867b','comp-0001-0000-0000-000000000001','emp_001','Lead Captured','{\"name\":\"Jessica Pearson\",\"source\":\"Referral\",\"status\":\"new\"}','2026-04-02 22:39:57'),('036ed86a-cdd3-45b3-a000-ceb282f09bd5','comp-0001-0000-0000-000000000001','emp-e001-0000-0000-000000000001','Lead Captured','{\"name\":\"Louis Litt\",\"source\":\"Referral\",\"status\":\"site_visit\"}','2026-04-02 22:37:08'),('04c38ace-dd67-4b70-8a94-01d4565c96d9','hq_company_001','owner_001','Lead Captured','{\"name\":\"Sarah Jenkins\",\"source\":\"Organic\",\"status\":\"lost\"}','2026-04-03 12:12:37'),('06fa2a3b-38c6-45e3-bf1a-e1aa0ba2d0a0','hq_company_001','owner_001','Lead Captured','{\"name\":\"ewregdn\",\"source\":\"Website\",\"method\":\"Manual Web\"}','2026-04-03 14:44:40'),('0ba08024-fe05-4b32-8162-326ca138d4d9','hq_company_001','owner_001','Lead Captured','{\"name\":\"Daniel Hardman\",\"source\":\"LinkedIn\",\"status\":\"interested\"}','2026-04-03 12:12:37'),('1b09c924-5204-4be7-a4b3-928261c6b956','hq_company_001','owner_001','Lead Captured','{\"name\":\"Robert Zane\",\"source\":\"Referral\",\"status\":\"new\"}','2026-04-03 12:12:37'),('1e3000d3-cf31-45f8-878f-c664a4a4682e','hq_company_001','owner_001','Lead Captured','{\"name\":\"Harvey Specter\",\"source\":\"Referral\",\"status\":\"closed\"}','2026-04-03 12:12:37'),('1e5621cb-03eb-42da-b0f3-15aa54e4a13a','hq_company_001','owner_001','Lead Captured','{\"name\":\"Scottie Scott\",\"source\":\"LinkedIn\",\"status\":\"site_visit\"}','2026-04-03 12:12:37'),('1f7024e7-6ee8-4608-9349-1835072f99bd','comp-0001-0000-0000-000000000001','emp_001','Lead Captured','{\"name\":\"Michael Ross\",\"source\":\"Facebook\",\"status\":\"new\"}','2026-04-02 22:39:56'),('213437a1-f560-42fd-a639-4aa662c16be2','comp-0003-0000-0000-000000000003',NULL,'Lead Captured','{\"name\":\"John Smith\",\"source\":\"Organic\",\"status\":\"closed\"}','2026-04-02 20:27:03'),('24fa2f5f-e131-4f15-a839-3ee2ba25bd85','comp-0001-0000-0000-000000000001','emp-e001-0000-0000-000000000001','Employee Onboarded','{\"name\":\"mohammad\",\"email\":\"mohammad@eliterealty.com\"}','2026-04-09 16:40:10'),('273d75e1-87b3-42b6-91d6-2cc2a78a0391','comp-0001-0000-0000-000000000001','emp-e001-0000-0000-000000000001','Lead Captured','{\"name\":\"Jessica Pearson\",\"source\":\"Referral\",\"status\":\"closed\"}','2026-04-02 22:37:08'),('3547e333-7fd9-4fdf-bff3-f07c570ba8eb','comp-0001-0000-0000-000000000001','emp_001','Lead Captured','{\"name\":\"Robert Zane\",\"source\":\"Google Ads\",\"status\":\"closed\"}','2026-04-02 22:39:57'),('419ab8a9-0242-4fc4-a06d-ac12d2937f08','hq_company_001','owner_001','Lead Captured','{\"name\":\"Jeff Malone\",\"source\":\"Facebook\",\"status\":\"closed\"}','2026-04-03 12:12:37'),('43b411b4-0276-42fd-b474-aa9ae54c445d','hq_company_001','owner_001','Status Shifted','{\"lead_id\":\"53f8aa9e-b3ea-46ec-b447-46c057fd1a51\",\"new_status\":\"interested\"}','2026-04-03 22:30:42'),('471a1a4b-58b5-4afd-86ff-b5bacd520bf8','hq_company_001','owner_001','Status Shifted','{\"lead_id\":\"53f8aa9e-b3ea-46ec-b447-46c057fd1a51\",\"new_status\":\"lost\"}','2026-04-03 22:30:43'),('4775a580-33b1-4a1d-a468-3723d5e163f3','hq_company_001','owner_001','Lead Captured','{\"name\":\"dgfhg\",\"source\":\"Website\",\"method\":\"Manual Web\"}','2026-04-03 22:30:28'),('4edfbc49-a9cd-4917-b6e9-8c0aca9d434e','comp-0001-0000-0000-000000000001','emp-e001-0000-0000-000000000001','Lead Captured','{\"name\":\"Harvey Specter\",\"source\":\"LinkedIn\",\"status\":\"new\"}','2026-04-02 22:37:08'),('5199297b-4fef-4a25-b28f-5e8081c110ea','comp-0001-0000-0000-000000000001','emp-e001-0000-0000-000000000001','Employee Onboarded','{\"name\":\"virat\",\"email\":\"virat@eliterealty.com\"}','2026-04-09 17:29:27'),('548db6d6-ce6b-4b82-b8b4-8b28c5835da5','hq_company_001','owner_001','Lead Captured','{\"name\":\"Samantha Wheeler\",\"source\":\"LinkedIn\",\"status\":\"new\"}','2026-04-03 12:12:37'),('562dc20b-abd8-4121-9bb6-82c9132a114a','comp-0001-0000-0000-000000000001','emp_001','Lead Captured','{\"name\":\"Sarah Jenkins\",\"source\":\"Referral\",\"status\":\"closed\"}','2026-04-02 22:39:56'),('59e3bfcd-8416-483b-bb78-069f103e3ac3','hq_company_001','owner_001','Status Shifted','{\"lead_id\":\"53f8aa9e-b3ea-46ec-b447-46c057fd1a51\",\"new_status\":\"closed\"}','2026-04-03 22:30:44'),('5e522647-2331-4b07-bf21-aaf17a0eac47','comp-0001-0000-0000-000000000001','emp-e001-0000-0000-000000000001','Lead Captured','{\"name\":\"raghav \",\"source\":\"Website\",\"method\":\"Manual Web\"}','2026-04-09 17:51:29'),('629005fa-c4a7-4b2e-b87a-af2727198769','hq_company_001','owner_001','Status Shifted','{\"lead_id\":\"53f8aa9e-b3ea-46ec-b447-46c057fd1a51\",\"new_status\":\"new\"}','2026-04-03 22:30:46'),('654b4832-4c87-4ed9-b728-0b12ed6d9bba','comp-0001-0000-0000-000000000001','emp-e001-0000-0000-000000000001','Lead Captured','{\"name\":\"John Smith\",\"source\":\"LinkedIn\",\"status\":\"closed\"}','2026-04-02 22:37:08'),('663ce7ee-5c20-41f2-b595-d1db8ea50ee6','comp-0001-0000-0000-000000000001','emp_001','Lead Captured','{\"name\":\"Louis Litt\",\"source\":\"Facebook\",\"status\":\"interested\"}','2026-04-02 22:39:57'),('6648de02-df64-4a34-852a-a5a8474ec05f','hq_company_001','owner_001','Lead Captured','{\"name\":\"Michael Ross\",\"source\":\"Facebook\",\"status\":\"closed\"}','2026-04-03 12:12:37'),('684abf94-6305-4671-930a-27fcc9076fb4','comp-0001-0000-0000-000000000001','emp_001','Lead Captured','{\"name\":\"Rachel Zane\",\"source\":\"Google Ads\",\"status\":\"lost\"}','2026-04-02 22:39:57'),('6905c1f9-c7f2-4768-bb4e-14cbad122cbc','hq_company_001','owner_001','Lead Captured','{\"name\":\"raghav\",\"source\":\"Website\",\"method\":\"Manual Web\"}','2026-04-03 14:45:02'),('6ce012cb-962c-4295-9990-a29cec75d4b6','comp-0001-0000-0000-000000000001','emp-e001-0000-0000-000000000001','Lead Captured','{\"name\":\"Sarah Jenkins\",\"source\":\"Organic\",\"status\":\"interested\"}','2026-04-02 22:37:08'),('6fa7a3a5-67ab-42e8-96be-cc3812692d38','hq_company_001','owner_001','Lead Captured','{\"name\":\"Katrina Bennett\",\"source\":\"LinkedIn\",\"status\":\"new\"}','2026-04-03 12:12:37'),('72ca762f-5f6c-49a2-a6b5-9d8697e7b9bf','hq_company_001','owner_001','Lead Captured','{\"name\":\"Sean Cahill\",\"source\":\"Referral\",\"status\":\"site_visit\"}','2026-04-03 12:12:37'),('7a6b3f7e-f2e1-4952-8ab5-2f129838c77a','hq_company_001','owner_001','Lead Captured','{\"name\":\"Donna Paulsen\",\"source\":\"Organic\",\"status\":\"lost\"}','2026-04-03 12:12:37'),('7d69067c-befa-48e1-84e3-e4bdefb600eb','comp-0001-0000-0000-000000000001','emp-e001-0000-0000-000000000001','Lead Captured','{\"name\":\"Michael Ross\",\"source\":\"Referral\",\"status\":\"closed\"}','2026-04-02 22:37:08'),('7ee1dc08-4d02-41c1-a150-52ac946bdc05','hq_company_001','owner_001','Lead Captured','{\"name\":\"Rachel Zane\",\"source\":\"Organic\",\"status\":\"site_visit\"}','2026-04-03 12:12:37'),('7f1ec9ca-a1f7-4d9e-a2b6-8b42796f60da','comp-0001-0000-0000-000000000001','emp-e001-0000-0000-000000000001','Lead Captured','{\"name\":\"Donna Paulsen\",\"source\":\"Google Ads\",\"status\":\"site_visit\"}','2026-04-02 22:37:08'),('85111deb-023c-46b1-8d97-0e4cbc5c9cda','comp-0001-0000-0000-000000000001','emp-e001-0000-0000-000000000001','Status Shifted','{\"lead_id\":\"3ba5dd39-aa4b-4429-af34-1da3d0fce5ff\",\"new_status\":\"contacted\"}','2026-04-09 17:51:47'),('8d06079b-f6b0-43a6-92b0-5e338c535877','comp-0001-0000-0000-000000000001','emp_001','Lead Captured','{\"name\":\"Katrina Bennett\",\"source\":\"Organic\",\"status\":\"new\"}','2026-04-02 22:39:57'),('986b8d75-189c-4db3-b223-243104927f24','comp-0001-0000-0000-000000000001','emp-e001-0000-0000-000000000001','Lead Captured','{\"name\":\"Rachel Zane\",\"source\":\"Facebook\",\"status\":\"interested\"}','2026-04-02 22:37:08'),('99f4b364-f874-469c-b6a5-055e6cc1040b','comp-0001-0000-0000-000000000001','emp-e001-0000-0000-000000000001','Lead Captured','{\"name\":\"Katrina Bennett\",\"source\":\"Google Ads\",\"status\":\"site_visit\"}','2026-04-02 22:37:08'),('a0b935f8-4382-4b93-83f6-95ccf55a9d9c','comp-0001-0000-0000-000000000001','emp_001','Lead Captured','{\"name\":\"Harvey Specter\",\"source\":\"LinkedIn\",\"status\":\"closed\"}','2026-04-02 22:39:57'),('a104743f-87fb-40a0-8a45-fd8cb3405152','comp-0001-0000-0000-000000000001','emp-e001-0000-0000-000000000001','Lead Captured','{\"name\":\"Robert Zane\",\"source\":\"Facebook\",\"status\":\"site_visit\"}','2026-04-02 22:37:08'),('aaaba751-e94b-4ddd-805d-3b052efb36ec','hq_company_001','owner_001','Status Shifted','{\"lead_id\":\"53f8aa9e-b3ea-46ec-b447-46c057fd1a51\",\"new_status\":\"contacted\"}','2026-04-03 22:30:41'),('ab850016-d6d7-4109-8ef4-a9c41d302cd9','hq_company_001','owner_001','Lead Captured','{\"name\":\"Anita Gibbs\",\"source\":\"LinkedIn\",\"status\":\"new\"}','2026-04-03 12:12:37'),('b3239947-bd4b-43fa-b7d9-9ac00731ad2c','hq_company_001','owner_001','Lead Captured','{\"name\":\"Jessica Pearson\",\"source\":\"Referral\",\"status\":\"lost\"}','2026-04-03 12:12:37'),('b7caf0bc-bba9-47a0-8597-3017401a8870','comp-0001-0000-0000-000000000001','emp_001','Lead Captured','{\"name\":\"John Smith\",\"source\":\"LinkedIn\",\"status\":\"interested\"}','2026-04-02 22:39:56'),('bbd5c5d3-2017-4bbd-b3de-6b1d10e343f9','comp-0001-0000-0000-000000000001','emp_001','Lead Captured','{\"name\":\"Donna Paulsen\",\"source\":\"Google Ads\",\"status\":\"closed\"}','2026-04-02 22:39:57'),('c1400a32-5954-46b0-80f1-9e7c8b5cfaac','hq_company_001','owner_001','Lead Captured','{\"name\":\"Alex Williams\",\"source\":\"LinkedIn\",\"status\":\"interested\"}','2026-04-03 12:12:37'),('c5944961-ade2-4d36-9309-345fdeddffa5','comp-0001-0000-0000-000000000001','emp-e001-0000-0000-000000000001','Status Shifted','{\"lead_id\":\"3ba5dd39-aa4b-4429-af34-1da3d0fce5ff\",\"new_status\":\"lost\"}','2026-04-09 17:51:49'),('db15bb63-39eb-4f31-b0c8-3e28bfccfd28','hq_company_001','owner_001','Status Shifted','{\"lead_id\":\"53f8aa9e-b3ea-46ec-b447-46c057fd1a51\",\"new_status\":\"site_visit\"}','2026-04-03 22:30:45'),('dcf815e4-2d2d-4f54-9049-840f80997497','hq_company_001','owner_001','Lead Captured','{\"name\":\"Louis Litt\",\"source\":\"Facebook\",\"status\":\"lost\"}','2026-04-03 12:12:37'),('de5889c9-d698-4aa8-a64f-7b7fab544586','hq_company_001','owner_001','Lead Captured','{\"name\":\"Cameron Dennis\",\"source\":\"Google Ads\",\"status\":\"site_visit\"}','2026-04-03 12:12:37'),('e4edfc5a-8d72-4341-bd0f-e494b2c39e59','hq_company_001','owner_001','Lead Captured','{\"name\":\"John Smith\",\"source\":\"LinkedIn\",\"status\":\"new\"}','2026-04-03 12:12:37'),('ec434427-ea03-461c-a232-752ac12a7872','hq_company_001','owner_001','Lead Captured','{\"name\":\"Travis Tanner\",\"source\":\"LinkedIn\",\"status\":\"new\"}','2026-04-03 12:12:37'),('f4a75490-de75-4d47-bfb7-f84a7ca17429','hq_company_001','owner_001','Lead Captured','{\"name\":\"Andrew Malik\",\"source\":\"Organic\",\"status\":\"new\"}','2026-04-03 12:12:37');
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_keys`
--

DROP TABLE IF EXISTS `api_keys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_keys` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `company_id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `key_hash` varchar(255) NOT NULL,
  `key_preview` varchar(20) NOT NULL,
  `permissions` json NOT NULL,
  `environment` enum('live','test') DEFAULT 'live',
  `is_active` tinyint(1) DEFAULT '1',
  `rate_limit` int DEFAULT '1000',
  `calls_this_month` int DEFAULT '0',
  `last_used_at` datetime DEFAULT NULL,
  `last_used_ip` varchar(45) DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `revoked_at` datetime DEFAULT NULL,
  `revoked_by` char(36) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_hash` (`key_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_keys`
--

LOCK TABLES `api_keys` WRITE;
/*!40000 ALTER TABLE `api_keys` DISABLE KEYS */;
INSERT INTO `api_keys` VALUES ('85877ec4-2dd0-11f1-a4a0-005056c00001','comp-0001-0000-0000-000000000001','Website Contact Form',NULL,'5800326059cda5e1901650e5a4deb05b1fd64fd42a6fc5552150f41bb2c3d842','lf_live_a8f3...xy9z','{\"leads\": [\"write\"], \"call_logs\": [\"write\"]}','live',1,1000,0,NULL,NULL,NULL,'emp-e001-0000-0000-000000000001',NULL,NULL,'2026-04-01 19:11:44'),('858985a3-2dd0-11f1-a4a0-005056c00001','comp-0001-0000-0000-000000000001','Reporting Dashboard',NULL,'b0f713ee40f856d3f6e8fa6b000799370bd535d6b55d303dcf6d8bb78023e324','lf_live_b9g4...uv8w','{\"leads\": [\"read\"], \"analytics\": [\"read\"], \"employees\": [\"read\"]}','live',1,1000,0,NULL,NULL,NULL,'emp-e001-0000-0000-000000000001',NULL,NULL,'2026-04-01 19:11:44'),('858ac82f-2dd0-11f1-a4a0-005056c00001','comp-0001-0000-0000-000000000001','Test Key',NULL,'b6e8c44cf7b98eed800f2c16f0970b5a8127fa230658ceafe3e09325a0990aa7','lf_test_c1h5...rs7t','{\"leads\": [\"read\", \"write\"], \"analytics\": [\"read\"]}','test',1,1000,0,NULL,NULL,NULL,'emp-e001-0000-0000-000000000001',NULL,NULL,'2026-04-01 19:11:44'),('8ba8d7f3-cf62-40e7-9282-b95392d70413','hq_company_001','demo','','5070dca947146c38e3f966f60b6c62e2eeeb36f2376c38c190250f899110bed9','lf_live_5562...af5a','{\"leads\": [\"create\", \"read\"], \"analytics\": [\"read\"]}','live',1,10000,0,NULL,NULL,NULL,'owner_001',NULL,NULL,'2026-04-03 22:29:11'),('a0c2750e-e9a2-43db-8bf3-02b493b999fa','hq_company_001','new','','e85a9a33fcbac8aa37e61bc33605e0bc7179d9660746eca5de202240256105c5','lf_live_28fc...98c2','{\"leads\": [\"create\", \"read\"], \"analytics\": [\"read\"]}','live',1,1000,0,NULL,NULL,NULL,'owner_001',NULL,NULL,'2026-04-09 11:32:03');
/*!40000 ALTER TABLE `api_keys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_request_logs`
--

DROP TABLE IF EXISTS `api_request_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_request_logs` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `company_id` char(36) NOT NULL,
  `api_key_id` char(36) NOT NULL,
  `method` varchar(10) DEFAULT NULL,
  `endpoint` varchar(255) DEFAULT NULL,
  `status_code` int DEFAULT NULL,
  `response_time` int DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `request_body` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_request_logs`
--

LOCK TABLES `api_request_logs` WRITE;
/*!40000 ALTER TABLE `api_request_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_request_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignment_pointers`
--

DROP TABLE IF EXISTS `assignment_pointers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignment_pointers` (
  `company_id` char(36) NOT NULL,
  `last_index` int DEFAULT '0',
  PRIMARY KEY (`company_id`),
  CONSTRAINT `assignment_pointers_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment_pointers`
--

LOCK TABLES `assignment_pointers` WRITE;
/*!40000 ALTER TABLE `assignment_pointers` DISABLE KEYS */;
/*!40000 ALTER TABLE `assignment_pointers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) NOT NULL,
  `clock_in` datetime NOT NULL,
  `clock_out` datetime DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `date` date NOT NULL,
  `status` varchar(20) DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (1,'owner_001','2026-04-09 06:17:45','2026-04-09 06:19:30','/uploads/attendance/attendance-1775715465108.jpg','2026-04-09','inactive','2026-04-09 06:17:45'),(2,'owner_001','2026-04-09 06:19:49','2026-04-09 07:11:38','/uploads/attendance/attendance-1775715589409.jpg','2026-04-09','inactive','2026-04-09 06:19:49'),(3,'owner_001','2026-04-09 07:11:45','2026-04-09 09:27:13','/uploads/attendance/attendance-1775718705537.jpg','2026-04-09','inactive','2026-04-09 07:11:45'),(4,'owner_001','2026-04-09 09:27:17',NULL,'/uploads/attendance/attendance-1775726837319.jpg','2026-04-09','active','2026-04-09 09:27:17'),(5,'emp_001','2026-04-09 09:28:41','2026-04-09 09:40:54','/uploads/attendance/attendance-1775726921437.jpg','2026-04-09','inactive','2026-04-09 09:28:41'),(6,'emp_001','2026-04-09 09:40:59','2026-04-09 09:43:18','/uploads/attendance/attendance-1775727658006.jpg','2026-04-09','inactive','2026-04-09 09:40:59'),(7,'emp_001','2026-04-09 09:43:25',NULL,'/uploads/attendance/attendance-1775727803015.jpg','2026-04-09','active','2026-04-09 09:43:25'),(8,'5032fbbc-a570-45d5-adbf-2f4c77cd80c3','2026-04-09 15:42:32','2026-04-09 10:18:00','test_photo.jpg','2026-04-09','inactive','2026-04-09 10:12:32'),(9,'fd389775-30fe-4ccd-878a-f6dd7ec173b4','2026-04-09 10:19:05',NULL,'/uploads/attendance/attendance-1775729945132.jpg','2026-04-09','active','2026-04-09 10:19:05'),(10,'2d5f43aa-3401-11f1-ade7-005056c00001','2026-04-09 11:08:39','2026-04-09 11:08:54','/uploads/attendance/attendance-1775732919170.jpg','2026-04-09','inactive','2026-04-09 11:08:39'),(11,'2d5f43aa-3401-11f1-ade7-005056c00001','2026-04-09 12:19:04',NULL,'/uploads/attendance/attendance-1775737143918.jpg','2026-04-09','active','2026-04-09 12:19:04'),(12,'test_user_ai','2026-04-09 17:51:09',NULL,NULL,'2026-04-09','active','2026-04-09 12:21:09'),(13,'9577a116-f840-47bd-940e-987ff45d8b7b','2026-04-09 12:27:17','2026-04-09 12:27:28','/uploads/attendance/attendance-1775737637875.jpg','2026-04-09','inactive','2026-04-09 12:27:17'),(14,'9577a116-f840-47bd-940e-987ff45d8b7b','2026-04-09 12:27:43','2026-04-09 12:27:48','/uploads/attendance/attendance-1775737663192.jpg','2026-04-09','inactive','2026-04-09 12:27:43'),(15,'9577a116-f840-47bd-940e-987ff45d8b7b','2026-04-09 12:27:54','2026-04-09 12:27:59','/uploads/attendance/attendance-1775737674144.jpg','2026-04-09','inactive','2026-04-09 12:27:54'),(16,'9577a116-f840-47bd-940e-987ff45d8b7b','2026-04-09 12:28:03','2026-04-09 12:28:05','/uploads/attendance/attendance-1775737683109.jpg','2026-04-09','inactive','2026-04-09 12:28:03');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `company_id` char(36) DEFAULT NULL,
  `performed_by` char(36) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `entity_type` varchar(50) DEFAULT NULL,
  `entity_id` char(36) DEFAULT NULL,
  `old_value` json DEFAULT NULL,
  `new_value` json DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auto_response_settings`
--

DROP TABLE IF EXISTS `auto_response_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auto_response_settings` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `company_id` char(36) NOT NULL,
  `sms_enabled` tinyint(1) DEFAULT '0',
  `whatsapp_enabled` tinyint(1) DEFAULT '0',
  `sms_template` text,
  `whatsapp_template` text,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `company_id` (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auto_response_settings`
--

LOCK TABLES `auto_response_settings` WRITE;
/*!40000 ALTER TABLE `auto_response_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `auto_response_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blacklist`
--

DROP TABLE IF EXISTS `blacklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blacklist` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `company_id` char(36) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blacklist`
--

LOCK TABLES `blacklist` WRITE;
/*!40000 ALTER TABLE `blacklist` DISABLE KEYS */;
/*!40000 ALTER TABLE `blacklist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `call_logs`
--

DROP TABLE IF EXISTS `call_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `call_logs` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `company_id` char(36) NOT NULL,
  `lead_id` char(36) DEFAULT NULL,
  `employee_id` char(36) DEFAULT NULL,
  `call_status` enum('answered','missed') NOT NULL,
  `duration` int DEFAULT '0',
  `recording_url` text,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  KEY `lead_id` (`lead_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `call_logs_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
  CONSTRAINT `call_logs_ibfk_2` FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`),
  CONSTRAINT `call_logs_ibfk_3` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `call_logs`
--

LOCK TABLES `call_logs` WRITE;
/*!40000 ALTER TABLE `call_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `call_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `communication_logs`
--

DROP TABLE IF EXISTS `communication_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `communication_logs` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `company_id` char(36) NOT NULL,
  `lead_id` char(36) DEFAULT NULL,
  `phone_number` varchar(20) NOT NULL,
  `channel` enum('sms','whatsapp','email') NOT NULL,
  `message_text` text NOT NULL,
  `status` enum('sent','delivered','failed') DEFAULT 'sent',
  `triggered_by` enum('missed_call','manual','automation') NOT NULL,
  `sent_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `communication_logs`
--

LOCK TABLES `communication_logs` WRITE;
/*!40000 ALTER TABLE `communication_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `communication_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(100) NOT NULL,
  `owner_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subscription_status` enum('trial','active','suspended','cancelled') DEFAULT 'trial',
  `trial_ends_at` date DEFAULT NULL,
  `max_employees` int DEFAULT '5',
  `exotel_api_key` varchar(255) DEFAULT NULL,
  `exotel_api_token` varchar(255) DEFAULT NULL,
  `exotel_sid` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `acefone_api_key` varchar(255) DEFAULT NULL,
  `acefone_api_token` varchar(255) DEFAULT NULL,
  `telephony_provider` enum('exotel','acefone') DEFAULT 'exotel',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES ('comp-0001-0000-0000-000000000001','Elite Realty','Raghav Goyal','owner@eliterealty.com',NULL,'active',NULL,5,NULL,NULL,NULL,'2026-04-01 19:11:44',NULL,NULL,'exotel'),('comp-0002-0000-0000-000000000002','Alpha Builders','John Doe','john@alphabuilders.com',NULL,'active',NULL,5,NULL,NULL,NULL,'2026-04-01 19:11:44',NULL,NULL,'exotel'),('comp-0003-0000-0000-000000000003','Gamma Group','Jane Smith','jane@gammagroup.com',NULL,'suspended',NULL,5,NULL,NULL,NULL,'2026-04-01 19:11:44',NULL,NULL,'exotel'),('hq_company_001','Tricity Verified HQ','Raghav Goyal','owner@Tricity Verified.com','9999999999','active',NULL,5,NULL,NULL,NULL,'2026-03-31 19:23:08',NULL,NULL,'exotel');
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `company_id` char(36) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('superadmin','admin','employee') DEFAULT 'employee',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `acefone_extension` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES ('2d5f43aa-3401-11f1-ade7-005056c00001','comp-0001-0000-0000-000000000001','Arjun Sharma',NULL,'arjun@eliterealty.com','$2b$10$m.tGoubK6E8fIiPiC9FpdOH5BbrsYlsbjvfn2d5CTv0Qb7jbTwMDe','employee',1,'2026-04-09 16:15:08',NULL,NULL),('2d70ca3b-3401-11f1-ade7-005056c00001','comp-0001-0000-0000-000000000001','Priya Singh',NULL,'priya@eliterealty.com','$2b$10$m.tGoubK6E8fIiPiC9FpdOH5BbrsYlsbjvfn2d5CTv0Qb7jbTwMDe','employee',1,'2026-04-09 16:15:08',NULL,NULL),('2d72c3bf-3401-11f1-ade7-005056c00001','comp-0001-0000-0000-000000000001','Rahul Kumar',NULL,'rahul@eliterealty.com','$2b$10$m.tGoubK6E8fIiPiC9FpdOH5BbrsYlsbjvfn2d5CTv0Qb7jbTwMDe','employee',1,'2026-04-09 16:15:08',NULL,NULL),('4757533c-4c1c-475d-8fb2-3d67c261a2e0','comp-0001-0000-0000-000000000001','mohammad',NULL,'mohammad@eliterealty.com','$2b$10$7VeQWx5BTlmXgkHIEwac7ObVs.6c2X54wGDij0RH0Op9V5bIVOK9q','employee',1,'2026-04-09 16:40:10',NULL,'1450'),('5032fbbc-a570-45d5-adbf-2f4c77cd80c3','comp-0001-0000-0000-000000000001','Arjun Sharma',NULL,'arjun@Tricity Verified.com','$2b$10$JOr9sqWO81f9/DdO1pqZcud8h9zr99Ru4Z5k8gGWt0zIOhI9.HoNq','employee',1,'2026-04-09 15:13:20',NULL,'1001'),('637402ee-76d6-4004-80bf-dcd1d5d45812','comp-0001-0000-0000-000000000001','Priya Verma',NULL,'priya.v@Tricity Verified.com','$2b$10$JOr9sqWO81f9/DdO1pqZcud8h9zr99Ru4Z5k8gGWt0zIOhI9.HoNq','employee',1,'2026-04-09 15:13:20',NULL,'1002'),('9577a116-f840-47bd-940e-987ff45d8b7b','comp-0001-0000-0000-000000000001','virat','+91 8596253645','virat@eliterealty.com','$2b$10$d5afeFoLeeae31bsuxfisuGrTtzLxXVwQGIeA8nfQOHpZy8lS7j/C','employee',1,'2026-04-09 17:29:27',NULL,'7145'),('emp_001','comp-0001-0000-0000-000000000001','John Staff (Employee)',NULL,'employee@Tricity Verified.com','$2a$12$errni03SlBDUvHUJE8mcOuTuM0ifxzt/6efUumlnDX4j4Dh16/KE.','employee',1,'2026-03-31 19:23:08',NULL,NULL),('emp-a001-0000-0000-000000000001','comp-0002-0000-0000-000000000002','Alpha Admin',NULL,'admin@alphabuilders.com','---','admin',1,'2026-04-01 19:11:44',NULL,NULL),('emp-e001-0000-0000-000000000001','comp-0001-0000-0000-000000000001','Elite Admin',NULL,'admin@eliterealty.com','$2b$10$74/p7o7XgvhD8Ail6uQ60ewho0BwoTOZmfHpXi5SoyxUfXx30bH6e','admin',1,'2026-04-01 19:11:44',NULL,NULL),('emp-e003-0000-0000-000000000003','comp-0001-0000-0000-000000000001','Vikram Shah',NULL,'vikram@eliterealty.com','---','employee',1,'2026-04-01 19:11:44',NULL,NULL),('emp-e004-0000-0000-000000000004','comp-0001-0000-0000-000000000001','Sneha Patel',NULL,'sneha@eliterealty.com','---','employee',1,'2026-04-01 19:11:44',NULL,NULL),('emp-super-0000-0000-000000000001','comp-0003-0000-0000-000000000003','Super Admin',NULL,'super@Tricity Verified.com','$2b$10$//lCwx.h9Fa7b.HYrQdp4OUjSxEJHZpd4gzDjkW2Uf8fSrXyaaTf2','superadmin',1,'2026-04-01 19:11:44',NULL,NULL),('fd389775-30fe-4ccd-878a-f6dd7ec173b4','comp-0001-0000-0000-000000000001','Rahul Gupta',NULL,'rahul@Tricity Verified.com','$2b$10$JOr9sqWO81f9/DdO1pqZcud8h9zr99Ru4Z5k8gGWt0zIOhI9.HoNq','employee',1,'2026-04-09 15:13:20',NULL,'1003'),('owner_001','hq_company_001','Raghav Goyal (Owner)',NULL,'owner@Tricity Verified.com','$2b$10$74/p7o7XgvhD8Ail6uQ60ewho0BwoTOZmfHpXi5SoyxUfXx30bH6e','admin',1,'2026-03-31 19:23:08',NULL,NULL);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follow_ups`
--

DROP TABLE IF EXISTS `follow_ups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follow_ups` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `company_id` char(36) NOT NULL,
  `lead_id` char(36) NOT NULL,
  `employee_id` char(36) NOT NULL,
  `next_followup_date` datetime NOT NULL,
  `note` text,
  `is_done` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  KEY `lead_id` (`lead_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `follow_ups_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
  CONSTRAINT `follow_ups_ibfk_2` FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`),
  CONSTRAINT `follow_ups_ibfk_3` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follow_ups`
--

LOCK TABLES `follow_ups` WRITE;
/*!40000 ALTER TABLE `follow_ups` DISABLE KEYS */;
INSERT INTO `follow_ups` VALUES ('05844916-6b47-4717-858a-32a9730756d5','comp-0001-0000-0000-000000000001','2fec6763-c6db-454d-bbc4-2ebb7173c8d9','emp-e001-0000-0000-000000000001','2026-04-03 03:37:09','Follow up with Michael Ross.',0,'2026-04-02 22:37:08'),('0b86f193-7180-45c1-aca4-c8cad4ca2e8b','hq_company_001','bf557b8c-6a07-4f66-9dba-56f28d2c4204','owner_001','2026-04-04 05:12:37','Follow up with Robert Zane.',0,'2026-04-03 12:12:37'),('14575664-58d9-41d7-b1bc-9b20f5f653f5','hq_company_001','339b9c12-b0c9-4a4e-946b-7be8ffab2fef','owner_001','2026-04-03 18:12:37','Follow up with Alex Williams.',0,'2026-04-03 12:12:37'),('166980b5-58c9-4744-b64f-e2aaf2dd8ad4','comp-0001-0000-0000-000000000001','2e0ccb4b-92ca-43ea-8300-d9fa6fa92bb0','emp-e001-0000-0000-000000000001','2026-04-03 10:37:09','Follow up with Louis Litt.',0,'2026-04-02 22:37:08'),('18f065db-1c7e-41c5-8438-0a16bed87536','hq_company_001','cbfc5170-2451-4b87-8f00-ec5d58246218','owner_001','2026-04-03 18:12:38','Follow up with Cameron Dennis.',0,'2026-04-03 12:12:37'),('2e35431f-ee5d-4973-8f40-e429bdf2e5b0','comp-0001-0000-0000-000000000001','0264b896-838c-409b-a136-0b65dde5664a','emp-e001-0000-0000-000000000001','2026-04-04 18:37:09','Follow up with Robert Zane.',0,'2026-04-02 22:37:08'),('336f03f8-f19e-4f85-98c2-fbc52df538e1','comp-0001-0000-0000-000000000001','324f9c41-ba6f-447f-ada3-7d8ec95b8baa','emp-e001-0000-0000-000000000001','2026-04-03 02:37:09','Follow up with Jessica Pearson.',0,'2026-04-02 22:37:08'),('3c6c9c78-c904-4ed9-a393-afd3f4649056','comp-0001-0000-0000-000000000001','82817148-72fd-4afa-976e-be3175eeb9cb','emp_001','2026-04-03 15:39:57','Follow up with Katrina Bennett.',0,'2026-04-02 22:39:57'),('4fac68f5-5696-4859-98af-896437c6bf83','comp-0001-0000-0000-000000000001','26ec7f0b-f6ec-42e8-ac76-efea7998fe9a','emp_001','2026-04-03 19:39:57','Follow up with John Smith.',0,'2026-04-02 22:39:56'),('633a8394-64dd-4211-9455-cc4e33dc62d8','hq_company_001','eb185e6f-8452-4dd2-89a8-b6b84c529511','owner_001','2026-04-04 02:12:37','Follow up with Harvey Specter.',0,'2026-04-03 12:12:37'),('64935e3c-38f2-4bca-be29-9ceb4903037e','hq_company_001','1632ee67-5946-4cb9-b529-3e566232ea72','owner_001','2026-04-05 07:12:37','Follow up with Louis Litt.',0,'2026-04-03 12:12:37'),('6793fea1-8c2b-403e-990a-095a35ae7b14','hq_company_001','3756f11f-5524-4321-8b19-9a7cc249ad52','owner_001','2026-04-04 02:12:37','Follow up with John Smith.',0,'2026-04-03 12:12:37'),('6df5a400-1956-4028-85d8-378513bf1fd0','hq_company_001','46ddb6a2-e4ee-44e9-a958-9ff39aa2f255','owner_001','2026-04-04 14:12:38','Follow up with Travis Tanner.',0,'2026-04-03 12:12:37'),('74a572f6-1144-4d0c-a20f-89b6c327fd04','comp-0001-0000-0000-000000000001','4089a37d-67a8-4e81-b942-b75211c326ea','emp_001','2026-04-04 09:39:57','Follow up with Sarah Jenkins.',0,'2026-04-02 22:39:56'),('7d5e22c6-867a-4b57-9b2c-6130843b59e9','hq_company_001','0a5a8da6-5355-4d0b-88db-bc73e5644576','owner_001','2026-04-03 16:12:37','Follow up with Samantha Wheeler.',0,'2026-04-03 12:12:37'),('80416092-9c56-4e90-831a-0cf1b42b9533','hq_company_001','ef229b31-b42b-498d-ae70-3e8b26b340bf','owner_001','2026-04-04 03:12:37','Follow up with Jeff Malone.',0,'2026-04-03 12:12:37'),('8486a2d9-0f79-47ea-bf1b-36bf6df730dc','comp-0001-0000-0000-000000000001','f6a8769d-25c7-426e-8f7d-4f79cec782f5','emp_001','2026-04-03 03:39:57','Follow up with Louis Litt.',0,'2026-04-02 22:39:57'),('89db8ea1-72c8-4e30-a813-06bdcbb28367','hq_company_001','01d36897-2004-4c78-8021-b72d7ab1b75e','owner_001','2026-04-04 11:12:37','Follow up with Jessica Pearson.',0,'2026-04-03 12:12:37'),('952e7d57-c7c5-403b-b4a7-e9ba0e45a198','hq_company_001','4ac35456-3706-4955-aab9-5d4e111c37c6','owner_001','2026-04-04 23:12:38','Follow up with Anita Gibbs.',0,'2026-04-03 12:12:37'),('a1e106d5-dbfb-4bea-8f50-1ef049951f43','comp-0001-0000-0000-000000000001','958bb85e-9cc2-4b14-bc04-f51441a7d5e4','emp-e001-0000-0000-000000000001','2026-04-03 00:37:09','Follow up with Rachel Zane.',0,'2026-04-02 22:37:08'),('a3db958f-a906-46a1-99b1-6eeb9f15ba16','comp-0001-0000-0000-000000000001','aeefcf4c-25be-4b55-9eba-3036c70d60c8','emp_001','2026-04-03 05:39:57','Follow up with Jessica Pearson.',0,'2026-04-02 22:39:57'),('af2bafa3-f661-4f81-9a7b-bf51f6802637','hq_company_001','4d29d530-f09f-4dc6-9139-2de43fd285df','owner_001','2026-04-05 05:12:38','Follow up with Scottie Scott.',0,'2026-04-03 12:12:37'),('b50cd13f-61b1-4e71-84ef-b60c23d02b57','comp-0001-0000-0000-000000000001','29e93a30-f0a5-496c-9bcc-f4f428e7fa24','emp-e001-0000-0000-000000000001','2026-04-03 14:37:08','Follow up with Sarah Jenkins.',0,'2026-04-02 22:37:08'),('ba96b4a0-e3ff-4606-afb5-7e81058d6207','hq_company_001','82084961-0c87-4842-8b1b-ccd0acf286eb','owner_001','2026-04-04 01:12:37','Follow up with Katrina Bennett.',0,'2026-04-03 12:12:37'),('bb631541-8377-409f-90ec-fe367bfe1184','hq_company_001','bdb17dc5-20b0-496f-85be-ff696398d015','owner_001','2026-04-04 18:12:37','Follow up with Michael Ross.',0,'2026-04-03 12:12:37'),('c35f5a54-df0a-4677-8005-65f9404fa152','comp-0001-0000-0000-000000000001','228cc19d-ca90-48cd-852a-545d99eb2867','emp_001','2026-04-04 18:39:57','Follow up with Michael Ross.',0,'2026-04-02 22:39:56'),('c6c89bb8-22ca-4c19-8703-eb2ed9434047','hq_company_001','171cd939-0d98-44e0-afd1-d6b0647baf72','owner_001','2026-04-04 00:12:37','Follow up with Rachel Zane.',0,'2026-04-03 12:12:37'),('caa3a0bb-34a1-4846-9654-59e4f7cac856','comp-0001-0000-0000-000000000001','5b3f1725-371d-4596-b0cf-6973d141f562','emp-e001-0000-0000-000000000001','2026-04-03 06:37:09','Follow up with Katrina Bennett.',0,'2026-04-02 22:37:08'),('d3c8322a-fa4e-486c-a9d6-8e3842f6a2ce','comp-0001-0000-0000-000000000001','f7c7c5cc-7893-4a82-b21a-90938dfbbdae','emp-e001-0000-0000-000000000001','2026-04-03 17:37:09','Follow up with Donna Paulsen.',0,'2026-04-02 22:37:08'),('e42a81e7-2735-4760-8981-9d215fa59f22','comp-0001-0000-0000-000000000001','fe9782f6-381d-4b30-a526-dae57af463e0','emp_001','2026-04-04 02:39:57','Follow up with Robert Zane.',0,'2026-04-02 22:39:57'),('f1cb3a8f-199c-4584-9df3-21fe16dafb86','hq_company_001','af74c1c9-efa7-46e2-b8ef-c6e5c1514e01','owner_001','2026-04-04 13:12:37','Follow up with Sarah Jenkins.',0,'2026-04-03 12:12:37'),('ff53f9f7-192c-4636-b584-9eb068d96afd','comp-0001-0000-0000-000000000001','c406fdfe-f1f8-473b-8a23-6919b1b43480','emp-e001-0000-0000-000000000001','2026-04-04 14:37:09','Follow up with Harvey Specter.',0,'2026-04-02 22:37:08');
/*!40000 ALTER TABLE `follow_ups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lead_locks`
--

DROP TABLE IF EXISTS `lead_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lead_locks` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `lead_id` char(36) NOT NULL,
  `locked_by` char(36) NOT NULL,
  `locked_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `expires_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lead_id` (`lead_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lead_locks`
--

LOCK TABLES `lead_locks` WRITE;
/*!40000 ALTER TABLE `lead_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `lead_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lead_notes`
--

DROP TABLE IF EXISTS `lead_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lead_notes` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `company_id` char(36) NOT NULL,
  `lead_id` char(36) NOT NULL,
  `employee_id` char(36) NOT NULL,
  `note` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  KEY `lead_id` (`lead_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `lead_notes_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
  CONSTRAINT `lead_notes_ibfk_2` FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`),
  CONSTRAINT `lead_notes_ibfk_3` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lead_notes`
--

LOCK TABLES `lead_notes` WRITE;
/*!40000 ALTER TABLE `lead_notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `lead_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leads`
--

DROP TABLE IF EXISTS `leads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leads` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `company_id` char(36) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `source` varchar(50) DEFAULT 'youtube',
  `assigned_to` char(36) DEFAULT NULL,
  `status` enum('new','contacted','interested','site_visit','closed','lost') DEFAULT 'new',
  `call_time` datetime DEFAULT NULL,
  `call_recording_url` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `app_name` varchar(100) DEFAULT 'Exotel',
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  KEY `assigned_to` (`assigned_to`),
  CONSTRAINT `leads_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
  CONSTRAINT `leads_ibfk_2` FOREIGN KEY (`assigned_to`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leads`
--

LOCK TABLES `leads` WRITE;
/*!40000 ALTER TABLE `leads` DISABLE KEYS */;
INSERT INTO `leads` VALUES ('01d36897-2004-4c78-8021-b72d7ab1b75e','hq_company_001','9477309168','Jessica Pearson','Referral','owner_001','lost',NULL,NULL,'2026-04-03 12:12:37','2026-04-03 12:12:37',NULL,'Exotel'),('0264b896-838c-409b-a136-0b65dde5664a','comp-0001-0000-0000-000000000001','9740493982','Robert Zane','Facebook','5032fbbc-a570-45d5-adbf-2f4c77cd80c3','site_visit',NULL,NULL,'2026-04-02 22:37:08','2026-04-09 15:14:04',NULL,'Exotel'),('0a5a8da6-5355-4d0b-88db-bc73e5644576','hq_company_001','9725165507','Samantha Wheeler','LinkedIn','owner_001','new',NULL,NULL,'2026-04-03 12:12:37','2026-04-03 12:12:37',NULL,'Exotel'),('1632ee67-5946-4cb9-b529-3e566232ea72','hq_company_001','9879212730','Louis Litt','Facebook','owner_001','lost',NULL,NULL,'2026-04-03 12:12:37','2026-04-03 12:12:37',NULL,'Exotel'),('171cd939-0d98-44e0-afd1-d6b0647baf72','hq_company_001','9416241793','Rachel Zane','Organic','owner_001','site_visit',NULL,NULL,'2026-04-03 12:12:37','2026-04-03 12:12:37',NULL,'Exotel'),('228cc19d-ca90-48cd-852a-545d99eb2867','comp-0001-0000-0000-000000000001','9749643566','Michael Ross','Facebook','637402ee-76d6-4004-80bf-dcd1d5d45812','new',NULL,NULL,'2026-04-02 22:39:56','2026-04-09 15:14:04',NULL,'Exotel'),('264f2545-c93b-407e-a97b-f077ccdba26b','comp-0001-0000-0000-000000000001','9452742433','Harvey Specter','LinkedIn','fd389775-30fe-4ccd-878a-f6dd7ec173b4','closed',NULL,NULL,'2026-04-02 22:39:57','2026-04-09 15:14:04',NULL,'Exotel'),('26ec7f0b-f6ec-42e8-ac76-efea7998fe9a','comp-0001-0000-0000-000000000001','9332224736','John Smith','LinkedIn','5032fbbc-a570-45d5-adbf-2f4c77cd80c3','interested',NULL,NULL,'2026-04-02 22:39:56','2026-04-09 15:14:04',NULL,'Exotel'),('29e93a30-f0a5-496c-9bcc-f4f428e7fa24','comp-0001-0000-0000-000000000001','9414303271','Sarah Jenkins','Organic','637402ee-76d6-4004-80bf-dcd1d5d45812','interested',NULL,NULL,'2026-04-02 22:37:08','2026-04-09 15:14:04',NULL,'Exotel'),('2e0ccb4b-92ca-43ea-8300-d9fa6fa92bb0','comp-0001-0000-0000-000000000001','9977944931','Louis Litt','Referral','fd389775-30fe-4ccd-878a-f6dd7ec173b4','site_visit',NULL,NULL,'2026-04-02 22:37:08','2026-04-09 15:14:04',NULL,'Exotel'),('2fec6763-c6db-454d-bbc4-2ebb7173c8d9','comp-0001-0000-0000-000000000001','9343366916','Michael Ross','Referral','5032fbbc-a570-45d5-adbf-2f4c77cd80c3','closed',NULL,NULL,'2026-04-02 22:37:08','2026-04-09 15:14:04',NULL,'Exotel'),('324f9c41-ba6f-447f-ada3-7d8ec95b8baa','comp-0001-0000-0000-000000000001','9703615217','Jessica Pearson','Referral','637402ee-76d6-4004-80bf-dcd1d5d45812','closed',NULL,NULL,'2026-04-02 22:37:08','2026-04-09 15:14:04',NULL,'Exotel'),('339b9c12-b0c9-4a4e-946b-7be8ffab2fef','hq_company_001','9124266295','Alex Williams','LinkedIn','owner_001','interested',NULL,NULL,'2026-04-03 12:12:37','2026-04-03 12:12:37',NULL,'Exotel'),('3756f11f-5524-4321-8b19-9a7cc249ad52','hq_company_001','9687713190','John Smith','LinkedIn','owner_001','new',NULL,NULL,'2026-04-03 12:12:37','2026-04-03 12:12:37',NULL,'Exotel'),('3ba5dd39-aa4b-4429-af34-1da3d0fce5ff','comp-0001-0000-0000-000000000001','8574968574','raghav ','Website','emp-e001-0000-0000-000000000001','lost',NULL,NULL,'2026-04-09 17:51:29','2026-04-09 17:51:49',NULL,'Exotel'),('3c7b9c18-d0a4-482f-b36b-fb8e4926fa03','hq_company_001','7894196358','ewregdn','Website','owner_001','new',NULL,NULL,'2026-04-03 14:44:40','2026-04-03 14:44:40',NULL,'Exotel'),('4089a37d-67a8-4e81-b942-b75211c326ea','comp-0001-0000-0000-000000000001','9106768082','Sarah Jenkins','Referral','fd389775-30fe-4ccd-878a-f6dd7ec173b4','closed',NULL,NULL,'2026-04-02 22:39:56','2026-04-09 15:14:04',NULL,'Exotel'),('46ddb6a2-e4ee-44e9-a958-9ff39aa2f255','hq_company_001','9225312859','Travis Tanner','LinkedIn','owner_001','new',NULL,NULL,'2026-04-03 12:12:37','2026-04-03 12:12:37',NULL,'Exotel'),('4ac35456-3706-4955-aab9-5d4e111c37c6','hq_company_001','9739410099','Anita Gibbs','LinkedIn','owner_001','new',NULL,NULL,'2026-04-03 12:12:37','2026-04-03 12:12:37',NULL,'Exotel'),('4d29d530-f09f-4dc6-9139-2de43fd285df','hq_company_001','9405311164','Scottie Scott','LinkedIn','owner_001','site_visit',NULL,NULL,'2026-04-03 12:12:37','2026-04-03 12:12:37',NULL,'Exotel'),('53f8aa9e-b3ea-46ec-b447-46c057fd1a51','hq_company_001','55','dgfhg','Website','owner_001','new',NULL,NULL,'2026-04-03 22:30:28','2026-04-03 22:30:46',NULL,'Exotel'),('5b3f1725-371d-4596-b0cf-6973d141f562','comp-0001-0000-0000-000000000001','9981453104','Katrina Bennett','Google Ads','emp-e001-0000-0000-000000000001','site_visit',NULL,NULL,'2026-04-02 22:37:08','2026-04-02 22:37:08',NULL,'Exotel'),('5cfc7874-012a-4c07-8ba0-6c2d048b0af6','hq_company_001','9590465803','Donna Paulsen','Organic','owner_001','lost',NULL,NULL,'2026-04-03 12:12:37','2026-04-03 12:12:37',NULL,'Exotel'),('6ec2606d-7c64-4bf5-aaba-9565be2cd7d9','hq_company_001','9413893507','Daniel Hardman','LinkedIn','owner_001','interested',NULL,NULL,'2026-04-03 12:12:37','2026-04-03 12:12:37',NULL,'Exotel'),('7138077d-0c47-4155-93ea-e2db42608482','hq_company_001','9685741256','raghav','Website','owner_001','new',NULL,NULL,'2026-04-03 14:45:02','2026-04-03 14:45:02',NULL,'Exotel'),('82084961-0c87-4842-8b1b-ccd0acf286eb','hq_company_001','9289904846','Katrina Bennett','LinkedIn','owner_001','new',NULL,NULL,'2026-04-03 12:12:37','2026-04-03 12:12:37',NULL,'Exotel'),('82817148-72fd-4afa-976e-be3175eeb9cb','comp-0001-0000-0000-000000000001','9999222721','Katrina Bennett','Organic','emp_001','new',NULL,NULL,'2026-04-02 22:39:57','2026-04-02 22:39:57',NULL,'Exotel'),('8442384a-d27b-4a21-9e91-f416cb167674','hq_company_001','9429676050','Andrew Malik','Organic','owner_001','new',NULL,NULL,'2026-04-03 12:12:37','2026-04-03 12:12:37',NULL,'Exotel'),('949d2ce6-04ab-4bba-8613-da15afc5c2e2','comp-0001-0000-0000-000000000001','9980053023','John Smith','LinkedIn','emp-e001-0000-0000-000000000001','closed',NULL,NULL,'2026-04-02 22:37:08','2026-04-02 22:37:08',NULL,'Exotel'),('952ebcac-d883-4fb3-94fa-5b1c77eac770','comp-0001-0000-0000-000000000001','9911738598','Rachel Zane','Google Ads','emp_001','lost',NULL,NULL,'2026-04-02 22:39:57','2026-04-02 22:39:57',NULL,'Exotel'),('958bb85e-9cc2-4b14-bc04-f51441a7d5e4','comp-0001-0000-0000-000000000001','9116956290','Rachel Zane','Facebook','emp-e001-0000-0000-000000000001','interested',NULL,NULL,'2026-04-02 22:37:08','2026-04-02 22:37:08',NULL,'Exotel'),('aeefcf4c-25be-4b55-9eba-3036c70d60c8','comp-0001-0000-0000-000000000001','9307605221','Jessica Pearson','Referral','emp_001','new',NULL,NULL,'2026-04-02 22:39:57','2026-04-02 22:39:57',NULL,'Exotel'),('af74c1c9-efa7-46e2-b8ef-c6e5c1514e01','hq_company_001','9141412237','Sarah Jenkins','Organic','owner_001','lost',NULL,NULL,'2026-04-03 12:12:37','2026-04-03 12:12:37',NULL,'Exotel'),('affbcf28-1778-4fd4-81c6-daf6e2ea9772','comp-0003-0000-0000-000000000003','+91 9905278722','John Smith','Organic',NULL,'closed',NULL,NULL,'2026-04-02 20:27:03','2026-04-02 20:27:03',NULL,'Exotel'),('bdb17dc5-20b0-496f-85be-ff696398d015','hq_company_001','9991756861','Michael Ross','Facebook','owner_001','closed',NULL,NULL,'2026-04-03 12:12:37','2026-04-03 12:12:37',NULL,'Exotel'),('bf557b8c-6a07-4f66-9dba-56f28d2c4204','hq_company_001','9434605868','Robert Zane','Referral','owner_001','new',NULL,NULL,'2026-04-03 12:12:37','2026-04-03 12:12:37',NULL,'Exotel'),('c406fdfe-f1f8-473b-8a23-6919b1b43480','comp-0001-0000-0000-000000000001','9829693065','Harvey Specter','LinkedIn','emp-e001-0000-0000-000000000001','new',NULL,NULL,'2026-04-02 22:37:08','2026-04-02 22:37:08',NULL,'Exotel'),('cbfc5170-2451-4b87-8f00-ec5d58246218','hq_company_001','9533273974','Cameron Dennis','Google Ads','owner_001','site_visit',NULL,NULL,'2026-04-03 12:12:37','2026-04-03 12:12:37',NULL,'Exotel'),('ea677520-f3c0-461a-af53-5e4e826ecf8b','comp-0003-0000-0000-000000000003','+91 9412060980','John Smith','LinkedIn',NULL,'new',NULL,NULL,'2026-04-02 20:24:54','2026-04-02 20:24:54',NULL,'Exotel'),('eb185e6f-8452-4dd2-89a8-b6b84c529511','hq_company_001','9109559089','Harvey Specter','Referral','owner_001','closed',NULL,NULL,'2026-04-03 12:12:37','2026-04-03 12:12:37',NULL,'Exotel'),('ef229b31-b42b-498d-ae70-3e8b26b340bf','hq_company_001','9154520618','Jeff Malone','Facebook','owner_001','closed',NULL,NULL,'2026-04-03 12:12:37','2026-04-03 12:12:37',NULL,'Exotel'),('f6a8769d-25c7-426e-8f7d-4f79cec782f5','comp-0001-0000-0000-000000000001','9768760608','Louis Litt','Facebook','emp_001','interested',NULL,NULL,'2026-04-02 22:39:57','2026-04-02 22:39:57',NULL,'Exotel'),('f7c7c5cc-7893-4a82-b21a-90938dfbbdae','comp-0001-0000-0000-000000000001','9726279903','Donna Paulsen','Google Ads','emp-e001-0000-0000-000000000001','site_visit',NULL,NULL,'2026-04-02 22:37:08','2026-04-02 22:37:08',NULL,'Exotel'),('fbdfd073-8717-44fc-a11c-dba28fe4f00b','comp-0001-0000-0000-000000000001','9307411847','Donna Paulsen','Google Ads','emp_001','closed',NULL,NULL,'2026-04-02 22:39:57','2026-04-02 22:39:57',NULL,'Exotel'),('fe9782f6-381d-4b30-a526-dae57af463e0','comp-0001-0000-0000-000000000001','9459591401','Robert Zane','Google Ads','emp_001','closed',NULL,NULL,'2026-04-02 22:39:57','2026-04-02 22:39:57',NULL,'Exotel'),('ffe54a7e-5976-48af-9499-716603b4ecc2','hq_company_001','9824549865','Sean Cahill','Referral','owner_001','site_visit',NULL,NULL,'2026-04-03 12:12:37','2026-04-03 12:12:37',NULL,'Exotel'),('test-1775203925046','hq_company_001','1234567890','Debug User','website',NULL,'new',NULL,NULL,'2026-04-03 13:42:05','2026-04-03 13:42:05',NULL,'Exotel');
/*!40000 ALTER TABLE `leads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `live_calls`
--

DROP TABLE IF EXISTS `live_calls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `live_calls` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `company_id` char(36) NOT NULL,
  `call_sid` varchar(100) DEFAULT NULL,
  `caller_number` varchar(20) DEFAULT NULL,
  `employee_id` char(36) DEFAULT NULL,
  `lead_id` char(36) DEFAULT NULL,
  `direction` enum('inbound','outbound') DEFAULT 'inbound',
  `started_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('ringing','in-progress','completed','failed') DEFAULT 'ringing',
  PRIMARY KEY (`id`),
  UNIQUE KEY `call_sid` (`call_sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `live_calls`
--

LOCK TABLES `live_calls` WRITE;
/*!40000 ALTER TABLE `live_calls` DISABLE KEYS */;
/*!40000 ALTER TABLE `live_calls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lottery_campaigns`
--

DROP TABLE IF EXISTS `lottery_campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lottery_campaigns` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `company_id` char(36) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text,
  `price_per_token` decimal(10,2) NOT NULL DEFAULT '1100.00',
  `total_tokens` int NOT NULL DEFAULT '100000',
  `tokens_sold` int DEFAULT '0',
  `campaign_start_date` date NOT NULL,
  `campaign_end_date` date NOT NULL,
  `draw_date` date DEFAULT NULL,
  `prize_description` text,
  `prize_value` decimal(12,2) DEFAULT NULL,
  `winners_count` int DEFAULT '100',
  `refund_amount` decimal(10,2) DEFAULT '1100.00',
  `status` enum('draft','active','completed','cancelled') DEFAULT 'draft',
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lottery_campaigns`
--

LOCK TABLES `lottery_campaigns` WRITE;
/*!40000 ALTER TABLE `lottery_campaigns` DISABLE KEYS */;
INSERT INTO `lottery_campaigns` VALUES ('lott-0001-0000-0000-000000000001','comp-0001-0000-0000-000000000001','Elite Realty Lucky Plot Scheme 2026','Buy a token at Rs.1100 and win a plot worth 10 lakhs. 100 winners will be selected by lucky draw in March 2027. All non-winners receive full refund of Rs.1100.',1100.00,100000,247,'2026-03-01','2027-03-01','2027-03-15','100 plots worth Rs.10 Lakhs each in Elite Realty Township, Sector 45, Noida',1000000.00,100,1100.00,'active','emp-e001-0000-0000-000000000001','2026-04-01 19:11:44','2026-04-01 19:11:44');
/*!40000 ALTER TABLE `lottery_campaigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lottery_participants`
--

DROP TABLE IF EXISTS `lottery_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lottery_participants` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `company_id` char(36) NOT NULL,
  `campaign_id` char(36) NOT NULL,
  `token_number` varchar(20) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `father_name` varchar(150) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `phone_number` varchar(20) NOT NULL,
  `alternate_phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address_line1` varchar(255) DEFAULT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `aadhar_number` varchar(20) DEFAULT NULL,
  `pan_number` varchar(20) DEFAULT NULL,
  `payment_status` enum('pending','paid','refunded','failed') DEFAULT 'pending',
  `payment_method` enum('cash','upi','netbanking','card','cheque') DEFAULT NULL,
  `payment_reference` varchar(100) DEFAULT NULL,
  `payment_date` datetime DEFAULT NULL,
  `payment_amount` decimal(10,2) DEFAULT '1100.00',
  `is_winner` tinyint(1) DEFAULT '0',
  `prize_details` text,
  `prize_delivered` tinyint(1) DEFAULT '0',
  `refund_status` enum('pending','processed','completed') DEFAULT 'pending',
  `refund_date` datetime DEFAULT NULL,
  `notes` text,
  `added_by` char(36) DEFAULT NULL,
  `source` enum('manual','excel_import','api') DEFAULT 'manual',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_number` (`token_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lottery_participants`
--

LOCK TABLES `lottery_participants` WRITE;
/*!40000 ALTER TABLE `lottery_participants` DISABLE KEYS */;
/*!40000 ALTER TABLE `lottery_participants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lottery_winners`
--

DROP TABLE IF EXISTS `lottery_winners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lottery_winners` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `company_id` char(36) NOT NULL,
  `campaign_id` char(36) NOT NULL,
  `participant_id` char(36) NOT NULL,
  `token_number` varchar(20) DEFAULT NULL,
  `prize_rank` int DEFAULT NULL,
  `prize_description` text,
  `prize_value` decimal(12,2) DEFAULT NULL,
  `announced_at` datetime DEFAULT NULL,
  `prize_delivered` tinyint(1) DEFAULT '0',
  `delivery_date` datetime DEFAULT NULL,
  `notes` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lottery_winners`
--

LOCK TABLES `lottery_winners` WRITE;
/*!40000 ALTER TABLE `lottery_winners` DISABLE KEYS */;
/*!40000 ALTER TABLE `lottery_winners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `outbound_campaigns`
--

DROP TABLE IF EXISTS `outbound_campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `outbound_campaigns` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `company_id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `total_numbers` int DEFAULT '0',
  `daily_limit` int DEFAULT '1000',
  `calls_made_today` int DEFAULT '0',
  `status` enum('draft','running','paused','completed') DEFAULT 'draft',
  `created_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `started_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `outbound_campaigns_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outbound_campaigns`
--

LOCK TABLES `outbound_campaigns` WRITE;
/*!40000 ALTER TABLE `outbound_campaigns` DISABLE KEYS */;
/*!40000 ALTER TABLE `outbound_campaigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `outbound_numbers`
--

DROP TABLE IF EXISTS `outbound_numbers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `outbound_numbers` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `company_id` char(36) NOT NULL,
  `campaign_id` char(36) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `last_call_status` enum('pending','answered','missed','interested','not_interested') DEFAULT 'pending',
  `retry_count` int DEFAULT '0',
  `last_call_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `campaign_id` (`campaign_id`),
  CONSTRAINT `outbound_numbers_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `outbound_campaigns` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outbound_numbers`
--

LOCK TABLES `outbound_numbers` WRITE;
/*!40000 ALTER TABLE `outbound_numbers` DISABLE KEYS */;
/*!40000 ALTER TABLE `outbound_numbers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `retry_queue`
--

DROP TABLE IF EXISTS `retry_queue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `retry_queue` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `company_id` char(36) NOT NULL,
  `campaign_id` char(36) NOT NULL,
  `number_id` char(36) NOT NULL,
  `next_retry_at` timestamp NOT NULL,
  `retry_count` int DEFAULT '1',
  `status` enum('pending','retrying','failed') DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `retry_queue`
--

LOCK TABLES `retry_queue` WRITE;
/*!40000 ALTER TABLE `retry_queue` DISABLE KEYS */;
/*!40000 ALTER TABLE `retry_queue` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-09 22:33:44

