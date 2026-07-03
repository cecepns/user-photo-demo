-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 03 Jul 2026 pada 11.30
-- Versi server: 10.11.18-MariaDB-cll-lve
-- Versi PHP: 8.4.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kinq6231_chekusphoto`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `admins`
--

INSERT INTO `admins` (`id`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 'admin@userwedding.com', '$2a$10$.7PzN4Kj5Gt2XHYRqolYTeIHC.G6fO8nYaLvCJMve4x8drqPklZPe', '2025-07-23 18:16:00', '2026-05-08 11:45:27');

-- --------------------------------------------------------

--
-- Struktur dari tabel `album_progress`
--

CREATE TABLE `album_progress` (
  `id` int(11) NOT NULL,
  `order_source` enum('order','custom_request') NOT NULL,
  `order_id` int(11) NOT NULL,
  `status` enum('pending','diproses','selesai') NOT NULL DEFAULT 'pending',
  `estimated_completion` date DEFAULT NULL,
  `album_link` varchar(2048) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `album_progress`
--

INSERT INTO `album_progress` (`id`, `order_source`, `order_id`, `status`, `estimated_completion`, `album_link`, `created_at`, `updated_at`) VALUES
(1, 'order', 2, 'selesai', '2026-05-13', NULL, '2026-05-13 14:58:02', '2026-07-02 20:07:59');

-- --------------------------------------------------------

--
-- Struktur dari tabel `articles`
--

CREATE TABLE `articles` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `excerpt` text DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `consultation_date` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `phone`, `address`, `instagram`, `consultation_date`, `message`, `created_at`) VALUES
(16, 'Mega Damayanti', 'setiawanfahmi64@gmail.com', '081401794680', 'jln kp.baru desa batok kec.tenjo kab.bogor Rt.05/02 patokan belakang klinik bidan novi', 'eghaaaa_11', '2026-05-10', 'ingin sesuai ekspektasi ', '2026-04-15 15:52:57'),
(17, 'Resti Allia mudrikah', 'restialiamudrikah@gmail.com', '089688001894', 'Serdang Asri 2 block C 2 no 27 ', 'Mudrikah 1070', '2026-07-05', 'Yang terlihat indah', '2026-05-01 10:35:18');

-- --------------------------------------------------------

--
-- Struktur dari tabel `content_sections`
--

CREATE TABLE `content_sections` (
  `id` int(11) NOT NULL,
  `section_name` varchar(100) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `button_text` varchar(100) DEFAULT NULL,
  `button_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `content_sections`
--

INSERT INTO `content_sections` (`id`, `section_name`, `title`, `subtitle`, `description`, `image_url`, `button_text`, `button_url`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'hero_section', 'Hari', 'Pernikahan, Sempurna Anda', 'Buatlah Kesan Indah di Moment Pernikahanmu, dan Abadikan Setiap Moment di Hari Bahagia Mu, Libatkan Kami Dalam setiap Moment Mu Acara Bahagiamu.', '1778671931109-8ttzwm4.jpeg', 'Visit / Survey', '/contact', 1, 1, '2025-07-26 00:56:11', '2026-05-13 11:32:21'),
(3, 'services_hero_section', '', '', 'Silahkan pilih Paket Keinginanmu, dan sesuaikan Kebutuhanmu dengan menambahkan pilihan lainnya,', '1779633193208-pc656m3.JPG', '', '', 1, 3, '2025-07-26 01:13:49', '2026-05-24 14:33:25'),
(4, 'custom_service_section', '', 'PT.CHEKUSPHOTO ASIK', '', '', 'Mulai Sekarang', '/custom-service', 1, 4, '2025-07-26 01:20:58', '2026-05-13 10:55:36'),
(5, 'gallery_hero_section', 'Galeri Pernikahan', '', 'Jelajahi koleksi pernikahan indah kami dan dapatkan inspirasi untuk hari spesial Anda.', '', '', '', 1, 5, '2025-07-26 01:25:09', '2025-07-26 01:25:26'),
(6, 'about_hero_section', 'Tentang Chekusphoto', '', 'Kami bersemangat menciptakan momen magis dan mewujudkan impian pernikahan Anda menjadi kenyataan. Dengan pengalaman bertahun-tahun dan perhatian pada detail, kami memastikan hari spesial Anda sempurna.', 'https://i.imghippo.com/files/nO3133mg.jpeg', '', '', 1, 6, '2025-07-26 01:29:39', '2026-05-13 10:56:34'),
(7, 'about_mission_section', 'Misi Kami', '', 'Menciptakan pengalaman pernikahan luar biasa yang melampaui ekspektasi dan menciptakan kenangan abadi. Kami percaya setiap pasangan layak mendapat perayaan yang unik seperti kisah cinta mereka.', '', '', '', 1, 7, '2025-07-26 01:29:39', '2025-07-26 03:26:24'),
(8, 'about_cta_section', 'Siap Mulai Merencanakan?', '', 'Mari Ciptakan Moment Pernikahan \nAnda, Hubungi kami untuk konsultasi gratis', '', 'Mulai Hari Ini', '/contact', 1, 8, '2025-07-26 01:29:39', '2026-05-13 10:58:52'),
(9, 'contact_hero_section', 'Hubungi Kami', '', 'Siap merencanakan moment impian Anda? Hubungi kami untuk konsultasi gratis', '', '', '', 1, 9, '2025-07-26 02:48:40', '2026-05-13 10:59:18'),
(11, 'home_cta_section', 'Siap Merencanakan Pernikahan Impian Anda?', '', 'Mari mulai menciptakan hari sempurna yang selalu Anda impikan. Hubungi kami untuk konsultasi gratis.', '', 'Booking Konsultasi', '/contact', 0, 3, '2025-07-26 03:18:01', '2025-08-05 17:23:08'),
(12, 'services_preview_section', 'Pilihan Layanan Pernikahan', 'WEDDING PACKAGE | DEKORASI | MUA | DOKUMENTASI | STUDIO | ENTERTAINMENT | SOUNDSYSTEM | MC | RPOSESI ADAT | CREW WO', '', '', '', '', 0, 2, '2025-07-30 06:49:23', '2025-07-30 07:47:58'),
(13, 'button_item_detail', '', '', '', '', 'Checkout', '', 1, 1, '2025-07-30 12:06:49', '2025-07-30 12:06:49'),
(15, 'site_identity', 'Chekusphoto', 'PT.Chekusphoto Asik', '{\"siteContact\":{\"addressLine1\":\" Citra Raya Cluster Avaneu Park Blok ZB 19/18 Kec Cikupa,Tangerang\",\"addressLine2\":\"Provinsi Banten\",\"phone\":\"083141308442\",\"email\":\"As.veytea@gmail.com\",\"instagramUrl\":\"https://www.instagram.com/chekusphoto?igsh=c2thNWZuZG5ub3lr&utm_source=qr\",\"mapsEmbedUrl\":\"\",\"businessHours\":\"Senin - Jumat: 09:00 - 18:00\\nSabtu: 10:00 - 16:00\\nMinggu: Hanya dengan janji temu\"},\"footerServices\":[\"Perencanaan Pernikahan\",\"Koordinasi Acara\",\"Pemilihan Paket\",\"Dokumentasi\"]}', '1778671581124-mr2gp3o.png', 'U', '', 1, 1, '2026-05-09 06:39:47', '2026-05-24 21:44:51'),
(16, 'Chekusphoto', 'Abadikan momentmu', 'Photo + video', 'Kami menyediakan \nJasa photo & video \nDi setiap moment kalian kami siap \nAbadikan', '1778348980187-stu0uqo.jpeg', 'Konsul Gratis', '088214350399', 1, 0, '2026-05-09 17:50:05', '2026-05-09 17:50:05');

-- --------------------------------------------------------

--
-- Struktur dari tabel `custom_requests`
--

CREATE TABLE `custom_requests` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `wedding_date` date DEFAULT NULL,
  `booking_amount` decimal(10,2) DEFAULT NULL,
  `services` text DEFAULT NULL,
  `status` enum('pending','cancelled','confirmed','completed') NOT NULL DEFAULT 'pending',
  `additional_requests` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bride_name` varchar(255) DEFAULT NULL,
  `groom_name` varchar(255) DEFAULT NULL,
  `reference_source` varchar(100) DEFAULT NULL,
  `vendor_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `detail_acara`
--

CREATE TABLE `detail_acara` (
  `id` int(11) NOT NULL,
  `order_source` enum('order','custom_request') DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `client_name` varchar(255) DEFAULT NULL,
  `client_phone` varchar(50) DEFAULT NULL,
  `client_address` text DEFAULT NULL,
  `bride_name` varchar(255) DEFAULT NULL,
  `groom_name` varchar(255) DEFAULT NULL,
  `wedding_date` date DEFAULT NULL,
  `package_name` varchar(255) DEFAULT NULL,
  `maps_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`maps_json`)),
  `map1_url` text DEFAULT NULL,
  `map1_note` text DEFAULT NULL,
  `map2_url` text DEFAULT NULL,
  `map2_note` text DEFAULT NULL,
  `map3_url` text DEFAULT NULL,
  `map3_note` text DEFAULT NULL,
  `map4_url` text DEFAULT NULL,
  `map4_note` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `financial_settings`
--

CREATE TABLE `financial_settings` (
  `id` int(11) NOT NULL DEFAULT 1,
  `accommodation_cost` decimal(12,2) NOT NULL DEFAULT 0.00,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `financial_settings`
--

INSERT INTO `financial_settings` (`id`, `accommodation_cost`, `updated_at`) VALUES
(1, 0.00, '2026-05-23 16:40:43');

-- --------------------------------------------------------

--
-- Struktur dari tabel `freelancers_inhouse`
--

CREATE TABLE `freelancers_inhouse` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `login_password_plain` varchar(32) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `photo_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `video_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `freelancers_inhouse`
--

INSERT INTO `freelancers_inhouse` (`id`, `name`, `email`, `password`, `login_password_plain`, `phone`, `photo_price`, `video_price`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'cecep-DEV', 'cecepns29@gmail.com', '$2a$10$9s/m/tdyx5hEFUtG.71F.OjaZwVhxeG.F9BCaRzWl7Cl7L7IwL5za', 'QYP2TG5C', '082214094779', 500000.00, 1500000.00, 1, '2026-05-23 17:40:35', '2026-05-23 17:40:35');

-- --------------------------------------------------------

--
-- Struktur dari tabel `freelance_photographer_assignments`
--

CREATE TABLE `freelance_photographer_assignments` (
  `id` int(11) NOT NULL,
  `order_source` enum('order','custom_request') NOT NULL,
  `order_id` int(11) NOT NULL,
  `freelancer_id` int(11) DEFAULT NULL,
  `photographer_name` varchar(255) NOT NULL,
  `duty_date` date NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `gallery_categories`
--

CREATE TABLE `gallery_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `gallery_categories`
--

INSERT INTO `gallery_categories` (`id`, `name`, `description`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'Upacara', 'Foto-foto upacara pernikahan yang indah', 1, 1, '2025-07-23 19:04:26', '2025-07-23 19:04:26'),
(2, 'Resepsi', 'Dokumentasi resepsi pernikahan', 1, 2, '2025-07-23 19:04:26', '2025-07-23 19:04:26'),
(3, 'Dekorasi', 'Koleksi dekorasi pernikahan', 1, 3, '2025-07-23 19:04:26', '2025-07-23 19:04:26'),
(4, 'Pasangan', 'Foto-foto pasangan pengantin', 1, 4, '2025-07-23 19:04:26', '2025-07-23 19:04:26'),
(5, 'Detail', 'Detail-detail pernikahan yang menarik', 1, 5, '2025-07-23 19:04:26', '2025-07-23 19:04:26');

-- --------------------------------------------------------

--
-- Struktur dari tabel `gallery_images`
--

CREATE TABLE `gallery_images` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `gallery_images`
--

INSERT INTO `gallery_images` (`id`, `title`, `description`, `image_url`, `category_id`, `is_featured`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(8, 'photo wedding', 'Abadikan Momen mu\n\n\n\n', '1779631512051-fntlsye.JPG', 4, 0, 1, 0, '2026-05-24 14:06:38', '2026-05-24 14:06:38'),
(9, 'Photoshoot Wedding', 'Singel Shoot', '1779631659700-ng0asc0.jpg', 4, 1, 1, 0, '2026-05-24 14:08:57', '2026-05-24 14:08:57'),
(10, 'photoshoot', 'photo buku nikah', '1779631979214-oo23139.JPG', 4, 1, 1, 0, '2026-05-24 14:15:30', '2026-05-24 14:15:30'),
(11, 'detail', 'photo mahar', '1779632152624-j6n631l.JPG', 5, 1, 1, 1, '2026-05-24 14:16:15', '2026-05-24 14:16:15'),
(12, 'plaminan', 'photo Dekor\n', '1779632222832-tbkbxxb.JPG', 3, 1, 1, 2, '2026-05-24 14:17:41', '2026-05-24 14:17:41'),
(13, 'Buku nikah', 'photo detail', '1779632332137-f8ir89y.JPG', 5, 1, 1, 3, '2026-05-24 14:20:24', '2026-05-24 14:20:24'),
(14, 'Singel shoot', 'photo Pose', '1779632490208-wr1nwsv.JPG', 4, 1, 1, 3, '2026-05-24 14:22:28', '2026-05-24 14:22:28'),
(15, 'Lamaran', 'couple', '1779660527113-74zwfi5.JPG', 4, 1, 1, 4, '2026-05-24 22:08:51', '2026-05-24 22:08:51'),
(16, 'Lamaran', 'Detail', '1779660618660-qo5p40x.jpeg', 5, 1, 1, 3, '2026-05-24 22:10:49', '2026-05-24 22:10:49'),
(17, 'Lamaran', 'cuople', '1779660701686-w3ur88n.jpeg', 4, 1, 1, 4, '2026-05-24 22:12:07', '2026-05-24 22:12:07'),
(18, 'Wedding', 'Singelshoot', '1779660774950-kmhm9yl.jpeg', 4, 1, 1, 4, '2026-05-24 22:13:15', '2026-05-24 22:13:15'),
(19, 'Wedding', 'Coulple', '1779660836156-vn4dls9.jpeg', 4, 1, 1, 5, '2026-05-24 22:14:18', '2026-05-24 22:14:18');

-- --------------------------------------------------------

--
-- Struktur dari tabel `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `images` text DEFAULT NULL COMMENT 'JSON array of uploaded image filenames'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `items`
--

INSERT INTO `items` (`id`, `name`, `description`, `price`, `category`, `is_active`, `created_at`, `updated_at`, `images`) VALUES
(21, 'Lantai lampu akrilik', '12 unit', 1000000.00, 'TOPPING', 0, '2025-08-02 15:45:05', '2026-01-20 06:33:50', NULL),
(94, 'Album', 'Kolase 10 sheet 20 halaman', 750000.00, 'TOPPING', 1, '2026-05-13 10:17:35', '2026-05-13 10:17:35', '[]'),
(95, 'Cetak frame 40x60', 'Semi kanvas tanpa kaca\nBingkai putih / hitam', 250000.00, 'TOPPING', 1, '2026-05-13 10:19:07', '2026-05-13 10:28:58', '[]'),
(96, 'Flasdisk 16gb', 'Sandisk', 100000.00, 'TOPPING', 1, '2026-05-13 10:20:06', '2026-05-13 10:27:34', '[]'),
(97, 'Overtime', 'Perjam ', 200000.00, 'TOPPING', 1, '2026-05-13 10:21:26', '2026-05-13 10:28:43', '[]'),
(98, 'Video liputan', 'Durasi 45-60 menit', 1000000.00, 'TOPPING', 1, '2026-05-13 10:22:26', '2026-05-13 10:28:28', '[]'),
(99, 'Photo booth ', 'Cetak langsung \nDurasi 8 jam\nUnlimitide\nCetak 4r +frame kertas', 2200000.00, 'TOPPING', 1, '2026-05-13 10:25:52', '2026-05-13 10:27:59', '[]'),
(100, 'Spinbooth 360', 'Durasi 8 jam kerja', 2200000.00, 'TOPPING', 1, '2026-05-13 10:26:34', '2026-05-13 10:28:12', '[]'),
(101, 'Drone', 'video udara\nPerbatre + pilot', 600000.00, 'TOPPING', 1, '2026-05-13 10:30:06', '2026-05-13 10:34:21', '[]'),
(102, 'Prewedding', 'Photo only Outdor / Indor', 1000000.00, 'TOPPING', 1, '2026-05-13 10:35:36', '2026-05-13 10:35:36', '[]'),
(103, 'Video Prewedding', 'Durasi 3 menit Cinemtic', 1000000.00, 'TOPPING', 1, '2026-05-13 10:36:47', '2026-05-13 10:36:47', '[]');

-- --------------------------------------------------------

--
-- Struktur dari tabel `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `booking_amount` decimal(10,2) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `wedding_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL,
  `service_name` varchar(255) DEFAULT NULL,
  `selected_items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`selected_items`)),
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bride_name` varchar(255) DEFAULT NULL,
  `groom_name` varchar(255) DEFAULT NULL,
  `reference_source` varchar(100) DEFAULT NULL,
  `vendor_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `orders`
--

INSERT INTO `orders` (`id`, `name`, `email`, `phone`, `booking_amount`, `address`, `wedding_date`, `notes`, `service_id`, `service_name`, `selected_items`, `total_amount`, `status`, `created_at`, `updated_at`, `bride_name`, `groom_name`, `reference_source`, `vendor_id`) VALUES
(1, 'Siti nurhasanah', 'nurhasanahsiti1307@gmail.com', '083113330730', 2000000.00, 'Raflesia', '2026-05-30', '', 35, 'Asik 1', '[{\"id\":2,\"service_id\":35,\"item_id\":95,\"custom_price\":null,\"is_required\":0,\"sort_order\":2,\"created_at\":\"2026-05-13T11:06:00.000Z\",\"updated_at\":\"2026-05-13T11:06:00.000Z\",\"name\":\"Cetak frame 40x60\",\"description\":\"Semi kanvas tanpa kaca\\nBingkai putih / hitam\",\"item_price\":\"250000.00\",\"category\":\"TOPPING\",\"final_price\":\"250000.00\"}]', 2250000.00, 'pending', '2026-05-13 12:10:54', '2026-05-13 12:10:54', NULL, NULL, NULL, NULL),
(2, 'Gios', 'anggiwijaya118@yahoo.co.id', '081289143116', 2850000.00, 'Sillcx', '2026-05-27', '', 35, 'Asik 1', '[{\"id\":2,\"service_id\":35,\"item_id\":95,\"custom_price\":null,\"is_required\":0,\"sort_order\":2,\"created_at\":\"2026-05-13T11:06:00.000Z\",\"updated_at\":\"2026-05-13T11:06:00.000Z\",\"name\":\"Cetak frame 40x60\",\"description\":\"Semi kanvas tanpa kaca\\nBingkai putih / hitam\",\"item_price\":\"250000.00\",\"category\":\"TOPPING\",\"final_price\":\"250000.00\"},{\"id\":5,\"service_id\":35,\"item_id\":101,\"custom_price\":null,\"is_required\":0,\"sort_order\":3,\"created_at\":\"2026-05-13T11:06:23.000Z\",\"updated_at\":\"2026-05-13T11:06:23.000Z\",\"name\":\"Drone\",\"description\":\"video udara\\nPerbatre + pilot\",\"item_price\":\"600000.00\",\"category\":\"TOPPING\",\"final_price\":\"600000.00\"}]', 2850000.00, 'pending', '2026-05-13 13:56:49', '2026-07-02 18:32:57', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `order_financials`
--

CREATE TABLE `order_financials` (
  `id` int(11) NOT NULL,
  `order_source` enum('order','custom_request') NOT NULL,
  `order_id` int(11) NOT NULL,
  `accommodation_applied` tinyint(1) NOT NULL DEFAULT 0,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `order_progress`
--

CREATE TABLE `order_progress` (
  `id` int(11) NOT NULL,
  `order_source` enum('order','custom_request') NOT NULL,
  `order_id` int(11) NOT NULL,
  `photo_status` enum('photo_progress','editing','draft_album','printing','shipping','completed') NOT NULL DEFAULT 'photo_progress',
  `video_status` enum('video_progress','processing','revision','completed') NOT NULL DEFAULT 'video_progress',
  `photo_link` text DEFAULT NULL,
  `video_link` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `order_progress`
--

INSERT INTO `order_progress` (`id`, `order_source`, `order_id`, `photo_status`, `video_status`, `photo_link`, `video_link`, `created_at`, `updated_at`) VALUES
(1, 'order', 2, 'editing', 'revision', NULL, NULL, '2026-07-02 19:17:08', '2026-07-02 20:00:22');

-- --------------------------------------------------------

--
-- Struktur dari tabel `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `payment_methods`
--

INSERT INTO `payment_methods` (`id`, `type`, `name`, `account_number`, `details`, `created_at`, `updated_at`) VALUES
(1, 'bank', 'BCA', '7641067923', 'Atas Nama Edo priyatno', '2025-07-23 18:58:48', '2025-08-05 18:00:32');

-- --------------------------------------------------------

--
-- Struktur dari tabel `production_cost_items`
--

CREATE TABLE `production_cost_items` (
  `id` int(11) NOT NULL,
  `order_financial_id` int(11) NOT NULL,
  `label` varchar(255) NOT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `services`
--

INSERT INTO `services` (`id`, `name`, `description`, `base_price`, `image`, `created_at`, `updated_at`) VALUES
(35, 'Asik 1', 'Photo only\n- 1 album kolase 10 sheet 20 halaman\n-all fille google drive\nDurasi kerja 12 jam ', 2000000.00, '', '2026-05-13 10:41:53', '2026-05-13 10:41:53'),
(36, 'Asik 2 ', 'Photo + video\n-1 album kolase 10 sheet 20 halama\n- video cinemtic\nAll file drive \nDuarasi kerja 12 jam', 3000000.00, '', '2026-05-13 10:44:10', '2026-05-13 10:44:35'),
(37, 'Asik Lamaran 1', 'photo Only \n-File edit 150-200 photo\n-File all goggle drive\n-Durasi 5 jam', 1000000.00, '', '2026-05-24 13:52:41', '2026-05-24 13:52:41'),
(38, 'Asik Lamaran 2', 'Photo & Video\n- Photo edit 150-200 \n- video cinemtic 3-5menit\n- Durasi 5 jam', 1500000.00, '', '2026-05-24 13:54:33', '2026-05-24 13:54:33');

-- --------------------------------------------------------

--
-- Struktur dari tabel `service_cards`
--

CREATE TABLE `service_cards` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` mediumtext DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `button_text` varchar(100) DEFAULT NULL,
  `card_type` enum('service','about','feature') NOT NULL DEFAULT 'service',
  `button_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `service_cards`
--

INSERT INTO `service_cards` (`id`, `title`, `description`, `icon`, `image_url`, `button_text`, `card_type`, `button_url`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'DOKUMENTASI WEDDING', 'PHOTOGRAPER | VIDEOGRAPER | DRONE', '', '', 'Lihat Paket', 'service', '/services', 1, 1, '2025-07-26 01:06:29', '2026-05-13 11:04:30'),
(2, 'TOPPING', 'Mc | Crew Wo | Prosesi Adat | Entertainment | Soundsystem | Undangan | Dan Selanjutnya ,', '', '', 'Buat Custom →', 'service', '/custom-service?category=TOPPING', 1, 4, '2025-07-26 01:06:29', '2025-07-30 07:11:00'),
(3, 'Layanan Personal', 'Setiap pernikahan unik, dan kami menyesuaikan layanan kami dengan visi dan preferensi Anda.', '💖', '', '', 'about', '', 0, 1, '2025-07-26 01:51:53', '2025-07-28 23:13:42'),
(4, 'Perhatian pada Detail', 'Dari dekorasi terkecil hingga gestur terbesar, kami memastikan kesempurnaan dalam setiap elemen.', '✨', '', '', 'about', '', 0, 2, '2025-07-26 01:51:53', '2025-07-28 23:13:59'),
(5, 'Perencanaan Bebas Stres', 'Kami menangani semua logistik sehingga Anda bisa fokus menikmati masa tunangan dan hari spesial.', '🎯', '', '', 'about', '', 0, 3, '2025-07-26 01:51:53', '2025-07-28 23:14:18'),
(9, 'PESANAN SAYA', '', '', '', 'Lihat Sekarang', 'service', '/pesanan-saya', 1, 0, '2026-04-25 02:52:36', '2026-04-25 02:53:15');

-- --------------------------------------------------------

--
-- Struktur dari tabel `service_features`
--

CREATE TABLE `service_features` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `service_features`
--

INSERT INTO `service_features` (`id`, `title`, `description`, `icon`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'Perencanaan profesional', 'Tim perencana berpengalaman yang akan mengatur setiap detail pernikahan Anda', '📋', 1, 1, '2025-07-26 03:07:54', '2025-07-26 03:07:54'),
(2, 'Tim berpengalaman', 'Tim ahli dengan pengalaman bertahun-tahun dalam industri pernikahan', '👥', 1, 2, '2025-07-26 03:07:54', '2025-07-26 03:07:54'),
(3, 'Kualitas terjamin', 'Komitmen kami untuk memberikan layanan berkualitas tinggi', '⭐', 1, 3, '2025-07-26 03:07:54', '2025-07-26 03:07:54'),
(4, 'Pelayanan 24/7', 'Dukungan penuh selama proses perencanaan hingga hari pernikahan', '🕐', 1, 4, '2025-07-26 03:07:54', '2025-07-26 03:07:54'),
(5, 'Garansi kepuasan', 'Jaminan kepuasan 100% untuk setiap layanan yang kami berikan', '✅', 1, 5, '2025-07-26 03:07:54', '2025-07-26 03:07:54');

-- --------------------------------------------------------

--
-- Struktur dari tabel `service_items`
--

CREATE TABLE `service_items` (
  `id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `custom_price` decimal(10,2) DEFAULT NULL,
  `is_required` tinyint(1) DEFAULT 0,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `service_items`
--

INSERT INTO `service_items` (`id`, `service_id`, `item_id`, `custom_price`, `is_required`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 35, 94, NULL, 0, 1, '2026-05-13 11:05:56', '2026-05-13 11:05:56'),
(2, 35, 95, NULL, 0, 2, '2026-05-13 11:06:00', '2026-05-13 11:06:00'),
(3, 35, 96, NULL, 0, 4, '2026-05-13 11:06:05', '2026-05-13 11:06:05'),
(4, 35, 97, NULL, 0, 5, '2026-05-13 11:06:19', '2026-05-13 11:06:19'),
(5, 35, 101, NULL, 0, 3, '2026-05-13 11:06:23', '2026-05-13 11:06:23'),
(6, 35, 102, NULL, 0, 7, '2026-05-13 11:06:31', '2026-05-13 11:06:31'),
(7, 35, 99, NULL, 0, 6, '2026-05-13 11:06:37', '2026-05-13 11:06:37'),
(8, 35, 100, NULL, 0, 8, '2026-05-13 11:06:44', '2026-05-13 11:06:44'),
(9, 35, 98, NULL, 0, 9, '2026-05-13 11:06:59', '2026-05-13 11:06:59'),
(10, 35, 103, NULL, 0, 10, '2026-05-13 11:07:52', '2026-05-13 11:07:52'),
(11, 36, 94, NULL, 0, 1, '2026-05-13 11:07:58', '2026-05-13 11:07:58'),
(13, 36, 95, NULL, 0, 2, '2026-05-13 11:08:02', '2026-05-13 11:08:02'),
(14, 36, 101, NULL, 0, 3, '2026-05-13 11:08:07', '2026-05-13 11:08:07'),
(15, 36, 96, NULL, 0, 4, '2026-05-13 11:08:10', '2026-05-13 11:08:10'),
(16, 36, 97, NULL, 0, 5, '2026-05-13 11:08:15', '2026-05-13 11:08:15'),
(17, 36, 99, NULL, 0, 6, '2026-05-13 11:08:22', '2026-05-13 11:08:22'),
(18, 36, 102, NULL, 0, 7, '2026-05-13 11:08:28', '2026-05-13 11:08:28'),
(19, 36, 100, NULL, 0, 8, '2026-05-13 11:08:35', '2026-05-13 11:08:35'),
(20, 36, 98, NULL, 0, 9, '2026-05-13 11:08:45', '2026-05-13 11:08:45'),
(21, 36, 103, NULL, 0, 10, '2026-05-13 11:08:57', '2026-05-13 11:08:57'),
(22, 38, 97, NULL, 0, 5, '2026-05-24 13:55:23', '2026-05-24 13:55:23'),
(23, 38, 95, NULL, 0, 2, '2026-05-24 13:55:32', '2026-05-24 13:55:32'),
(24, 37, 95, NULL, 0, 2, '2026-05-24 13:55:58', '2026-05-24 13:55:58'),
(25, 37, 97, NULL, 0, 5, '2026-05-24 13:56:14', '2026-05-24 13:56:14');

-- --------------------------------------------------------

--
-- Struktur dari tabel `surat_jalan`
--

CREATE TABLE `surat_jalan` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `custom_request_id` int(11) DEFAULT NULL,
  `client_name` varchar(255) NOT NULL,
  `client_phone` varchar(50) DEFAULT NULL,
  `client_address` text DEFAULT NULL,
  `wedding_date` date DEFAULT NULL,
  `package_name` varchar(255) DEFAULT NULL,
  `plaminan_image` text DEFAULT NULL,
  `pintu_masuk_image` text DEFAULT NULL,
  `dekorasi_image` text DEFAULT NULL,
  `warna_kain` text DEFAULT NULL,
  `ukuran_tenda` text DEFAULT NULL,
  `piring` text DEFAULT NULL,
  `nama_pasangan` text DEFAULT NULL,
  `vendor_name` varchar(255) DEFAULT 'User Wedding Organizer',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `maps_link` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `vendors`
--

CREATE TABLE `vendors` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `vendors`
--

INSERT INTO `vendors` (`id`, `name`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'user wedding', 1, '2026-07-02 18:09:14', '2026-07-02 18:09:14');

-- --------------------------------------------------------

--
-- Struktur dari tabel `vendor_calendar_overrides`
--

CREATE TABLE `vendor_calendar_overrides` (
  `id` int(11) NOT NULL,
  `event_type` enum('order','custom_request') NOT NULL,
  `source_id` int(11) NOT NULL,
  `vendor_key` varchar(100) NOT NULL,
  `wedding_date` date NOT NULL,
  `custom_vendor_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `vendor_calendar_overrides`
--

INSERT INTO `vendor_calendar_overrides` (`id`, `event_type`, `source_id`, `vendor_key`, `wedding_date`, `custom_vendor_name`, `created_at`, `updated_at`) VALUES
(1, 'order', 160, 'item_19', '2026-04-04', 'agus', '2026-04-24 16:24:53', '2026-04-25 04:15:51'),
(15, 'order', 276, 'item_24', '2026-04-03', 'Test', '2026-04-24 16:26:08', '2026-04-25 04:00:42'),
(21, 'order', 300, 'item_19', '2026-05-16', 'Adenur', '2026-04-25 03:19:31', '2026-04-25 03:44:22'),
(22, 'order', 317, 'item_19', '2026-06-13', 'Adenur', '2026-04-25 03:27:22', '2026-04-25 03:27:22'),
(23, 'order', 326, 'item_19', '2026-06-13', 'Chekus', '2026-04-25 03:27:30', '2026-04-25 03:27:30'),
(24, 'order', 319, 'item_19', '2026-07-04', 'Agus', '2026-04-25 03:30:00', '2026-04-25 03:30:00'),
(31, 'order', 341, 'item_26', '2026-04-05', 'TEst', '2026-04-25 04:31:22', '2026-04-25 04:31:22'),
(32, 'order', 160, 'item_19', '2026-04-05', 'Gus', '2026-04-25 04:31:59', '2026-04-25 04:31:59'),
(33, 'order', 308, 'item_19', '2026-04-11', 'Agus', '2026-05-09 05:36:54', '2026-05-09 05:36:54');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeks untuk tabel `album_progress`
--
ALTER TABLE `album_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_album_progress_order` (`order_source`,`order_id`),
  ADD KEY `idx_album_progress_status` (`status`);

--
-- Indeks untuk tabel `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `content_sections`
--
ALTER TABLE `content_sections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `section_name` (`section_name`);

--
-- Indeks untuk tabel `custom_requests`
--
ALTER TABLE `custom_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `detail_acara`
--
ALTER TABLE `detail_acara`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_detail_acara` (`order_source`,`order_id`);

--
-- Indeks untuk tabel `financial_settings`
--
ALTER TABLE `financial_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `freelancers_inhouse`
--
ALTER TABLE `freelancers_inhouse`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_freelancers_active` (`is_active`);

--
-- Indeks untuk tabel `freelance_photographer_assignments`
--
ALTER TABLE `freelance_photographer_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_freelance_duty_date` (`duty_date`),
  ADD KEY `idx_freelance_order` (`order_source`,`order_id`),
  ADD KEY `idx_freelance_freelancer` (`freelancer_id`);

--
-- Indeks untuk tabel `gallery_categories`
--
ALTER TABLE `gallery_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `gallery_images`
--
ALTER TABLE `gallery_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indeks untuk tabel `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indeks untuk tabel `order_financials`
--
ALTER TABLE `order_financials`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_order_financial` (`order_source`,`order_id`);

--
-- Indeks untuk tabel `order_progress`
--
ALTER TABLE `order_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_order_progress` (`order_source`,`order_id`);

--
-- Indeks untuk tabel `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `production_cost_items`
--
ALTER TABLE `production_cost_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_prod_cost_financial` (`order_financial_id`);

--
-- Indeks untuk tabel `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `service_cards`
--
ALTER TABLE `service_cards`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `service_features`
--
ALTER TABLE `service_features`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `service_items`
--
ALTER TABLE `service_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_service_item` (`service_id`,`item_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indeks untuk tabel `surat_jalan`
--
ALTER TABLE `surat_jalan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_surat_jalan_order_id` (`order_id`),
  ADD KEY `idx_surat_jalan_created_at` (`created_at`);

--
-- Indeks untuk tabel `vendors`
--
ALTER TABLE `vendors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_vendors_active` (`is_active`);

--
-- Indeks untuk tabel `vendor_calendar_overrides`
--
ALTER TABLE `vendor_calendar_overrides`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_vendor_calendar_override` (`event_type`,`source_id`,`vendor_key`,`wedding_date`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `album_progress`
--
ALTER TABLE `album_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT untuk tabel `content_sections`
--
ALTER TABLE `content_sections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT untuk tabel `custom_requests`
--
ALTER TABLE `custom_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `detail_acara`
--
ALTER TABLE `detail_acara`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `freelancers_inhouse`
--
ALTER TABLE `freelancers_inhouse`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `freelance_photographer_assignments`
--
ALTER TABLE `freelance_photographer_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `gallery_categories`
--
ALTER TABLE `gallery_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `gallery_images`
--
ALTER TABLE `gallery_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT untuk tabel `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT untuk tabel `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `order_financials`
--
ALTER TABLE `order_financials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `order_progress`
--
ALTER TABLE `order_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `production_cost_items`
--
ALTER TABLE `production_cost_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT untuk tabel `service_cards`
--
ALTER TABLE `service_cards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `service_features`
--
ALTER TABLE `service_features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `service_items`
--
ALTER TABLE `service_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT untuk tabel `surat_jalan`
--
ALTER TABLE `surat_jalan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `vendors`
--
ALTER TABLE `vendors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `vendor_calendar_overrides`
--
ALTER TABLE `vendor_calendar_overrides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `gallery_images`
--
ALTER TABLE `gallery_images`
  ADD CONSTRAINT `gallery_images_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `gallery_categories` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `production_cost_items`
--
ALTER TABLE `production_cost_items`
  ADD CONSTRAINT `fk_prod_cost_financial` FOREIGN KEY (`order_financial_id`) REFERENCES `order_financials` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `service_items`
--
ALTER TABLE `service_items`
  ADD CONSTRAINT `service_items_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `service_items_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `surat_jalan`
--
ALTER TABLE `surat_jalan`
  ADD CONSTRAINT `surat_jalan_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
