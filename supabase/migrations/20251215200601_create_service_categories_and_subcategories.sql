/*
  # Create Service Categories and Subcategories

  1. New Tables
    - `service_categories`
      - `id` (uuid, primary key)
      - `name` (text) - Category name (e.g., "Électricité", "Plomberie")
      - `slug` (text, unique) - URL-friendly version of the name
      - `description` (text) - Detailed description of the category
      - `icon_name` (text) - Name of the Lucide icon to display
      - `color` (text) - Color class for the icon
      - `image_url` (text) - Hero image for the category page
      - `display_order` (integer) - Order in which to display categories
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `service_subcategories`
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key) - References service_categories
      - `name` (text) - Subcategory name
      - `slug` (text) - URL-friendly version of the name
      - `description` (text) - Description of the subcategory
      - `image_url` (text) - Image for the subcategory
      - `display_order` (integer) - Order within the category
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Only authenticated users can create/update (for future admin panel)

  3. Indexes
    - Add index on category slug for fast lookups
    - Add index on subcategory category_id for efficient joins
*/

CREATE TABLE IF NOT EXISTS service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  icon_name text DEFAULT 'Briefcase',
  color text DEFAULT 'text-green-600',
  image_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS service_subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  description text DEFAULT '',
  image_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_service_categories_slug ON service_categories(slug);
CREATE INDEX IF NOT EXISTS idx_service_subcategories_category_id ON service_subcategories(category_id);

ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view service categories"
  ON service_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view service subcategories"
  ON service_subcategories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create service categories"
  ON service_categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update service categories"
  ON service_categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can create service subcategories"
  ON service_subcategories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update service subcategories"
  ON service_subcategories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
