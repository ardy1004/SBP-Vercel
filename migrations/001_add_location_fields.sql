-- Migration: Add location fields (kecamatan, kelurahan) to properties table
-- Add new columns to properties table

ALTER TABLE properties
ADD COLUMN kecamatan TEXT,
ADD COLUMN kelurahan TEXT,
ADD COLUMN kecamatan_id INTEGER REFERENCES subdistricts(id),
ADD COLUMN kelurahan_id INTEGER REFERENCES villages(id);

-- Create indexes for better performance
CREATE INDEX idx_properties_kecamatan_id ON properties(kecamatan_id);
CREATE INDEX idx_properties_kelurahan_id ON properties(kelurahan_id);

-- Create master tables for Indonesian administrative divisions

-- Provinces table
CREATE TABLE provinces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(10) UNIQUE
);

-- Districts/Cities table
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    province_id INTEGER NOT NULL REFERENCES provinces(id),
    UNIQUE(name, province_id)
);

-- Subdistricts/Kecamatan table
CREATE TABLE subdistricts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    district_id INTEGER NOT NULL REFERENCES districts(id),
    UNIQUE(name, district_id)
);

-- Villages/Kelurahan table
CREATE TABLE villages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subdistrict_id INTEGER NOT NULL REFERENCES subdistricts(id),
    postal_code VARCHAR(10),
    UNIQUE(name, subdistrict_id)
);

-- Insert sample data for Yogyakarta region
INSERT INTO provinces (id, name, code) VALUES
(1, 'Daerah Istimewa Yogyakarta', 'DIY');

INSERT INTO districts (id, name, province_id) VALUES
(1, 'Sleman', 1),
(2, 'Yogyakarta', 1),
(3, 'Bantul', 1),
(4, 'Gunungkidul', 1),
(5, 'Kulon Progo', 1);

-- Sample subdistricts for Sleman
INSERT INTO subdistricts (id, name, district_id) VALUES
(1, 'Depok', 1),
(2, 'Gamping', 1),
(3, 'Mlati', 1),
(4, 'Moyudan', 1),
(5, 'Ngaglik', 1),
(6, 'Sleman', 1),
(7, 'Tempel', 1);

-- Sample villages for Depok subdistrict
INSERT INTO villages (id, name, subdistrict_id, postal_code) VALUES
(1, 'Caturtunggal', 1, '55281'),
(2, 'Condongcatur', 1, '55283'),
(3, 'Depok', 1, '55281'),
(4, 'Kemiri', 1, '55281'),
(5, 'Maguwoharjo', 1, '55282');

-- Update existing properties with sample location data
-- This is just an example - in real migration, you'd need to map existing data
UPDATE properties
SET
    kecamatan = 'Depok',
    kelurahan = 'Caturtunggal',
    kecamatan_id = 1,
    kelurahan_id = 1
WHERE provinsi = 'Daerah Istimewa Yogyakarta'
  AND kabupaten = 'Sleman'
  AND (kecamatan IS NULL OR kecamatan = '');