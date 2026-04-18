/*
  # Fix handle_new_user trigger for Resend email integration

  ## Changes
  1. Keep RLS bypass (SET LOCAL row_security = off) so the INSERT always works
  2. REMOVE the auto-confirm hack — Resend now sends real confirmation emails
  3. Keep ON CONFLICT (id) DO NOTHING for idempotency
  4. Recreate the trigger to ensure it is attached
*/

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
  -- Bypass RLS: auth.uid() is NULL during trigger execution, which would
  -- otherwise block the INSERT via the agents RLS policy.
  SET LOCAL row_security = off;

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

  -- Public signups always get 'agent' role; admins are created via migrations
  user_role := COALESCE(NEW.raw_app_meta_data->>'role', 'agent');

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
  ON CONFLICT (id) DO NOTHING;

  -- NOTE: We do NOT auto-confirm emails here anymore.
  -- Resend handles sending the confirmation email via Supabase Auth.

  RETURN NEW;

EXCEPTION
  WHEN OTHERS THEN
    -- Never block the auth signup due to a trigger error
    RAISE WARNING 'handle_new_user error (id=%): %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate trigger idempotently
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
