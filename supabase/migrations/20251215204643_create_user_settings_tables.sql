/*
  # Create User Settings Tables

  1. New Tables
    - `user_notification_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `job_offers_email` (boolean, default true)
      - `job_offers_push` (boolean, default true)
      - `job_offers_sms` (boolean, default false)
      - `payment_email` (boolean, default true)
      - `payment_push` (boolean, default true)
      - `invoices_email` (boolean, default true)
      - `system_email` (boolean, default true)
      - `system_push` (boolean, default false)
      - `system_sms` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_payment_methods`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `payment_type` (text: 'mobile_wallet', 'bank', 'paypal')
      - `is_primary` (boolean, default false)
      - `mobile_number` (text, nullable)
      - `mobile_provider` (text, nullable: 'orange', 'mtn', 'moov')
      - `bank_account` (text, nullable)
      - `bank_name` (text, nullable)
      - `paypal_email` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_login_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `login_at` (timestamp)
      - `ip_address` (text, nullable)
      - `device` (text, nullable)
      - `location` (text, nullable)
      - `status` (text: 'success', 'failed')
    
    - `user_security_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles, unique)
      - `two_factor_enabled` (boolean, default false)
      - `two_factor_method` (text, nullable: 'sms', 'authenticator')
      - `backup_codes` (text[], nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/update their own data
*/

CREATE TABLE IF NOT EXISTS user_notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  job_offers_email boolean DEFAULT true,
  job_offers_push boolean DEFAULT true,
  job_offers_sms boolean DEFAULT false,
  payment_email boolean DEFAULT true,
  payment_push boolean DEFAULT true,
  invoices_email boolean DEFAULT true,
  system_email boolean DEFAULT true,
  system_push boolean DEFAULT false,
  system_sms boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  payment_type text NOT NULL CHECK (payment_type IN ('mobile_wallet', 'bank', 'paypal')),
  is_primary boolean DEFAULT false,
  mobile_number text,
  mobile_provider text CHECK (mobile_provider IS NULL OR mobile_provider IN ('orange', 'mtn', 'moov')),
  bank_account text,
  bank_name text,
  paypal_email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_login_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  login_at timestamptz DEFAULT now(),
  ip_address text,
  device text,
  location text,
  status text DEFAULT 'success' CHECK (status IN ('success', 'failed'))
);

CREATE TABLE IF NOT EXISTS user_security_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  two_factor_enabled boolean DEFAULT false,
  two_factor_method text CHECK (two_factor_method IS NULL OR two_factor_method IN ('sms', 'authenticator')),
  backup_codes text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_security_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification preferences"
  ON user_notification_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences"
  ON user_notification_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification preferences"
  ON user_notification_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own payment methods"
  ON user_payment_methods FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment methods"
  ON user_payment_methods FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment methods"
  ON user_payment_methods FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment methods"
  ON user_payment_methods FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own login history"
  ON user_login_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own security settings"
  ON user_security_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own security settings"
  ON user_security_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own security settings"
  ON user_security_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);