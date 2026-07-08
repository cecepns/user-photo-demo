-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 07 Jul 2026 pada 23.02
-- Versi server: 10.6.27-MariaDB
-- Versi PHP: 8.4.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `userphot_main`
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
(1, 'admin@userwedding.com', '$2a$10$.7PzN4Kj5Gt2XHYRqolYTeIHC.G6fO8nYaLvCJMve4x8drqPklZPe', '2025-07-23 18:16:00', '2026-05-08 11:45:27'),
(9, 'admin@weddingbliss.com', '$2a$10$yzfeDTDIlquMxcd.hWnEB.a0QnCZUL3hODj5AZVXN7pIUvCDr4nGa', '2026-07-07 15:31:34', '2026-07-07 15:31:34');

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
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fg_vg` varchar(255) DEFAULT NULL
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
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `rekening` varchar(255) DEFAULT NULL,
  `rates` text DEFAULT NULL,
  `alamat` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `accommodation_cost` decimal(12,2) DEFAULT NULL,
  `discount` decimal(12,2) DEFAULT NULL
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
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `album_status` enum('pending','diproses','selesai') NOT NULL DEFAULT 'pending',
  `estimated_completion` date DEFAULT NULL,
  `album_link` text DEFAULT NULL,
  `custom_links` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Struktur dari tabel `schema_migrations`
--

CREATE TABLE `schema_migrations` (
  `name` varchar(255) NOT NULL,
  `applied_at` timestamp NOT NULL DEFAULT current_timestamp()
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
-- Struktur dari tabel `tenants`
--

CREATE TABLE `tenants` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `subdomain` varchar(100) NOT NULL,
  `custom_domain` varchar(255) DEFAULT NULL,
  `db_name` varchar(255) NOT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `primary_color` varchar(7) DEFAULT '#2f4274',
  `expired_at` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Indeks untuk tabel `schema_migrations`
--
ALTER TABLE `schema_migrations`
  ADD PRIMARY KEY (`name`);

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
  ADD KEY `idx_surat_jalan_created_at` (`created_at`),
  ADD KEY `idx_surat_jalan_custom_request_id` (`custom_request_id`);

--
-- Indeks untuk tabel `tenants`
--
ALTER TABLE `tenants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subdomain` (`subdomain`),
  ADD UNIQUE KEY `db_name` (`db_name`),
  ADD UNIQUE KEY `custom_domain` (`custom_domain`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `album_progress`
--
ALTER TABLE `album_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `content_sections`
--
ALTER TABLE `content_sections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `freelance_photographer_assignments`
--
ALTER TABLE `freelance_photographer_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `gallery_categories`
--
ALTER TABLE `gallery_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `gallery_images`
--
ALTER TABLE `gallery_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `order_financials`
--
ALTER TABLE `order_financials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `order_progress`
--
ALTER TABLE `order_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `production_cost_items`
--
ALTER TABLE `production_cost_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `service_cards`
--
ALTER TABLE `service_cards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `service_features`
--
ALTER TABLE `service_features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `service_items`
--
ALTER TABLE `service_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `surat_jalan`
--
ALTER TABLE `surat_jalan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `tenants`
--
ALTER TABLE `tenants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `vendors`
--
ALTER TABLE `vendors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `vendor_calendar_overrides`
--
ALTER TABLE `vendor_calendar_overrides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
