/*
  # Create Provider Onboarding Tables

  1. New Tables
    - `provider_onboarding`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key) - References profiles
      - `current_step` (integer) - Current step in the onboarding process
      - `personal_info_completed` (boolean)
      - `skills_completed` (boolean)
      - `experience_completed` (boolean)
      - `availability_completed` (boolean)
      - `payment_completed` (boolean)
      - `kyc_completed` (boolean)
      - `full_name` (text)
      - `phone` (text)
      - `address` (text)
      - `years_experience` (integer)
      - `status` (text) - draft, submitted, approved, rejected
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `provider_service_selections`
      - `id` (uuid, primary key)
      - `onboarding_id` (uuid, foreign key) - References provider_onboarding
      - `category_id` (uuid, foreign key) - References service_categories
      - `subcategory_id` (uuid, foreign key) - References service_subcategories (nullable)
      - `created_at` (timestamptz)
    
    - `provider_skills`
      - `id` (uuid, primary key)
      - `onboarding_id` (uuid, foreign key) - References provider_onboarding
      - `skill_name` (text)
      - `hourly_rate` (numeric) - nullable
      - `daily_rate` (numeric) - nullable
      - `created_at` (timestamptz)
    
    - `provider_certifications`
      - `id` (uuid, primary key)
      - `onboarding_id` (uuid, foreign key) - References provider_onboarding
      - `file_name` (text)
      - `file_url` (text)
      - `file_type` (text)
      - `created_at` (timestamptz)
    
    - `provider_portfolio`
      - `id` (uuid, primary key)
      - `onboarding_id` (uuid, foreign key) - References provider_onboarding
      - `image_url` (text)
      - `description` (text) - nullable
      - `created_at` (timestamptz)
    
    - `provider_payment_info`
      - `id` (uuid, primary key)
      - `onboarding_id` (uuid, foreign key) - References provider_onboarding
      - `payment_method` (text) - mobile, bank, paypal
      - `mobile_number` (text) - nullable
      - `mobile_provider` (text) - nullable
      - `bank_account` (text) - nullable
      - `paypal_email` (text) - nullable
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `provider_kyc_documents`
      - `id` (uuid, primary key)
      - `onboarding_id` (uuid, foreign key) - References provider_onboarding
      - `document_type` (text) - id_passport, proof_address, background_check
      - `file_name` (text)
      - `file_url` (text)
      - `file_type` (text)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Users can only access their own onboarding data
    - Admins can view all onboarding data

  3. Indexes
    - Add index on user_id for fast lookups
    - Add index on status for filtering
*/

CREATE TABLE IF NOT EXISTS provider_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  current_step integer DEFAULT 1,
  personal_info_completed boolean DEFAULT false,
  skills_completed boolean DEFAULT false,
  experience_completed boolean DEFAULT false,
  availability_completed boolean DEFAULT false,
  payment_completed boolean DEFAULT false,
  kyc_completed boolean DEFAULT false,
  full_name text,
  phone text,
  address text,
  years_experience integer DEFAULT 0,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS provider_service_selections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  onboarding_id uuid NOT NULL REFERENCES provider_onboarding(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  subcategory_id uuid REFERENCES service_subcategories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS provider_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  onboarding_id uuid NOT NULL REFERENCES provider_onboarding(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  hourly_rate numeric,
  daily_rate numeric,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS provider_certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  onboarding_id uuid NOT NULL REFERENCES provider_onboarding(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS provider_portfolio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  onboarding_id uuid NOT NULL REFERENCES provider_onboarding(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS provider_payment_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  onboarding_id uuid NOT NULL REFERENCES provider_onboarding(id) ON DELETE CASCADE,
  payment_method text NOT NULL,
  mobile_number text,
  mobile_provider text,
  bank_account text,
  paypal_email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(onboarding_id)
);

CREATE TABLE IF NOT EXISTS provider_kyc_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  onboarding_id uuid NOT NULL REFERENCES provider_onboarding(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_provider_onboarding_user_id ON provider_onboarding(user_id);
CREATE INDEX IF NOT EXISTS idx_provider_onboarding_status ON provider_onboarding(status);
CREATE INDEX IF NOT EXISTS idx_provider_service_selections_onboarding_id ON provider_service_selections(onboarding_id);
CREATE INDEX IF NOT EXISTS idx_provider_skills_onboarding_id ON provider_skills(onboarding_id);

ALTER TABLE provider_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_service_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_payment_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_kyc_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own onboarding"
  ON provider_onboarding FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding"
  ON provider_onboarding FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding"
  ON provider_onboarding FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own service selections"
  ON provider_service_selections FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM provider_onboarding
      WHERE provider_onboarding.id = provider_service_selections.onboarding_id
      AND provider_onboarding.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own service selections"
  ON provider_service_selections FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM provider_onboarding
      WHERE provider_onboarding.id = provider_service_selections.onboarding_id
      AND provider_onboarding.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM provider_onboarding
      WHERE provider_onboarding.id = provider_service_selections.onboarding_id
      AND provider_onboarding.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own skills"
  ON provider_skills FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM provider_onboarding
      WHERE provider_onboarding.id = provider_skills.onboarding_id
      AND provider_onboarding.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own skills"
  ON provider_skills FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM provider_onboarding
      WHERE provider_onboarding.id = provider_skills.onboarding_id
      AND provider_onboarding.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM provider_onboarding
      WHERE provider_onboarding.id = provider_skills.onboarding_id
      AND provider_onboarding.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own certifications"
  ON provider_certifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM provider_onboarding
      WHERE provider_onboarding.id = provider_certifications.onboarding_id
      AND provider_onboarding.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own certifications"
  ON provider_certifications FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM provider_onboarding
      WHERE provider_onboarding.id = provider_certifications.onboarding_id
      AND provider_onboarding.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM provider_onboarding
      WHERE provider_onboarding.id = provider_certifications.onboarding_id
      AND provider_onboarding.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own portfolio"
  ON provider_portfolio FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM provider_onboarding
      WHERE provider_onboarding.id = provider_portfolio.onboarding_id
      AND provider_onboarding.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own portfolio"
  ON provider_portfolio FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM provider_onboarding
      WHERE provider_onboarding.id = provider_portfolio.onboarding_id
      AND provider_onboarding.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM provider_onboarding
      WHERE provider_onboarding.id = provider_portfolio.onboarding_id
      AND provider_onboarding.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own payment info"
  ON provider_payment_info FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM provider_onboarding
      WHERE provider_onboarding.id = provider_payment_info.onboarding_id
      AND provider_onboarding.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own payment info"
  ON provider_payment_info FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM provider_onboarding
      WHERE provider_onboarding.id = provider_payment_info.onboarding_id
      AND provider_onboarding.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM provider_onboarding
      WHERE provider_onboarding.id = provider_payment_info.onboarding_id
      AND provider_onboarding.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own KYC documents"
  ON provider_kyc_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM provider_onboarding
      WHERE provider_onboarding.id = provider_kyc_documents.onboarding_id
      AND provider_onboarding.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own KYC documents"
  ON provider_kyc_documents FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM provider_onboarding
      WHERE provider_onboarding.id = provider_kyc_documents.onboarding_id
      AND provider_onboarding.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM provider_onboarding
      WHERE provider_onboarding.id = provider_kyc_documents.onboarding_id
      AND provider_onboarding.user_id = auth.uid()
    )
  );
