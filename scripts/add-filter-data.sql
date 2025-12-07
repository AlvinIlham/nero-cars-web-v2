-- Script untuk menambahkan data lokasi, brand, body type, dan atribut lain untuk filter
-- Tidak menambahkan mobil baru, hanya update data yang ada dengan variasi yang lebih lengkap

-- ============================================
-- UPDATE LOKASI (Kota-kota di Indonesia - 25 Kota)
-- ============================================

-- Jawa (10 kota)
UPDATE cars SET location = 'Jakarta' WHERE id IN (SELECT id FROM cars ORDER BY RANDOM() LIMIT 5);
UPDATE cars SET location = 'Bandung' WHERE id IN (SELECT id FROM cars WHERE location != 'Jakarta' ORDER BY RANDOM() LIMIT 4);
UPDATE cars SET location = 'Surabaya' WHERE id IN (SELECT id FROM cars WHERE location NOT IN ('Jakarta', 'Bandung') ORDER BY RANDOM() LIMIT 4);
UPDATE cars SET location = 'Semarang' WHERE id IN (SELECT id FROM cars WHERE location NOT IN ('Jakarta', 'Bandung', 'Surabaya') ORDER BY RANDOM() LIMIT 3);
UPDATE cars SET location = 'Yogyakarta' WHERE id IN (SELECT id FROM cars WHERE location NOT IN ('Jakarta', 'Bandung', 'Surabaya', 'Semarang') ORDER BY RANDOM() LIMIT 3);
UPDATE cars SET location = 'Malang' WHERE id IN (SELECT id FROM cars WHERE location NOT IN ('Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET location = 'Solo' WHERE id IN (SELECT id FROM cars WHERE location NOT IN ('Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET location = 'Bogor' WHERE id IN (SELECT id FROM cars WHERE location NOT IN ('Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Solo') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET location = 'Depok' WHERE id IN (SELECT id FROM cars WHERE location NOT IN ('Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Solo', 'Bogor') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET location = 'Tangerang' WHERE id IN (SELECT id FROM cars WHERE location NOT IN ('Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Solo', 'Bogor', 'Depok') ORDER BY RANDOM() LIMIT 2);

-- Sumatera (8 kota)
UPDATE cars SET location = 'Medan' WHERE id IN (SELECT id FROM cars WHERE location NOT IN ('Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Solo', 'Bogor', 'Depok', 'Tangerang') ORDER BY RANDOM() LIMIT 3);
UPDATE cars SET location = 'Palembang' WHERE id IN (SELECT id FROM cars WHERE location NOT IN ('Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Solo', 'Bogor', 'Depok', 'Tangerang', 'Medan') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET location = 'Pekanbaru' WHERE id IN (SELECT id FROM cars WHERE location NOT IN ('Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Solo', 'Bogor', 'Depok', 'Tangerang', 'Medan', 'Palembang') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET location = 'Batam' WHERE id IN (SELECT id FROM cars WHERE location NOT IN ('Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Solo', 'Bogor', 'Depok', 'Tangerang', 'Medan', 'Palembang', 'Pekanbaru') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET location = 'Padang' WHERE id IN (SELECT id FROM cars WHERE location NOT IN ('Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Solo', 'Bogor', 'Depok', 'Tangerang', 'Medan', 'Palembang', 'Pekanbaru', 'Batam') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET location = 'Jambi' WHERE id IN (SELECT id FROM cars WHERE location NOT IN ('Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Solo', 'Bogor', 'Depok', 'Tangerang', 'Medan', 'Palembang', 'Pekanbaru', 'Batam', 'Padang') ORDER BY RANDOM() LIMIT 1);
UPDATE cars SET location = 'Lampung' WHERE id IN (SELECT id FROM cars WHERE location NOT IN ('Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Solo', 'Bogor', 'Depok', 'Tangerang', 'Medan', 'Palembang', 'Pekanbaru', 'Batam', 'Padang', 'Jambi') ORDER BY RANDOM() LIMIT 1);
UPDATE cars SET location = 'Bengkulu' WHERE id IN (SELECT id FROM cars WHERE location NOT IN ('Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Solo', 'Bogor', 'Depok', 'Tangerang', 'Medan', 'Palembang', 'Pekanbaru', 'Batam', 'Padang', 'Jambi', 'Lampung') ORDER BY RANDOM() LIMIT 1);

-- Kalimantan (4 kota)
UPDATE cars SET location = 'Balikpapan' WHERE id IN (SELECT id FROM cars WHERE location NOT IN ('Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Solo', 'Bogor', 'Depok', 'Tangerang', 'Medan', 'Palembang', 'Pekanbaru', 'Batam', 'Padang', 'Jambi', 'Lampung', 'Bengkulu') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET location = 'Pontianak' WHERE id IN (SELECT id FROM cars WHERE location NOT IN ('Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Solo', 'Bogor', 'Depok', 'Tangerang', 'Medan', 'Palembang', 'Pekanbaru', 'Batam', 'Padang', 'Jambi', 'Lampung', 'Bengkulu', 'Balikpapan') ORDER BY RANDOM() LIMIT 1);
UPDATE cars SET location = 'Samarinda' WHERE id IN (SELECT id FROM cars WHERE location NOT IN ('Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Solo', 'Bogor', 'Depok', 'Tangerang', 'Medan', 'Palembang', 'Pekanbaru', 'Batam', 'Padang', 'Jambi', 'Lampung', 'Bengkulu', 'Balikpapan', 'Pontianak') ORDER BY RANDOM() LIMIT 1);
UPDATE cars SET location = 'Banjarmasin' WHERE id IN (SELECT id FROM cars WHERE location NOT IN ('Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Solo', 'Bogor', 'Depok', 'Tangerang', 'Medan', 'Palembang', 'Pekanbaru', 'Batam', 'Padang', 'Jambi', 'Lampung', 'Bengkulu', 'Balikpapan', 'Pontianak', 'Samarinda') ORDER BY RANDOM() LIMIT 1);

-- Sulawesi & Indonesia Timur (3 kota)
UPDATE cars SET location = 'Makassar' WHERE id IN (SELECT id FROM cars WHERE location NOT IN ('Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Solo', 'Bogor', 'Depok', 'Tangerang', 'Medan', 'Palembang', 'Pekanbaru', 'Batam', 'Padang', 'Jambi', 'Lampung', 'Bengkulu', 'Balikpapan', 'Pontianak', 'Samarinda', 'Banjarmasin') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET location = 'Manado' WHERE id IN (SELECT id FROM cars WHERE location NOT IN ('Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Solo', 'Bogor', 'Depok', 'Tangerang', 'Medan', 'Palembang', 'Pekanbaru', 'Batam', 'Padang', 'Jambi', 'Lampung', 'Bengkulu', 'Balikpapan', 'Pontianak', 'Samarinda', 'Banjarmasin', 'Makassar') ORDER BY RANDOM() LIMIT 1);
UPDATE cars SET location = 'Denpasar, Bali' WHERE id IN (SELECT id FROM cars WHERE location NOT IN ('Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Solo', 'Bogor', 'Depok', 'Tangerang', 'Medan', 'Palembang', 'Pekanbaru', 'Batam', 'Padang', 'Jambi', 'Lampung', 'Bengkulu', 'Balikpapan', 'Pontianak', 'Samarinda', 'Banjarmasin', 'Makassar', 'Manado') ORDER BY RANDOM() LIMIT 2);

-- ============================================
-- UPDATE BRAND (Merek Mobil Populer - 30 Brand)
-- ============================================

-- Brand Jepang (9 brand)
UPDATE cars SET brand = 'Toyota' WHERE id IN (SELECT id FROM cars ORDER BY RANDOM() LIMIT 5);
UPDATE cars SET brand = 'Honda' WHERE id IN (SELECT id FROM cars WHERE brand != 'Toyota' ORDER BY RANDOM() LIMIT 5);
UPDATE cars SET brand = 'Daihatsu' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda') ORDER BY RANDOM() LIMIT 4);
UPDATE cars SET brand = 'Suzuki' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu') ORDER BY RANDOM() LIMIT 4);
UPDATE cars SET brand = 'Mitsubishi' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki') ORDER BY RANDOM() LIMIT 3);
UPDATE cars SET brand = 'Nissan' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi') ORDER BY RANDOM() LIMIT 3);
UPDATE cars SET brand = 'Mazda' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET brand = 'Lexus' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET brand = 'Subaru' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda', 'Lexus') ORDER BY RANDOM() LIMIT 1);

-- Brand Korea (3 brand)
UPDATE cars SET brand = 'Hyundai' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda', 'Lexus', 'Subaru') ORDER BY RANDOM() LIMIT 3);
UPDATE cars SET brand = 'Kia' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda', 'Lexus', 'Subaru', 'Hyundai') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET brand = 'Genesis' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda', 'Lexus', 'Subaru', 'Hyundai', 'Kia') ORDER BY RANDOM() LIMIT 1);

-- Brand China (5 brand)
UPDATE cars SET brand = 'Wuling' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda', 'Lexus', 'Subaru', 'Hyundai', 'Kia', 'Genesis') ORDER BY RANDOM() LIMIT 3);
UPDATE cars SET brand = 'Chery' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda', 'Lexus', 'Subaru', 'Hyundai', 'Kia', 'Genesis', 'Wuling') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET brand = 'MG' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda', 'Lexus', 'Subaru', 'Hyundai', 'Kia', 'Genesis', 'Wuling', 'Chery') ORDER BY RANDOM() LIMIT 1);
UPDATE cars SET brand = 'BYD' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda', 'Lexus', 'Subaru', 'Hyundai', 'Kia', 'Genesis', 'Wuling', 'Chery', 'MG') ORDER BY RANDOM() LIMIT 1);
UPDATE cars SET brand = 'Geely' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda', 'Lexus', 'Subaru', 'Hyundai', 'Kia', 'Genesis', 'Wuling', 'Chery', 'MG', 'BYD') ORDER BY RANDOM() LIMIT 1);

-- Brand Jerman (5 brand)
UPDATE cars SET brand = 'Mercedes-Benz' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda', 'Lexus', 'Subaru', 'Hyundai', 'Kia', 'Genesis', 'Wuling', 'Chery', 'MG', 'BYD', 'Geely') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET brand = 'BMW' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda', 'Lexus', 'Subaru', 'Hyundai', 'Kia', 'Genesis', 'Wuling', 'Chery', 'MG', 'BYD', 'Geely', 'Mercedes-Benz') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET brand = 'Audi' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda', 'Lexus', 'Subaru', 'Hyundai', 'Kia', 'Genesis', 'Wuling', 'Chery', 'MG', 'BYD', 'Geely', 'Mercedes-Benz', 'BMW') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET brand = 'Volkswagen' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda', 'Lexus', 'Subaru', 'Hyundai', 'Kia', 'Genesis', 'Wuling', 'Chery', 'MG', 'BYD', 'Geely', 'Mercedes-Benz', 'BMW', 'Audi') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET brand = 'Porsche' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda', 'Lexus', 'Subaru', 'Hyundai', 'Kia', 'Genesis', 'Wuling', 'Chery', 'MG', 'BYD', 'Geely', 'Mercedes-Benz', 'BMW', 'Audi', 'Volkswagen') ORDER BY RANDOM() LIMIT 1);

-- Brand Eropa Lainnya (5 brand)
UPDATE cars SET brand = 'Volvo' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda', 'Lexus', 'Subaru', 'Hyundai', 'Kia', 'Genesis', 'Wuling', 'Chery', 'MG', 'BYD', 'Geely', 'Mercedes-Benz', 'BMW', 'Audi', 'Volkswagen', 'Porsche') ORDER BY RANDOM() LIMIT 1);
UPDATE cars SET brand = 'Peugeot' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda', 'Lexus', 'Subaru', 'Hyundai', 'Kia', 'Genesis', 'Wuling', 'Chery', 'MG', 'BYD', 'Geely', 'Mercedes-Benz', 'BMW', 'Audi', 'Volkswagen', 'Porsche', 'Volvo') ORDER BY RANDOM() LIMIT 1);
UPDATE cars SET brand = 'Renault' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda', 'Lexus', 'Subaru', 'Hyundai', 'Kia', 'Genesis', 'Wuling', 'Chery', 'MG', 'BYD', 'Geely', 'Mercedes-Benz', 'BMW', 'Audi', 'Volkswagen', 'Porsche', 'Volvo', 'Peugeot') ORDER BY RANDOM() LIMIT 1);
UPDATE cars SET brand = 'Land Rover' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda', 'Lexus', 'Subaru', 'Hyundai', 'Kia', 'Genesis', 'Wuling', 'Chery', 'MG', 'BYD', 'Geely', 'Mercedes-Benz', 'BMW', 'Audi', 'Volkswagen', 'Porsche', 'Volvo', 'Peugeot', 'Renault') ORDER BY RANDOM() LIMIT 1);
UPDATE cars SET brand = 'Mini' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda', 'Lexus', 'Subaru', 'Hyundai', 'Kia', 'Genesis', 'Wuling', 'Chery', 'MG', 'BYD', 'Geely', 'Mercedes-Benz', 'BMW', 'Audi', 'Volkswagen', 'Porsche', 'Volvo', 'Peugeot', 'Renault', 'Land Rover') ORDER BY RANDOM() LIMIT 1);

-- Brand Amerika (3 brand)
UPDATE cars SET brand = 'Ford' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda', 'Lexus', 'Subaru', 'Hyundai', 'Kia', 'Genesis', 'Wuling', 'Chery', 'MG', 'BYD', 'Geely', 'Mercedes-Benz', 'BMW', 'Audi', 'Volkswagen', 'Porsche', 'Volvo', 'Peugeot', 'Renault', 'Land Rover', 'Mini') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET brand = 'Chevrolet' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda', 'Lexus', 'Subaru', 'Hyundai', 'Kia', 'Genesis', 'Wuling', 'Chery', 'MG', 'BYD', 'Geely', 'Mercedes-Benz', 'BMW', 'Audi', 'Volkswagen', 'Porsche', 'Volvo', 'Peugeot', 'Renault', 'Land Rover', 'Mini', 'Ford') ORDER BY RANDOM() LIMIT 1);
UPDATE cars SET brand = 'Jeep' WHERE id IN (SELECT id FROM cars WHERE brand NOT IN ('Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi', 'Nissan', 'Mazda', 'Lexus', 'Subaru', 'Hyundai', 'Kia', 'Genesis', 'Wuling', 'Chery', 'MG', 'BYD', 'Geely', 'Mercedes-Benz', 'BMW', 'Audi', 'Volkswagen', 'Porsche', 'Volvo', 'Peugeot', 'Renault', 'Land Rover', 'Mini', 'Ford', 'Chevrolet') ORDER BY RANDOM() LIMIT 1);

-- ============================================
-- UPDATE BODY TYPE (Tipe Bodi Mobil - 12 Types)
-- ============================================

UPDATE cars SET body_type = 'SUV' WHERE id IN (SELECT id FROM cars ORDER BY RANDOM() LIMIT 8);
UPDATE cars SET body_type = 'Sedan' WHERE id IN (SELECT id FROM cars WHERE body_type != 'SUV' ORDER BY RANDOM() LIMIT 7);
UPDATE cars SET body_type = 'Hatchback' WHERE id IN (SELECT id FROM cars WHERE body_type NOT IN ('SUV', 'Sedan') ORDER BY RANDOM() LIMIT 6);
UPDATE cars SET body_type = 'MPV' WHERE id IN (SELECT id FROM cars WHERE body_type NOT IN ('SUV', 'Sedan', 'Hatchback') ORDER BY RANDOM() LIMIT 6);
UPDATE cars SET body_type = 'Coupe' WHERE id IN (SELECT id FROM cars WHERE body_type NOT IN ('SUV', 'Sedan', 'Hatchback', 'MPV') ORDER BY RANDOM() LIMIT 3);
UPDATE cars SET body_type = 'Convertible' WHERE id IN (SELECT id FROM cars WHERE body_type NOT IN ('SUV', 'Sedan', 'Hatchback', 'MPV', 'Coupe') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET body_type = 'Truck' WHERE id IN (SELECT id FROM cars WHERE body_type NOT IN ('SUV', 'Sedan', 'Hatchback', 'MPV', 'Coupe', 'Convertible') ORDER BY RANDOM() LIMIT 3);
UPDATE cars SET body_type = 'Van' WHERE id IN (SELECT id FROM cars WHERE body_type NOT IN ('SUV', 'Sedan', 'Hatchback', 'MPV', 'Coupe', 'Convertible', 'Truck') ORDER BY RANDOM() LIMIT 3);
UPDATE cars SET body_type = 'Wagon' WHERE id IN (SELECT id FROM cars WHERE body_type NOT IN ('SUV', 'Sedan', 'Hatchback', 'MPV', 'Coupe', 'Convertible', 'Truck', 'Van') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET body_type = 'Sports Car' WHERE id IN (SELECT id FROM cars WHERE body_type NOT IN ('SUV', 'Sedan', 'Hatchback', 'MPV', 'Coupe', 'Convertible', 'Truck', 'Van', 'Wagon') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET body_type = 'Crossover' WHERE id IN (SELECT id FROM cars WHERE body_type NOT IN ('SUV', 'Sedan', 'Hatchback', 'MPV', 'Coupe', 'Convertible', 'Truck', 'Van', 'Wagon', 'Sports Car') ORDER BY RANDOM() LIMIT 3);
UPDATE cars SET body_type = 'Pickup' WHERE id IN (SELECT id FROM cars WHERE body_type NOT IN ('SUV', 'Sedan', 'Hatchback', 'MPV', 'Coupe', 'Convertible', 'Truck', 'Van', 'Wagon', 'Sports Car', 'Crossover') ORDER BY RANDOM() LIMIT 2);

-- ============================================
-- UPDATE TRANSMISSION (Tipe Transmisi - 6 Types)
-- ============================================

UPDATE cars SET transmission = 'Manual' WHERE id IN (SELECT id FROM cars ORDER BY RANDOM() LIMIT 15);
UPDATE cars SET transmission = 'Automatic' WHERE id IN (SELECT id FROM cars WHERE transmission != 'Manual' ORDER BY RANDOM() LIMIT 15);
UPDATE cars SET transmission = 'CVT' WHERE id IN (SELECT id FROM cars WHERE transmission NOT IN ('Manual', 'Automatic') ORDER BY RANDOM() LIMIT 10);
UPDATE cars SET transmission = 'DCT' WHERE id IN (SELECT id FROM cars WHERE transmission NOT IN ('Manual', 'Automatic', 'CVT') ORDER BY RANDOM() LIMIT 5);
UPDATE cars SET transmission = 'Semi-Automatic' WHERE id IN (SELECT id FROM cars WHERE transmission NOT IN ('Manual', 'Automatic', 'CVT', 'DCT') ORDER BY RANDOM() LIMIT 3);
UPDATE cars SET transmission = 'AMT' WHERE id IN (SELECT id FROM cars WHERE transmission NOT IN ('Manual', 'Automatic', 'CVT', 'DCT', 'Semi-Automatic') ORDER BY RANDOM() LIMIT 2);

-- ============================================
-- UPDATE FUEL TYPE (Jenis Bahan Bakar - 8 Types)
-- ============================================

UPDATE cars SET fuel_type = 'Bensin' WHERE id IN (SELECT id FROM cars ORDER BY RANDOM() LIMIT 20);
UPDATE cars SET fuel_type = 'Diesel' WHERE id IN (SELECT id FROM cars WHERE fuel_type != 'Bensin' ORDER BY RANDOM() LIMIT 12);
UPDATE cars SET fuel_type = 'Electric' WHERE id IN (SELECT id FROM cars WHERE fuel_type NOT IN ('Bensin', 'Diesel') ORDER BY RANDOM() LIMIT 5);
UPDATE cars SET fuel_type = 'Hybrid' WHERE id IN (SELECT id FROM cars WHERE fuel_type NOT IN ('Bensin', 'Diesel', 'Electric') ORDER BY RANDOM() LIMIT 5);
UPDATE cars SET fuel_type = 'Plug-in Hybrid' WHERE id IN (SELECT id FROM cars WHERE fuel_type NOT IN ('Bensin', 'Diesel', 'Electric', 'Hybrid') ORDER BY RANDOM() LIMIT 3);
UPDATE cars SET fuel_type = 'CNG' WHERE id IN (SELECT id FROM cars WHERE fuel_type NOT IN ('Bensin', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET fuel_type = 'LPG' WHERE id IN (SELECT id FROM cars WHERE fuel_type NOT IN ('Bensin', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid', 'CNG') ORDER BY RANDOM() LIMIT 2);
UPDATE cars SET fuel_type = 'Flex Fuel' WHERE id IN (SELECT id FROM cars WHERE fuel_type NOT IN ('Bensin', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid', 'CNG', 'LPG') ORDER BY RANDOM() LIMIT 1);

-- ============================================
-- VERIFIKASI HASIL
-- ============================================

-- Lihat distribusi lokasi (Total: 25 kota)
SELECT location, COUNT(*) as total 
FROM cars 
GROUP BY location 
ORDER BY total DESC;

-- Lihat distribusi brand (Total: 30 brand)
SELECT brand, COUNT(*) as total 
FROM cars 
GROUP BY brand 
ORDER BY total DESC;

-- Lihat distribusi body type (Total: 12 tipe)
SELECT body_type, COUNT(*) as total 
FROM cars 
GROUP BY body_type 
ORDER BY total DESC;

-- Lihat distribusi transmission (Total: 6 tipe)
SELECT transmission, COUNT(*) as total 
FROM cars 
GROUP BY transmission 
ORDER BY total DESC;

-- Lihat distribusi fuel type (Total: 8 tipe)
SELECT fuel_type, COUNT(*) as total 
FROM cars 
GROUP BY fuel_type 
ORDER BY total DESC;

-- Total kombinasi untuk filter lengkap
SELECT 
    (SELECT COUNT(DISTINCT location) FROM cars) as total_locations,
    (SELECT COUNT(DISTINCT brand) FROM cars) as total_brands,
    (SELECT COUNT(DISTINCT body_type) FROM cars) as total_body_types,
    (SELECT COUNT(DISTINCT transmission) FROM cars) as total_transmissions,
    (SELECT COUNT(DISTINCT fuel_type) FROM cars) as total_fuel_types;
