/*
  # Bulletproof handle_new_user trigger — prevents duplicate email errors forever

  ## Root cause
  When a signup attempt fails mid-way (RLS block, network issue, etc.), the trigger
  may have already inserted an agents row with a stale UUID. On the next attempt
  Supabase creates a new auth.users row with a new UUID, the trigger fires again,
  and the INSERT violates the unique constraint on agents.email.

  ## Fix strategy (atomic, inside the trigger)
  1. SET LOCAL row_security = off — removes the RLS block that started all this.
  2. UPDATE any orphaned agents row that has the right email but wrong id — re-links
     it to the current auth user's UUID.
  3. INSERT only if no row with this id exists yet (ON CONFLICT id DO NOTHING).
  4. EXCEPTION block ensures a trigger error can NEVER block the auth signup.
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
  -- Disable RLS for the duration of this function.
  -- auth.uid() is NULL during trigger execution, which would otherwise make
  -- the INSERT policy (id = auth.uid()) block every new signup.
  SET LOCAL row_security = off;

  -- Extract metadata supplied by the sign-up call
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_app_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', NEW.raw_app_meta_data->>'phone', '');
  user_hosp  := COALESCE(NEW.raw_user_meta_data->>'hospital_affiliation', NEW.raw_app_meta_data->>'hospital_affiliation', '');
  -- Public signups → agent; admins are seeded via migrations
  user_role  := COALESCE(NEW.raw_app_meta_data->>'role', 'agent');

  -- ─────────────────────────────────────────────────────────────────────────
  -- STEP 1: Re-link any orphaned agents row that has the right email but a
  -- stale/different id. This handles the "user signed up twice" case where a
  -- previous attempt left a dangling row.
  -- ─────────────────────────────────────────────────────────────────────────
  UPDATE public.agents
  SET
    id                 = NEW.id,
    full_name          = COALESCE(NULLIF(user_name, ''),  full_name),
    phone              = COALESCE(NULLIF(user_phone, ''), phone),
    hospital_affiliation = COALESCE(NULLIF(user_hosp, ''), hospital_affiliation),
    is_active          = true
  WHERE email = NEW.email
    AND id   != NEW.id;

  -- ─────────────────────────────────────────────────────────────────────────
  -- STEP 2: Insert a fresh row only if one doesn't already exist for this id.
  -- (If STEP 1 re-linked an orphaned row, ON CONFLICT id DO NOTHING is a no-op.)
  -- ─────────────────────────────────────────────────────────────────────────
  INSERT INTO public.agents (id, email, full_name, phone, hospital_affiliation, role, is_active)
  VALUES (NEW.id, NEW.email, user_name, user_phone, user_hosp, user_role, true)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;

EXCEPTION
  WHEN OTHERS THEN
    -- Log but never block the auth signup
    RAISE WARNING 'handle_new_user error (id=%, email=%): %', NEW.id, NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger idempotently
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
