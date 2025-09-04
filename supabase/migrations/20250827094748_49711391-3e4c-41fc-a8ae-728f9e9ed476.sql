-- Update the existing profile to have admin role
UPDATE public.profiles 
SET role = 'admin'::user_role
WHERE email = 'itz0jere@gmail.com';