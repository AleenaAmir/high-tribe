-- Insert a new user
INSERT INTO users (full_name, email, phone_number, password)
VALUES ($1, $2, $3, $4)
RETURNING id, full_name, email, phone_number, is_phone_verified, created_at, updated_at;

-- Check if user exists by email or phone
SELECT id, email, phone_number 
FROM users 
WHERE email = $1 OR phone_number = $2;

-- Update phone verification status
UPDATE users 
SET is_phone_verified = TRUE, 
    updated_at = CURRENT_TIMESTAMP 
WHERE id = $1 
RETURNING id, full_name, email, phone_number, is_phone_verified;

-- Get user by email
SELECT id, full_name, email, phone_number, is_phone_verified, created_at 
FROM users 
WHERE email = $1;

-- Get user by phone number
SELECT id, full_name, email, phone_number, is_phone_verified, created_at 
FROM users 
WHERE phone_number = $1;

-- Update user password
UPDATE users 
SET password = $1, 
    updated_at = CURRENT_TIMESTAMP 
WHERE id = $2 
RETURNING id, email;

-- Delete user
DELETE FROM users 
WHERE id = $1 
RETURNING id, email; 