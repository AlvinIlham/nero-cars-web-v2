-- Script untuk update SEMUA data cars dengan distribusi merata
-- Jalankan script ini di Supabase SQL Editor

-- ============================================
-- STEP 1: UPDATE SEMUA BRAND
-- ============================================
DO $$
DECLARE
    car_record RECORD;
    brand_list TEXT[] := ARRAY[
        'Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda', 'Lexus', 'Subaru',
        'Hyundai', 'Kia', 'Genesis',
        'Wuling', 'Chery', 'MG', 'BYD', 'Geely',
        'Mercedes-Benz', 'BMW', 'Audi', 'Volkswagen', 'Porsche',
        'Volvo', 'Peugeot', 'Renault', 'Land Rover', 'Mini',
        'Ford', 'Chevrolet', 'Jeep'
    ];
    brand_index INT := 1;
BEGIN
    FOR car_record IN SELECT id FROM cars ORDER BY id LOOP
        UPDATE cars SET brand = brand_list[brand_index] WHERE id = car_record.id;
        brand_index := brand_index + 1;
        IF brand_index > array_length(brand_list, 1) THEN
            brand_index := 1;
        END IF;
    END LOOP;
END $$;

-- ============================================
-- STEP 2: UPDATE SEMUA LOCATION
-- ============================================
DO $$
DECLARE
    car_record RECORD;
    location_list TEXT[] := ARRAY[
        'Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Solo', 'Bogor', 'Depok', 'Tangerang',
        'Medan', 'Palembang', 'Pekanbaru', 'Batam', 'Padang', 'Jambi', 'Lampung', 'Bengkulu',
        'Balikpapan', 'Pontianak', 'Samarinda', 'Banjarmasin',
        'Makassar', 'Manado', 'Denpasar, Bali'
    ];
    location_index INT := 1;
BEGIN
    FOR car_record IN SELECT id FROM cars ORDER BY id LOOP
        UPDATE cars SET location = location_list[location_index] WHERE id = car_record.id;
        location_index := location_index + 1;
        IF location_index > array_length(location_list, 1) THEN
            location_index := 1;
        END IF;
    END LOOP;
END $$;

-- ============================================
-- STEP 3: UPDATE SEMUA BODY TYPE
-- ============================================
DO $$
DECLARE
    car_record RECORD;
    body_type_list TEXT[] := ARRAY[
        'SUV', 'Sedan', 'Hatchback', 'MPV', 'Coupe', 'Convertible', 
        'Truck', 'Van', 'Wagon', 'Sports Car', 'Crossover', 'Pickup'
    ];
    body_type_index INT := 1;
BEGIN
    FOR car_record IN SELECT id FROM cars ORDER BY id LOOP
        UPDATE cars SET body_type = body_type_list[body_type_index] WHERE id = car_record.id;
        body_type_index := body_type_index + 1;
        IF body_type_index > array_length(body_type_list, 1) THEN
            body_type_index := 1;
        END IF;
    END LOOP;
END $$;

-- ============================================
-- STEP 4: UPDATE SEMUA TRANSMISSION
-- ============================================
DO $$
DECLARE
    car_record RECORD;
    transmission_list TEXT[] := ARRAY[
        'Manual', 'Automatic', 'CVT', 'DCT', 'Semi-Automatic', 'AMT'
    ];
    transmission_index INT := 1;
BEGIN
    FOR car_record IN SELECT id FROM cars ORDER BY id LOOP
        UPDATE cars SET transmission = transmission_list[transmission_index] WHERE id = car_record.id;
        transmission_index := transmission_index + 1;
        IF transmission_index > array_length(transmission_list, 1) THEN
            transmission_index := 1;
        END IF;
    END LOOP;
END $$;

-- ============================================
-- STEP 5: UPDATE SEMUA FUEL TYPE
-- ============================================
DO $$
DECLARE
    car_record RECORD;
    fuel_type_list TEXT[] := ARRAY[
        'Bensin', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid', 'CNG', 'LPG', 'Flex Fuel'
    ];
    fuel_type_index INT := 1;
BEGIN
    FOR car_record IN SELECT id FROM cars ORDER BY id LOOP
        UPDATE cars SET fuel_type = fuel_type_list[fuel_type_index] WHERE id = car_record.id;
        fuel_type_index := fuel_type_index + 1;
        IF fuel_type_index > array_length(fuel_type_list, 1) THEN
            fuel_type_index := 1;
        END IF;
    END LOOP;
END $$;

-- ============================================
-- VERIFIKASI HASIL
-- ============================================

-- Lihat distribusi brand
SELECT brand, COUNT(*) as total 
FROM cars 
GROUP BY brand 
ORDER BY brand;

-- Lihat distribusi location
SELECT location, COUNT(*) as total 
FROM cars 
GROUP BY location 
ORDER BY location;

-- Lihat distribusi body type
SELECT body_type, COUNT(*) as total 
FROM cars 
GROUP BY body_type 
ORDER BY body_type;

-- Lihat distribusi transmission
SELECT transmission, COUNT(*) as total 
FROM cars 
GROUP BY transmission 
ORDER BY transmission;

-- Lihat distribusi fuel type
SELECT fuel_type, COUNT(*) as total 
FROM cars 
GROUP BY fuel_type 
ORDER BY fuel_type;

-- Summary total
SELECT 
    COUNT(*) as total_cars,
    COUNT(DISTINCT brand) as total_brands,
    COUNT(DISTINCT location) as total_locations,
    COUNT(DISTINCT body_type) as total_body_types,
    COUNT(DISTINCT transmission) as total_transmissions,
    COUNT(DISTINCT fuel_type) as total_fuel_types
FROM cars;
