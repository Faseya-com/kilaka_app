/*
  # Add public profile viewing for authenticated users

  1. Changes
    - Add policy to allow authenticated users to view all profiles
    - This is necessary for messaging functionality where users need to see other users' profiles

  2. Security
    - Only authenticated users can view profiles
    - Users can still only edit their own profiles
*/

-- Add policy to allow authenticated users to view all profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Authenticated users can view all profiles'
  ) THEN
    CREATE POLICY "Authenticated users can view all profiles"
      ON profiles FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;
