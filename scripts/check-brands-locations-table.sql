-- Cek apakah tabel brands dan locations ada
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('brands', 'locations')
ORDER BY table_name;

-- Jika tabel brands ada, cek datanya
SELECT COUNT(*) as total_brands FROM brands;
SELECT * FROM brands ORDER BY name LIMIT 10;

-- Jika tabel locations ada, cek datanya  
SELECT COUNT(*) as total_locations FROM locations;
SELECT * FROM locations ORDER BY city LIMIT 10;
