/*
  # Fix handle_new_user trigger: bypass RLS on agents INSERT

  ## Problem
  When a new user signs up via supabase.auth.signUp(), the handle_new_user trigger
  fires and tries to INSERT into public.agents. The RLS policy for INSERT on agents
  requires `id = auth.uid()`, but during trigger execution auth.uid() can return NULL
  (the session hasn't been established yet), causing a "Database error saving new user".

  ## Solution
  1. Recreate handle_new_user with `SET LOCAL row_security = off` so the INSERT
     always succeeds regardless of RLS policies.
  2. Keep SECURITY DEFINER so the function runs with elevated privileges.
  3. Also ensure the trigger is properly attached to auth.users.
*/

-- Drop and recreate the function with RLS bypass
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
  user_role  text;
  user_name  text;
  user_phone text;
  user_hosp  text;
BEGIN
  -- Bypass RLS for this insert — the trigger already runs as the DB owner
  -- via SECURITY DEFINER, but some Supabase versions still evaluate RLS.
  SET LOCAL row_security = off;

  -- Extract metadata passed from the sign-up call
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_app_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );

  user_phone := COALESCE(
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_app_meta_data->>'phone',
    ''
  );

  user_hosp := COALESCE(
    NEW.raw_user_meta_data->>'hospital_affiliation',
    NEW.raw_app_meta_data->>'hospital_affiliation',
    ''
  );

  -- Role defaults to 'agent' for public signups; admins are created via migrations
  user_role := COALESCE(NEW.raw_app_meta_data->>'role', 'agent');

  -- Insert the new agent row
  INSERT INTO public.agents (
    id,
    email,
    full_name,
    phone,
    hospital_affiliation,
    role,
    is_active
  ) VALUES (
    NEW.id,
    NEW.email,
    user_name,
    user_phone,
    user_hosp,
    user_role,
    true
  )
  ON CONFLICT (id) DO NOTHING;   -- idempotent: safe if row already exists

  -- Auto-confirm email so the user can log in immediately
  UPDATE auth.users
  SET email_confirmed_at = COALESCE(email_confirmed_at, now())
  WHERE id = NEW.id;

  RETURN NEW;

EXCEPTION
  WHEN OTHERS THEN
    -- Never let a trigger failure block the auth signup
    RAISE WARNING 'handle_new_user error (id=%): %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Make sure the trigger is still attached (recreate idempotently)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
