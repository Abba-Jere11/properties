-- Create the admin profile for the newly created user
INSERT INTO public.profiles (user_id, email, first_name, last_name, role, is_active)
SELECT 
  au.id,
  au.email,
  'Admin',
  'User',
  'admin'::user_role,
  true
FROM auth.users au 
WHERE au.email = 'itz0jere@gmail.com';