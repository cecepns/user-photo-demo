-- Fix duplicate seeder bug: add UNIQUE constraints so INSERT IGNORE can detect duplicates
-- on tables that had no unique key other than the auto-increment PK.

-- payment_methods: unique on name
ALTER TABLE payment_methods ADD UNIQUE KEY uq_payment_method_name (name);

-- articles: unique on title
ALTER TABLE articles ADD UNIQUE KEY uq_article_title (title);

-- gallery_categories: unique on name
ALTER TABLE gallery_categories ADD UNIQUE KEY uq_gallery_category_name (name);

-- gallery_images: unique on image_url (prefix 191 chars for utf8mb4 index limit)
ALTER TABLE gallery_images ADD UNIQUE KEY uq_gallery_image_url (image_url(191));
