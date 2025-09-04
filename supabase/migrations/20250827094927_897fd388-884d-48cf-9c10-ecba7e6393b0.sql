-- Update the password for the admin user with proper hashing
UPDATE auth.users 
SET encrypted_password = crypt('98078033hf', gen_salt('bf', 10))
WHERE email = 'itz0jere@gmail.com';