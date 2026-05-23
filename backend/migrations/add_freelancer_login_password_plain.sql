-- Password plain untuk ditampilkan admin (hash tetap di kolom password)
ALTER TABLE freelancers_inhouse
  ADD COLUMN login_password_plain VARCHAR(32) NULL AFTER password;
