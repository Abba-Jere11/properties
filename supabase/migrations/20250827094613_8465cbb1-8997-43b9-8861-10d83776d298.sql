-- Create the auth user first
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) values (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'itz0jere@gmail.com',
  crypt('98078033hf', gen_salt('bf')),
  now(),
  null,
  null,
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Admin", "last_name": "User"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Then create the profile
INSERT INTO public.profiles (user_id, email, first_name, last_name, role, is_active)
SELECT 
  au.id,
  'itz0jere@gmail.com',
  'Admin',
  'User',
  'admin'::user_role,
  true
FROM auth.users au 
WHERE au.email = 'itz0jere@gmail.com';