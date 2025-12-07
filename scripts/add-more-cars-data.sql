-- SQL Script to Add More Cars Data for Filter Testing
-- Run this in Supabase SQL Editor

-- Insert Toyota Cars
INSERT INTO cars (brand, model, year, price, mileage, transmission, fuel_type, color, location, images, body_type, description, engine_capacity, condition, user_id, is_sold)
VALUES
-- Toyota Jakarta
('Toyota', 'Avanza 1.3 G MT', 2023, 215000000, 8500, 'Manual', 'Bensin', 'Silver', 'Jakarta', '["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"]', 'MPV', 'Toyota Avanza G manual 2023, kondisi sangat mulus seperti baru. Service record lengkap di dealer resmi.', '1.3L', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),
('Toyota', 'Fortuner 2.4 VRZ', 2022, 525000000, 15000, 'Automatic', 'Diesel', 'White', 'Jakarta', '["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"]', 'SUV', 'Toyota Fortuner VRZ diesel matic 2022, sangat terawat dengan interior mewah.', '2.4L', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),
('Toyota', 'Innova Reborn 2.4 V', 2021, 365000000, 22000, 'Automatic', 'Diesel', 'Gray', 'Jakarta', '["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"]', 'MPV', 'Toyota Innova Reborn diesel matic 2021, full original dan sangat irit.', '2.4L', 'Good', (SELECT id FROM profiles LIMIT 1), false),
('Toyota', 'Yaris 1.5 S TRD', 2023, 285000000, 6000, 'CVT', 'Bensin', 'Red', 'Jakarta', '["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800"]', 'Hatchback', 'Toyota Yaris TRD 2023, sporty dan irit BBM, cocok untuk anak muda.', '1.5L', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),
('Toyota', 'Corolla Altis 1.8 V', 2022, 425000000, 18000, 'CVT', 'Bensin', 'Black', 'Jakarta', '["https://images.unsplash.com/photo-1623869675781-80aa31f298d4?w=800"]', 'Sedan', 'Toyota Corolla Altis 2022, sedan premium dengan fitur lengkap.', '1.8L', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),

-- Toyota Surabaya
('Toyota', 'Rush 1.5 G MT', 2020, 225000000, 35000, 'Manual', 'Bensin', 'White', 'Surabaya', '["https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800"]', 'SUV', 'Toyota Rush manual 2020, pajak panjang dan mesin halus.', '1.5L', 'Good', (SELECT id FROM profiles LIMIT 1), false),
('Toyota', 'Alphard 2.5 G', 2021, 985000000, 12000, 'CVT', 'Bensin', 'Pearl White', 'Surabaya', '["https://images.unsplash.com/photo-1566023888-b58e5d3a3b4f?w=800"]', 'Van', 'Toyota Alphard 2021, MPV mewah dengan captain seat dan sunroof.', '2.5L', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),

-- Honda Cars
-- Honda Jakarta
('Honda', 'Brio Satya E MT', 2023, 165000000, 5000, 'Manual', 'Bensin', 'White', 'Jakarta', '["https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800"]', 'Hatchback', 'Honda Brio 2023, city car irit dan lincah untuk Jakarta.', '1.2L', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),
('Honda', 'Civic Type R', 2023, 1250000000, 3000, 'Manual', 'Bensin', 'Championship White', 'Jakarta', '["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800"]', 'Sports Car', 'Honda Civic Type R 2023, hot hatch dengan performa tinggi.', '2.0L Turbo', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),
('Honda', 'CR-V 1.5 Turbo', 2022, 525000000, 16000, 'CVT', 'Bensin', 'Modern Steel', 'Jakarta', '["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"]', 'SUV', 'Honda CR-V Turbo 2022, SUV premium dengan teknologi canggih.', '1.5L Turbo', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),
('Honda', 'HR-V 1.5 E CVT', 2021, 325000000, 24000, 'CVT', 'Bensin', 'Red', 'Jakarta', '["https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"]', 'SUV', 'Honda HR-V 2021, compact SUV dengan desain sporty.', '1.5L', 'Good', (SELECT id FROM profiles LIMIT 1), false),

-- Honda Bandung
('Honda', 'Accord 1.5 Turbo', 2023, 725000000, 8000, 'CVT', 'Bensin', 'Black', 'Bandung', '["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"]', 'Sedan', 'Honda Accord Turbo 2023, sedan eksekutif dengan teknologi hybrid.', '1.5L Turbo', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),
('Honda', 'Jazz RS CVT', 2022, 285000000, 14000, 'CVT', 'Bensin', 'Orange', 'Bandung', '["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"]', 'Hatchback', 'Honda Jazz RS 2022, hatchback sporty dengan interior luas.', '1.5L', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),

-- Honda Surabaya
('Honda', 'City Hatchback RS', 2023, 335000000, 7000, 'CVT', 'Bensin', 'Rallye Red', 'Surabaya', '["https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800"]', 'Hatchback', 'Honda City Hatchback RS 2023, kombinasi sedan dan hatchback.', '1.5L', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),

-- Mitsubishi Cars
-- Mitsubishi Jakarta
('Mitsubishi', 'Pajero Sport Dakar', 2022, 625000000, 20000, 'Automatic', 'Diesel', 'White', 'Jakarta', '["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"]', 'SUV', 'Mitsubishi Pajero Sport Dakar 2022, SUV tangguh dengan 4WD.', '2.4L', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),
('Mitsubishi', 'Xpander Ultimate', 2023, 285000000, 5500, 'Automatic', 'Bensin', 'Red', 'Jakarta', '["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"]', 'MPV', 'Mitsubishi Xpander Ultimate 2023, MPV compact dengan fitur lengkap.', '1.5L', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),
('Mitsubishi', 'Outlander PHEV', 2022, 785000000, 12000, 'CVT', 'Hybrid', 'Black', 'Jakarta', '["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"]', 'SUV', 'Mitsubishi Outlander PHEV 2022, SUV hybrid plug-in dengan teknologi ramah lingkungan.', '2.4L Hybrid', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),

-- Mitsubishi Bandung
('Mitsubishi', 'Eclipse Cross', 2021, 485000000, 28000, 'CVT', 'Bensin', 'Gray', 'Bandung', '["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"]', 'SUV', 'Mitsubishi Eclipse Cross 2021, SUV coupe dengan desain unik.', '1.5L Turbo', 'Good', (SELECT id FROM profiles LIMIT 1), false),

-- Daihatsu Cars
-- Daihatsu Jakarta
('Daihatsu', 'Xenia 1.3 R MT', 2023, 195000000, 6000, 'Manual', 'Bensin', 'Silver', 'Jakarta', '["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"]', 'MPV', 'Daihatsu Xenia 2023, MPV ekonomis dengan konsumsi BBM irit.', '1.3L', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),
('Daihatsu', 'Terios 1.5 X MT', 2022, 235000000, 18000, 'Manual', 'Bensin', 'White', 'Jakarta', '["https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800"]', 'SUV', 'Daihatsu Terios 2022, SUV compact cocok untuk jalan sempit.', '1.5L', 'Good', (SELECT id FROM profiles LIMIT 1), false),
('Daihatsu', 'Ayla 1.2 R AT', 2023, 155000000, 4000, 'Automatic', 'Bensin', 'Red', 'Jakarta', '["https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800"]', 'Hatchback', 'Daihatsu Ayla matic 2023, LCGC matic dengan fitur modern.', '1.2L', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),

-- Daihatsu Semarang
('Daihatsu', 'Rocky 1.0 R CVT', 2023, 245000000, 7500, 'CVT', 'Bensin', 'Orange', 'Semarang', '["https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"]', 'SUV', 'Daihatsu Rocky 2023, SUV compact dengan teknologi turbo.', '1.0L Turbo', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),

-- Suzuki Cars
-- Suzuki Jakarta
('Suzuki', 'Ertiga Sport AT', 2023, 265000000, 9000, 'Automatic', 'Bensin', 'Black', 'Jakarta', '["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"]', 'MPV', 'Suzuki Ertiga Sport 2023, MPV sporty dengan interior elegan.', '1.5L', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),
('Suzuki', 'XL7 Beta AT', 2022, 285000000, 16000, 'Automatic', 'Bensin', 'Blue', 'Jakarta', '["https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"]', 'SUV', 'Suzuki XL7 2022, SUV 7-seater dengan ground clearance tinggi.', '1.5L', 'Good', (SELECT id FROM profiles LIMIT 1), false),
('Suzuki', 'Swift Sport', 2023, 325000000, 5000, 'Manual', 'Bensin', 'Yellow', 'Jakarta', '["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800"]', 'Hatchback', 'Suzuki Swift Sport 2023, hot hatch dengan handling tajam.', '1.4L Turbo', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),

-- Suzuki Yogyakarta
('Suzuki', 'Jimny 4WD', 2022, 425000000, 14000, 'Manual', 'Bensin', 'Green', 'Yogyakarta', '["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"]', 'SUV', 'Suzuki Jimny 2022, off-road legend dengan desain ikonik.', '1.5L', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),

-- Mazda Cars
-- Mazda Jakarta
('Mazda', 'CX-5 Elite', 2022, 585000000, 19000, 'Automatic', 'Bensin', 'Soul Red', 'Jakarta', '["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"]', 'SUV', 'Mazda CX-5 Elite 2022, SUV premium dengan interior berkelas.', '2.5L', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),
('Mazda', 'MX-5 RF', 2023, 785000000, 4000, 'Manual', 'Bensin', 'Machine Gray', 'Jakarta', '["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800"]', 'Convertible', 'Mazda MX-5 RF 2023, roadster convertible dengan driving pleasure maksimal.', '2.0L', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),
('Mazda', '3 Sedan Skyactiv', 2022, 525000000, 15000, 'Automatic', 'Bensin', 'Snowflake White', 'Jakarta', '["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"]', 'Sedan', 'Mazda 3 Sedan 2022, sedan premium dengan teknologi Skyactiv.', '2.0L', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),

-- BMW Cars
-- BMW Jakarta
('BMW', '320i Sport', 2022, 825000000, 12000, 'Automatic', 'Bensin', 'Mineral White', 'Jakarta', '["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"]', 'Sedan', 'BMW 320i Sport 2022, sedan mewah dengan performa sporty.', '2.0L Turbo', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),
('BMW', 'X5 xDrive40i', 2021, 1450000000, 18000, 'Automatic', 'Bensin', 'Black Sapphire', 'Jakarta', '["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"]', 'SUV', 'BMW X5 2021, SUV mewah dengan teknologi canggih dan 4WD.', '3.0L Turbo', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),

-- BMW Surabaya
('BMW', 'M2 Competition', 2023, 1650000000, 3500, 'DCT', 'Bensin', 'Long Beach Blue', 'Surabaya', '["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800"]', 'Coupe', 'BMW M2 Competition 2023, sports coupe dengan performa tinggi.', '3.0L Twin-Turbo', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),

-- Mercedes-Benz Cars
-- Mercedes Jakarta
('Mercedes-Benz', 'C200 AMG Line', 2022, 925000000, 14000, 'Automatic', 'Bensin', 'Obsidian Black', 'Jakarta', '["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"]', 'Sedan', 'Mercedes-Benz C200 AMG 2022, sedan mewah dengan paket AMG.', '2.0L Turbo', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),
('Mercedes-Benz', 'GLC 200 AMG', 2023, 1250000000, 8000, 'Automatic', 'Bensin', 'Polar White', 'Jakarta', '["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"]', 'SUV', 'Mercedes-Benz GLC 200 2023, SUV mewah dengan desain elegan.', '2.0L Turbo', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),
('Mercedes-Benz', 'E300 Sportstyle', 2022, 1450000000, 11000, 'Automatic', 'Bensin', 'Selenite Grey', 'Jakarta', '["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"]', 'Sedan', 'Mercedes-Benz E300 2022, sedan eksekutif dengan teknologi terdepan.', '2.0L Turbo', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),

-- Nissan Cars
-- Nissan Jakarta
('Nissan', 'Livina VL AT', 2023, 265000000, 7000, 'CVT', 'Bensin', 'White', 'Jakarta', '["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"]', 'MPV', 'Nissan Livina 2023, MPV compact dengan kabin luas.', '1.5L', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),
('Nissan', 'Terra VL 4WD', 2022, 625000000, 22000, 'Automatic', 'Diesel', 'Gray', 'Jakarta', '["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"]', 'SUV', 'Nissan Terra 2022, SUV tangguh dengan mesin diesel dan 4WD.', '2.5L', 'Good', (SELECT id FROM profiles LIMIT 1), false),

-- Nissan Bandung
('Nissan', 'GT-R Premium', 2022, 2850000000, 5000, 'DCT', 'Bensin', 'Bayside Blue', 'Bandung', '["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800"]', 'Sports Car', 'Nissan GT-R 2022, supercar legend dengan teknologi AWD.', '3.8L Twin-Turbo', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),

-- Hyundai Cars
-- Hyundai Jakarta
('Hyundai', 'Palisade Signature', 2023, 985000000, 6000, 'Automatic', 'Diesel', 'Creamy White', 'Jakarta', '["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"]', 'SUV', 'Hyundai Palisade 2023, SUV 7-seater mewah dengan captain seat.', '2.2L', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),
('Hyundai', 'Creta Prime', 2023, 385000000, 8500, 'CVT', 'Bensin', 'Phantom Black', 'Jakarta', '["https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"]', 'SUV', 'Hyundai Creta 2023, SUV compact dengan fitur canggih.', '1.5L', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),

-- Hyundai Semarang
('Hyundai', 'Ioniq 5 Signature', 2023, 885000000, 4000, 'Automatic', 'Electric', 'Cyber Gray', 'Semarang', '["https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800"]', 'SUV', 'Hyundai Ioniq 5 2023, SUV elektrik dengan fast charging 800V.', 'Electric Motor', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),

-- Kia Cars
-- Kia Jakarta
('Kia', 'Seltos GT Line', 2023, 385000000, 7500, 'CVT', 'Bensin', 'Glacier White', 'Jakarta', '["https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"]', 'SUV', 'Kia Seltos GT Line 2023, SUV compact dengan desain bold.', '1.5L', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),
('Kia', 'Carnival Signature', 2022, 825000000, 15000, 'Automatic', 'Diesel', 'Aurora Black', 'Jakarta', '["https://images.unsplash.com/photo-1566023888-b58e5d3a3b4f?w=800"]', 'Van', 'Kia Carnival 2022, MPV premium dengan sliding door electric.', '2.2L', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),

-- Kia Bandung
('Kia', 'EV6 GT-Line', 2023, 1085000000, 5000, 'Automatic', 'Electric', 'Runway Red', 'Bandung', '["https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800"]', 'SUV', 'Kia EV6 2023, crossover elektrik dengan desain futuristik.', 'Electric Motor', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),

-- Wuling Cars
-- Wuling Jakarta
('Wuling', 'Almaz RS Pro', 2023, 385000000, 6500, 'CVT', 'Bensin', 'Dazzling Silver', 'Jakarta', '["https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"]', 'SUV', 'Wuling Almaz RS Pro 2023, SUV dengan fitur ADAS lengkap.', '1.5L Turbo', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),
('Wuling', 'Air EV Long Range', 2023, 285000000, 3000, 'Automatic', 'Electric', 'Aurora Green', 'Jakarta', '["https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800"]', 'Hatchback', 'Wuling Air EV 2023, city car elektrik dengan harga terjangkau.', 'Electric Motor', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),

-- Wuling Surabaya
('Wuling', 'Confero S LUX+', 2022, 225000000, 18000, 'Manual', 'Bensin', 'Starry Blue', 'Surabaya', '["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"]', 'MPV', 'Wuling Confero S 2022, MPV 7-seater dengan harga ekonomis.', '1.5L', 'Good', (SELECT id FROM profiles LIMIT 1), false),

-- DFSK Cars
-- DFSK Jakarta
('DFSK', 'Glory 580 Pro', 2023, 325000000, 8000, 'CVT', 'Bensin', 'Crystal White', 'Jakarta', '["https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"]', 'SUV', 'DFSK Glory 580 2023, SUV China dengan fitur lengkap dan harga kompetitif.', '1.5L Turbo', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),

-- MG Cars
-- MG Jakarta
('MG', 'HS i-Smart', 2023, 425000000, 7000, 'DCT', 'Bensin', 'Camden Grey', 'Jakarta', '["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"]', 'SUV', 'MG HS 2023, SUV dengan panoramic sunroof dan teknologi i-Smart.', '2.0L Turbo', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),
('MG', 'ZS EV Long Range', 2023, 525000000, 4500, 'Automatic', 'Electric', 'Diamond Red', 'Jakarta', '["https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800"]', 'SUV', 'MG ZS EV 2023, SUV elektrik dengan jangkauan 440 km.', 'Electric Motor', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),

-- Chery Cars
-- Chery Bandung
('Chery', 'Tiggo 8 Pro', 2023, 485000000, 6000, 'DCT', 'Bensin', 'Moonlight White', 'Bandung', '["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"]', 'SUV', 'Chery Tiggo 8 Pro 2023, SUV 7-seater dengan teknologi modern.', '1.6L Turbo', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),

-- Lexus Cars
-- Lexus Jakarta
('Lexus', 'RX 300 Luxury', 2022, 1650000000, 10000, 'CVT', 'Bensin', 'Sonic Silver', 'Jakarta', '["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"]', 'SUV', 'Lexus RX 300 2022, SUV mewah dengan kenyamanan tingkat tinggi.', '2.0L Turbo', 'Excellent', (SELECT id FROM profiles LIMIT 1), false),

-- Volvo Cars
-- Volvo Jakarta
('Volvo', 'XC60 T8 Inscription', 2022, 1450000000, 12000, 'Automatic', 'Hybrid', 'Crystal White', 'Jakarta', '["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"]', 'SUV', 'Volvo XC60 T8 2022, SUV hybrid plug-in dengan safety terlengkap.', '2.0L Plug-in Hybrid', 'Excellent', (SELECT id FROM profiles LIMIT 1), false);

-- Verify the inserted data
SELECT brand, COUNT(*) as total, 
       COUNT(DISTINCT body_type) as body_types,
       COUNT(DISTINCT location) as locations,
       COUNT(DISTINCT transmission) as transmissions,
       COUNT(DISTINCT fuel_type) as fuel_types
FROM cars 
GROUP BY brand 
ORDER BY total DESC;
