-- Clear all existing users and profiles
DELETE FROM public.profiles;
DELETE FROM auth.identities;
DELETE FROM auth.users;