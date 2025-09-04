-- Create function to ensure a profile exists for the current user
CREATE OR REPLACE FUNCTION public.ensure_profile_exists()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  _user auth.users%ROWTYPE;
BEGIN
  SELECT * INTO _user FROM auth.users WHERE id = auth.uid();
  IF _user IS NULL THEN
    RETURN;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = _user.id) THEN
    INSERT INTO public.profiles (id, user_id, email, first_name, last_name, role)
    VALUES (
      gen_random_uuid(),
      _user.id,
      _user.email,
      COALESCE(_user.raw_user_meta_data->>'first_name',''),
      COALESCE(_user.raw_user_meta_data->>'last_name',''),
      'admin'
    );
  END IF;
END;
$$;