-- Ensure all required auth fields are set properly
UPDATE auth.users 
SET 
  aud = 'authenticated',
  role = 'authenticated',
  email_confirmed_at = now(),
  confirmation_token = '',
  recovery_token = '',
  last_sign_in_at = null,
  updated_at = now()
WHERE email = 'itz0jere@gmail.com';