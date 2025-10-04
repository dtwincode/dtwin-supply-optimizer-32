-- Update all restaurant locations to B2C channel
UPDATE location_master
SET channel_id = 'B2C'
WHERE location_type = 'Restaurant';