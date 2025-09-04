-- Simply create an admin user manually using Supabase's built-in functions
-- This creates both the auth user and triggers the profile creation

-- First, let's create a test admin user with a simpler approach
-- We'll insert directly into auth.users with the proper format

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'itz0jere@gmail.com',
  crypt('98078033hf', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Admin", "last_name": "User"}'
);