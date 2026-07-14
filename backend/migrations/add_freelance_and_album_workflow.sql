-- Add columns to freelance_photographer_assignments
ALTER TABLE freelance_photographer_assignments
  ADD COLUMN client_drive_link VARCHAR(2048) NULL AFTER notes,
  ADD COLUMN fee DECIMAL(15,2) NOT NULL DEFAULT 0.00 AFTER client_drive_link,
  ADD COLUMN transport_fee DECIMAL(15,2) NOT NULL DEFAULT 0.00 AFTER fee;

-- Create album_photos table referring to order_progress
CREATE TABLE IF NOT EXISTS album_photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_progress_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NULL,
  is_selected TINYINT NOT NULL DEFAULT 0,
  is_high_res TINYINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_progress_id) REFERENCES order_progress(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
