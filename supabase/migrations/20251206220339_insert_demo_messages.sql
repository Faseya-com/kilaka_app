/*
  # Insert demo messages for testing

  1. Changes
    - Insert sample messages between demo users and the main user
    - Creates realistic conversation threads

  2. Data Inserted
    - Messages from Marie Dubois (designer)
    - Messages from Jean Martin (developer)
    - Messages from Sophie Laurent (marketing)
*/

-- Insert messages from demo users to the main user
DO $$
DECLARE
  main_user_id uuid;
  marie_id uuid;
  jean_id uuid;
  sophie_id uuid;
BEGIN
  -- Get the main user (not a demo user)
  SELECT id INTO main_user_id 
  FROM profiles 
  WHERE email NOT LIKE '%@demo.com' 
  ORDER BY created_at ASC 
  LIMIT 1;

  -- Get demo user IDs
  SELECT id INTO marie_id FROM profiles WHERE email = 'marie.designer@demo.com';
  SELECT id INTO jean_id FROM profiles WHERE email = 'jean.developer@demo.com';
  SELECT id INTO sophie_id FROM profiles WHERE email = 'sophie.marketing@demo.com';

  -- Only insert messages if we have a main user
  IF main_user_id IS NOT NULL THEN
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
