-- Insert admin user profile for itz0jere@gmail.com
-- Note: The auth.users record should already exist if the user signed up
-- This adds the profile record with admin role

INSERT INTO public.profiles (user_id, email, first_name, last_name, role, is_active)
SELECT 
  au.id,
  'itz0jere@gmail.com',
  'Admin',
  'User',
  'admin'::user_role,
  true
FROM auth.users au 
WHERE au.email = 'itz0jere@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
  role = 'admin'::user_role,
  is_active = true;