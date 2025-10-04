-- Populate seating_capacity with logical values based on location patterns
-- Assigning realistic seating capacities for different restaurant profiles

UPDATE location_master
SET seating_capacity = CASE 
  -- Larger cities (Riyadh, Jeddah, Dammam) - higher capacity
  WHEN region IN ('Riyadh', 'Makkah', 'Eastern') THEN 
    CASE 
      WHEN location_id LIKE '%_001' OR location_id LIKE '%_002' THEN 120 -- Flagship locations
      WHEN location_id LIKE '%_003' OR location_id LIKE '%_004' THEN 100
      ELSE 80
    END
  -- Medium cities - medium capacity
  WHEN region IN ('Madinah', 'Qassim', 'Hail') THEN
    CASE 
      WHEN location_id LIKE '%_001' THEN 90
      ELSE 70
    END
  -- Smaller cities - smaller capacity
  WHEN region IN ('Tabuk', 'Asir', 'Northern Borders', 'Al Jawf', 'Najran', 'Al Bahah', 'Jazan') THEN
    CASE 
      WHEN location_id LIKE '%_001' THEN 70
      ELSE 55
    END
  ELSE 60 -- Default
END
WHERE location_type = 'Restaurant';