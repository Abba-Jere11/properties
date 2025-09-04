-- Cleanly recreate the admin user using Supabase admin helpers
DO $$
DECLARE
  existing_id uuid;
BEGIN
  -- 1) Delete any existing user with this email (cleans up identities, sessions, etc.)
  SELECT id INTO existing_id FROM auth.users WHERE email = 'itz0jere@gmail.com';
  IF existing_id IS NOT NULL THEN
    PERFORM auth.admin.delete_user(existing_id);
  END IF;

  -- 2) Create the user properly via admin helper (ensures all auth tables/identities are consistent)
  PERFORM auth.admin.create_user(
    email => 'itz0jere@gmail.com',
    password => '98078033hf',
    email_confirm => TRUE,
    user_metadata => jsonb_build_object('first_name','Admin','last_name','User')
  );

  -- 3) Upsert profile with admin role
  INSERT INTO public.profiles (user_id, email, first_name, last_name, role, is_active)
  SELECT u.id, u.email, 'Admin', 'User', 'admin'::user_role, TRUE
  FROM auth.users u
  WHERE u.email = 'itz0jere@gmail.com'
  ON CONFLICT (user_id) DO UPDATE SET role = 'admin'::user_role, is_active = TRUE;
END $$;