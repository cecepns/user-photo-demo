-- Cleanup duplicate rows caused by repeated seeder inserts on server restart.
-- Keeps the row with the LOWEST id (first inserted) for each duplicate group.
-- Must run BEFORE add_unique_constraints_to_seedable_tables.sql

-- 1. Remove duplicate gallery images (keep lowest id per image_url)
DELETE gi1 FROM gallery_images gi1
INNER JOIN gallery_images gi2
  ON gi1.image_url = gi2.image_url AND gi1.id > gi2.id;

-- 2. Re-point gallery_images.category_id to the keeper category row
--    (gallery_images may reference a duplicate category that will be deleted)
UPDATE gallery_images gi
INNER JOIN gallery_categories dup
  ON gi.category_id = dup.id
INNER JOIN gallery_categories keeper
  ON keeper.name = dup.name AND keeper.id < dup.id
SET gi.category_id = keeper.id;

-- 3. Remove duplicate gallery categories (keep lowest id per name)
DELETE gc1 FROM gallery_categories gc1
INNER JOIN gallery_categories gc2
  ON gc1.name = gc2.name AND gc1.id > gc2.id;

-- 4. Remove duplicate payment methods (keep lowest id per name)
DELETE pm1 FROM payment_methods pm1
INNER JOIN payment_methods pm2
  ON pm1.name = pm2.name AND pm1.id > pm2.id;

-- 5. Remove duplicate articles (keep lowest id per title)
DELETE a1 FROM articles a1
INNER JOIN articles a2
  ON a1.title = a2.title AND a1.id > a2.id;
