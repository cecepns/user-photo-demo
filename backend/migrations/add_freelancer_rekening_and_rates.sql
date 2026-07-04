-- Add rekening and rates columns to freelancers_inhouse table
ALTER TABLE freelancers_inhouse ADD COLUMN rekening VARCHAR(255) NULL;
ALTER TABLE freelancers_inhouse ADD COLUMN rates TEXT NULL;
