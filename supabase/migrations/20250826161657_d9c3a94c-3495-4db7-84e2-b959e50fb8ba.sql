-- Fix security issues: Update functions with proper search_path

-- 1. Fix get_current_user_role function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role 
SECURITY DEFINER 
SET search_path = public, auth
LANGUAGE SQL STABLE AS $$
    SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$;

-- 2. Fix is_admin function  
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN 
SECURITY DEFINER 
SET search_path = public, auth
LANGUAGE SQL STABLE AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    );
$$;

-- 3. Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER 
SET search_path = public, auth
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    );
    RETURN NEW;
END;
$$;

-- 4. Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;