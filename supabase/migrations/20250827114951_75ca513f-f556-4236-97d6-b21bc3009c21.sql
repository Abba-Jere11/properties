-- Insert sample estate data
INSERT INTO estates (name, location, description, total_units, available_units, sold_units, is_active, account_name, account_number, bank_name) VALUES
  ('Bakassi Estate', 'Bakassi GRA, Maiduguri', 'Premium residential development in the heart of Maiduguri with modern amenities and 24/7 security', 50, 45, 5, true, 'Thinklab Properties - Bakassi Estate', '0512044944', 'Zenith Bank'),
  ('Teachers Village', 'Teachers Village, Maiduguri', 'Family-friendly estate designed for educational professionals with community centers and playgrounds', 30, 28, 2, true, 'Thinklab Properties - Teachers Village', '0512045099', 'Zenith Bank');

-- Insert sample streets for the estates
INSERT INTO streets (name, description, estate_id) VALUES
  ('Bakassi Street 1', 'Main residential street with premium plots', (SELECT id FROM estates WHERE name = 'Bakassi Estate')),
  ('Bakassi Street 2', 'Secondary residential street', (SELECT id FROM estates WHERE name = 'Bakassi Estate')),
  ('Teachers Street 1', 'Primary residential area for educators', (SELECT id FROM estates WHERE name = 'Teachers Village')),
  ('Teachers Street 2', 'Family residential area', (SELECT id FROM estates WHERE name = 'Teachers Village'));

-- Insert sample properties data
INSERT INTO properties (title, price, estate_id, bedrooms, bathrooms, lot_size, property_type, images, amenities, status, square_feet, payment_plans) VALUES
  ('2-Bedroom Luxury Bungalow - Bakassi GRA', 40000000, (SELECT id FROM estates WHERE name = 'Bakassi Estate'), 2, 2, '700 sqm', 'Bungalow', ARRAY['/assets/property-1.jpg'], ARRAY['24/7 Security', '33KVA Power', 'Water Reticulation'], 'available', 180, ARRAY['outright', 'installment_6', 'installment_12']::payment_plan_type[]),
  ('Modern 2-Bedroom Bungalow - Bakassi GRA', 40000000, (SELECT id FROM estates WHERE name = 'Bakassi Estate'), 2, 2, '700 sqm', 'Bungalow', ARRAY['/assets/property-2.jpg'], ARRAY['24/7 Security', '33KVA Power', 'Water Reticulation'], 'available', 180, ARRAY['outright', 'installment_6', 'installment_12']::payment_plan_type[]),
  ('Premium 2-Bedroom Bungalow - Teachers Village', 40000000, (SELECT id FROM estates WHERE name = 'Teachers Village'), 2, 2, '700 sqm', 'Bungalow', ARRAY['/assets/property-3.jpg'], ARRAY['24/7 Security', 'Educational Facilities', 'Community Centers'], 'available', 180, ARRAY['outright', 'installment_6', 'installment_12']::payment_plan_type[]);