/*
  # Add Providers, Reviews, and Appointments System

  1. New Tables
    - `providers`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles, nullable for public profiles)
      - `name` (text)
      - `title` (text) - Professional title
      - `description` (text)
      - `specialty` (text) - e.g., Dentiste, Plombier, etc.
      - `avatar_url` (text, nullable)
      - `cover_image_url` (text, nullable)
      - `location` (text)
      - `rating` (numeric) - Average rating
      - `total_reviews` (integer)
      - `price_range` (text) - e.g., €€, €€€
      - `experience_years` (integer)
      - `is_verified` (boolean)
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `provider_services`
      - `id` (uuid, primary key)
      - `provider_id` (uuid, references providers)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `duration` (integer) - in minutes
      - `image_url` (text, nullable)
      - `created_at` (timestamptz)
    
    - `reviews`
      - `id` (uuid, primary key)
      - `provider_id` (uuid, references providers)
      - `user_id` (uuid, references profiles)
      - `rating` (integer) - 1 to 5
      - `comment` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `appointments`
      - `id` (uuid, primary key)
      - `provider_id` (uuid, references providers)
      - `user_id` (uuid, references profiles)
      - `service_id` (uuid, references provider_services, nullable)
      - `appointment_date` (timestamptz)
      - `status` (text) - pending, confirmed, cancelled, completed
      - `notes` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Providers can be viewed by anyone
    - Only authenticated users can create reviews and appointments
    - Users can only edit their own reviews and appointments
*/

-- Create providers table
CREATE TABLE IF NOT EXISTS providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  specialty text NOT NULL,
  avatar_url text,
  cover_image_url text,
  location text DEFAULT '',
  rating numeric(2,1) DEFAULT 0.0,
  total_reviews integer DEFAULT 0,
  price_range text DEFAULT '€€',
  experience_years integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers are viewable by everyone"
  ON providers FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Users can create own provider profile"
  ON providers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own provider profile"
  ON providers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create provider_services table
CREATE TABLE IF NOT EXISTS provider_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(10,2) NOT NULL,
  duration integer DEFAULT 60,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE provider_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Provider services are viewable by everyone"
  ON provider_services FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Provider can manage own services"
  ON provider_services FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM providers
      WHERE providers.id = provider_services.provider_id
      AND providers.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM providers
      WHERE providers.id = provider_services.provider_id
      AND providers.user_id = auth.uid()
    )
  );

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES provider_services(id) ON DELETE SET NULL,
  appointment_date timestamptz NOT NULL,
  status text DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM providers
    WHERE providers.id = appointments.provider_id
    AND providers.user_id = auth.uid()
  ));

CREATE POLICY "Users can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM providers
    WHERE providers.id = appointments.provider_id
    AND providers.user_id = auth.uid()
  ))
  WITH CHECK (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM providers
    WHERE providers.id = appointments.provider_id
    AND providers.user_id = auth.uid()
  ));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_providers_specialty ON providers(specialty);
CREATE INDEX IF NOT EXISTS idx_providers_location ON providers(location);
CREATE INDEX IF NOT EXISTS idx_providers_rating ON providers(rating DESC);
CREATE INDEX IF NOT EXISTS idx_provider_services_provider_id ON provider_services(provider_id);
CREATE INDEX IF NOT EXISTS idx_reviews_provider_id ON reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_appointments_provider_id ON appointments(provider_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);

-- Function to update provider rating
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE providers
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE provider_id = COALESCE(NEW.provider_id, OLD.provider_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE provider_id = COALESCE(NEW.provider_id, OLD.provider_id)
    ),
    updated_at = now()
  WHERE id = COALESCE(NEW.provider_id, OLD.provider_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update rating when review is added/updated/deleted
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_update_provider_rating'
  ) THEN
    CREATE TRIGGER trigger_update_provider_rating
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_provider_rating();
  END IF;
END $$;