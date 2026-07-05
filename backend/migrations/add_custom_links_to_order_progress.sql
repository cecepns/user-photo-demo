-- Add custom_links column to order_progress
ALTER TABLE order_progress ADD COLUMN custom_links TEXT DEFAULT NULL;
