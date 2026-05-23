-- Dynamic maps: JSON array [{ "url": "...", "note": "..." }]
ALTER TABLE detail_acara
  ADD COLUMN maps_json JSON NULL AFTER package_name;
