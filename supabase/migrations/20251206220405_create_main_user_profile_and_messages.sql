/*
  # Create main user profile and insert demo messages

  1. Changes
    - Create profile for main user if it doesn't exist
    - Insert sample messages between demo users and the main user
    - Creates realistic conversation threads

  2. Data Inserted
    - Profile for main user
    - Messages from Marie Dubois (designer)
    - Messages from Jean Martin (developer)
    - Messages from Sophie Laurent (marketing)
*/

-- Create profile for main user if it doesn't exist
DO $$
DECLARE
  main_user_id uuid;
  main_user_email text;
  marie_id uuid;
  jean_id uuid;
  sophie_id uuid;
BEGIN
  -- Get the main user from auth.users (not a demo user)
  SELECT id, email INTO main_user_id, main_user_email
  FROM auth.users 
  WHERE email NOT LIKE '%@demo.com' 
  ORDER BY created_at ASC 
  LIMIT 1;

  -- Create profile if user exists in auth but not in profiles
  IF main_user_id IS NOT NULL THEN
    INSERT INTO profiles (id, email, full_name)
    VALUES (main_user_id, main_user_email, split_part(main_user_email, '@', 1))
    ON CONFLICT (id) DO NOTHING;

    -- Get demo user IDs
    SELECT id INTO marie_id FROM profiles WHERE email = 'marie.designer@demo.com';
    SELECT id INTO jean_id FROM profiles WHERE email = 'jean.developer@demo.com';
    SELECT id INTO sophie_id FROM profiles WHERE email = 'sophie.marketing@demo.com';

    -- Delete existing demo messages to avoid duplicates
    DELETE FROM messages WHERE sender_id IN (marie_id, jean_id, sophie_id);

    -- Messages from Marie
    IF marie_id IS NOT NULL THEN
      INSERT INTO messages (sender_id, receiver_id, content, created_at) VALUES
      (marie_id, main_user_id, 'Bonjour! J''ai vu votre annonce pour un projet de site web. Je suis disponible pour en discuter.', now() - interval '2 hours'),
      (marie_id, main_user_id, 'Je peux vous envoyer mon portfolio si vous le souhaitez.', now() - interval '1 hour 45 minutes');
    END IF;

    -- Messages from Jean
    IF jean_id IS NOT NULL THEN
      INSERT INTO messages (sender_id, receiver_id, content, created_at) VALUES
      (jean_id, main_user_id, 'Salut! Je suis développeur freelance avec 5 ans d''expérience.', now() - interval '3 hours'),
      (jean_id, main_user_id, 'Quand pouvons-nous organiser un appel pour discuter de votre projet?', now() - interval '2 hours 30 minutes');
    END IF;

    -- Messages from Sophie
    IF sophie_id IS NOT NULL THEN
      INSERT INTO messages (sender_id, receiver_id, content, created_at) VALUES
      (sophie_id, main_user_id, 'Bonjour, j''ai une expertise en marketing digital et SEO.', now() - interval '4 hours'),
      (sophie_id, main_user_id, 'Je peux vous aider à améliorer votre visibilité en ligne.', now() - interval '3 hours 45 minutes');
    END IF;
  END IF;
END $$;
