-- ============================================
-- QUERY UNTUK CEK DATA CARS DI DATABASE
-- ============================================

-- 1. Lihat semua kolom yang ada di tabel cars
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'cars'
ORDER BY ordinal_position;

-- 2. Lihat 10 data mobil pertama dengan semua detailnya
SELECT id, brand, model, location, body_type, transmission, fuel_type, year, price
FROM cars
ORDER BY id
LIMIT 10;

-- 3. Hitung total mobil
SELECT COUNT(*) as total_cars FROM cars;

-- 4. Lihat distribusi BRAND (unique brands yang ada)
SELECT brand, COUNT(*) as total 
FROM cars 
WHERE brand IS NOT NULL
GROUP BY brand 
ORDER BY total DESC;

-- 5. Lihat distribusi LOCATION (unique locations yang ada)
SELECT location, COUNT(*) as total 
FROM cars 
WHERE location IS NOT NULL
GROUP BY location 
ORDER BY total DESC;

-- 6. Lihat distribusi BODY TYPE (unique body types yang ada)
SELECT body_type, COUNT(*) as total 
FROM cars 
WHERE body_type IS NOT NULL
GROUP BY body_type 
ORDER BY total DESC;

-- 7. Lihat distribusi TRANSMISSION (unique transmissions yang ada)
SELECT transmission, COUNT(*) as total 
FROM cars 
WHERE transmission IS NOT NULL
GROUP BY transmission 
ORDER BY total DESC;

-- 8. Lihat distribusi FUEL TYPE (unique fuel types yang ada)
SELECT fuel_type, COUNT(*) as total 
FROM cars 
WHERE fuel_type IS NOT NULL
GROUP BY fuel_type 
ORDER BY total DESC;

-- 9. Summary lengkap - berapa unique values untuk setiap filter
SELECT 
    COUNT(*) as total_cars,
    COUNT(DISTINCT brand) as unique_brands,
    COUNT(DISTINCT location) as unique_locations,
    COUNT(DISTINCT body_type) as unique_body_types,
    COUNT(DISTINCT transmission) as unique_transmissions,
    COUNT(DISTINCT fuel_type) as unique_fuel_types
FROM cars;

-- 10. Lihat data yang NULL (belum ada isinya)
SELECT 
    COUNT(*) FILTER (WHERE brand IS NULL) as brand_null,
    COUNT(*) FILTER (WHERE location IS NULL) as location_null,
    COUNT(*) FILTER (WHERE body_type IS NULL) as body_type_null,
    COUNT(*) FILTER (WHERE transmission IS NULL) as transmission_null,
    COUNT(*) FILTER (WHERE fuel_type IS NULL) as fuel_type_null
FROM cars;

-- 11. Lihat sample data lengkap untuk 5 mobil
SELECT *
FROM cars
ORDER BY id
LIMIT 5;
