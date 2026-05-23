-- Akun login freelance + relasi penugasan kalender
ALTER TABLE freelancers_inhouse
  ADD COLUMN email VARCHAR(255) NULL UNIQUE AFTER name,
  ADD COLUMN password VARCHAR(255) NULL AFTER email,
  ADD COLUMN phone VARCHAR(50) NULL AFTER password;

ALTER TABLE freelance_photographer_assignments
  ADD COLUMN freelancer_id INT NULL AFTER order_id,
  ADD KEY idx_freelance_freelancer (freelancer_id);
