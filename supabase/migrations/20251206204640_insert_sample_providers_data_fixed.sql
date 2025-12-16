/*
  # Insert Sample Provider Data

  This migration adds sample data for testing:
  - 10 providers across different specialties
  - Services for each provider
  - Sample reviews for providers
  
  Note: This is test data for demonstration purposes
*/

-- Insert sample providers
INSERT INTO providers (id, name, title, description, specialty, avatar_url, cover_image_url, location, rating, total_reviews, price_range, experience_years, is_verified, is_active) VALUES
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'Dr. Marie Dubois',
  'Dentiste Pédodontiste',
  'Spécialisée dans les soins dentaires pour enfants et adolescents. Cabinet moderne équipé des dernières technologies. Approche douce et rassurante pour les jeunes patients.',
  'Dentiste',
  'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Paris',
  4.8,
  127,
  '€€€',
  15,
  true,
  true
),
(
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::uuid,
  'Jean Martin',
  'Plombier Chauffagiste',
  'Intervention rapide 24/7. Expert en installation et réparation de systèmes de chauffage et plomberie. Service de qualité et prix compétitifs.',
  'Plombier',
  'https://images.pexels.com/photos/1098515/pexels-photo-1098515.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Lyon',
  4.7,
  89,
  '€€',
  12,
  true,
  true
),
(
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::uuid,
  'Sophie Laurent',
  'Coiffeuse Styliste',
  'Passionnée par les nouvelles tendances capillaires. Spécialiste coloration et coupes modernes. Produits professionnels de haute qualité.',
  'Coiffeur',
  'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Marseille',
  4.9,
  156,
  '€€',
  8,
  true,
  true
),
(
  'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::uuid,
  'Pierre Moreau',
  'Électricien Certifié',
  'Installation électrique, dépannage et mise aux normes. Certifié Qualifelec. Travail soigné et garantie sur toutes les interventions.',
  'Électricien',
  'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Toulouse',
  4.6,
  73,
  '€€',
  10,
  true,
  true
),
(
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::uuid,
  'Dr. Thomas Bernard',
  'Médecin Généraliste',
  'Consultation générale, suivi médical et prévention. Écoute attentive et diagnostic précis. Téléconsultation disponible.',
  'Médecin',
  'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Nice',
  4.9,
  201,
  '€€€',
  20,
  true,
  true
),
(
  'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16'::uuid,
  'Emma Petit',
  'Coach Personnel & Nutritionniste',
  'Programme personnalisé pour atteindre vos objectifs. Coaching sportif et conseils nutritionnels adaptés. Suivi régulier et motivation.',
  'Coach',
  'https://images.pexels.com/photos/3768894/pexels-photo-3768894.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/3768593/pexels-photo-3768593.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Bordeaux',
  5.0,
  94,
  '€€',
  6,
  true,
  true
),
(
  '10eebc99-9c0b-4ef8-bb6d-6bb9bd380a17'::uuid,
  'Lucas Rousseau',
  'Designer UX/UI',
  'Création d''interfaces utilisateur modernes et intuitives. Expert en design thinking et prototypage. Portfolio de projets variés.',
  'Designer',
  'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/1181243/pexels-photo-1181243.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Paris',
  4.8,
  67,
  '€€€',
  7,
  true,
  true
),
(
  '20eebc99-9c0b-4ef8-bb6d-6bb9bd380a18'::uuid,
  'Camille Lefebvre',
  'Consultante Marketing Digital',
  'Stratégie digitale et SEO. Accompagnement des entreprises dans leur transformation numérique. Résultats mesurables et durables.',
  'Consultant',
  'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Lyon',
  4.7,
  82,
  '€€€',
  9,
  true,
  true
),
(
  '30eebc99-9c0b-4ef8-bb6d-6bb9bd380a19'::uuid,
  'Alexandre Durand',
  'Développeur Full Stack',
  'Développement web et mobile. React, Node.js, React Native. Solutions sur mesure pour vos projets. Code propre et maintenable.',
  'Développeur',
  'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Paris',
  4.9,
  112,
  '€€€',
  11,
  true,
  true
),
(
  '40eebc99-9c0b-4ef8-bb6d-6bb9bd380a20'::uuid,
  'Julie Garcia',
  'Photographe Professionnelle',
  'Shooting photo mariage, portrait et événementiel. Style naturel et créatif. Retouches professionnelles incluses.',
  'Consultant',
  'https://images.pexels.com/photos/3756523/pexels-photo-3756523.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/1319572/pexels-photo-1319572.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Nice',
  5.0,
  143,
  '€€€',
  13,
  true,
  true
);

-- Insert services for providers
INSERT INTO provider_services (provider_id, name, description, price, duration, image_url) VALUES
-- Dr. Marie Dubois services
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Consultation dentaire', 'Examen complet avec radiographie si nécessaire', 60.00, 30, 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=400'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Détartrage', 'Nettoyage professionnel des dents', 80.00, 45, 'https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=400'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Blanchiment dentaire', 'Traitement de blanchiment professionnel', 350.00, 90, 'https://images.pexels.com/photos/6528833/pexels-photo-6528833.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Jean Martin services
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::uuid, 'Dépannage urgence', 'Intervention rapide 24/7', 90.00, 60, 'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=400'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::uuid, 'Installation sanitaire', 'Installation complète salle de bain', 450.00, 240, 'https://images.pexels.com/photos/1358912/pexels-photo-1358912.jpeg?auto=compress&cs=tinysrgb&w=400'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::uuid, 'Entretien chaudière', 'Maintenance annuelle obligatoire', 120.00, 90, 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Sophie Laurent services
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::uuid, 'Coupe femme', 'Coupe et brushing', 45.00, 60, 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::uuid, 'Coloration complète', 'Coloration avec soin', 85.00, 120, 'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=400'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::uuid, 'Balayage', 'Technique de mèches naturelles', 120.00, 180, 'https://images.pexels.com/photos/3065196/pexels-photo-3065196.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Pierre Moreau services
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::uuid, 'Dépannage électrique', 'Intervention pour panne', 75.00, 60, 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::uuid, 'Installation luminaires', 'Pose et raccordement', 120.00, 90, 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::uuid, 'Mise aux normes', 'Vérification et mise en conformité', 350.00, 180, 'https://images.pexels.com/photos/159299/graphic-design-studio-tracfone-programming-html-159299.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Dr. Thomas Bernard services
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::uuid, 'Consultation générale', 'Examen médical complet', 50.00, 30, 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::uuid, 'Téléconsultation', 'Consultation à distance', 35.00, 20, 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=400'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::uuid, 'Vaccination', 'Administration de vaccins', 40.00, 15, 'https://images.pexels.com/photos/3952241/pexels-photo-3952241.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Emma Petit services
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16'::uuid, 'Séance coaching', 'Entraînement personnalisé 1h', 65.00, 60, 'https://images.pexels.com/photos/3768593/pexels-photo-3768593.jpeg?auto=compress&cs=tinysrgb&w=400'),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16'::uuid, 'Bilan nutritionnel', 'Analyse et plan alimentaire', 90.00, 90, 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16'::uuid, 'Programme 3 mois', 'Suivi complet avec nutrition', 650.00, 60, 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Lucas Rousseau services
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a17'::uuid, 'Audit UX', 'Analyse de votre interface', 450.00, 120, 'https://images.pexels.com/photos/1181243/pexels-photo-1181243.jpeg?auto=compress&cs=tinysrgb&w=400'),
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a17'::uuid, 'Design interface', 'Création maquettes complètes', 1200.00, 480, 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400'),
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a17'::uuid, 'Prototypage', 'Prototype interactif', 800.00, 360, 'https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Camille Lefebvre services
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a18'::uuid, 'Audit SEO', 'Analyse complète de votre site', 550.00, 180, 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400'),
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a18'::uuid, 'Stratégie digitale', 'Plan marketing sur mesure', 950.00, 240, 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400'),
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a18'::uuid, 'Gestion réseaux sociaux', 'Community management mensuel', 750.00, 60, 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Alexandre Durand services
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a19'::uuid, 'Site web vitrine', 'Développement site 5 pages', 1800.00, 720, 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400'),
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a19'::uuid, 'Application mobile', 'App iOS et Android', 4500.00, 1440, 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400'),
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a19'::uuid, 'Maintenance mensuelle', 'Support et mises à jour', 250.00, 60, 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Julie Garcia services
('40eebc99-9c0b-4ef8-bb6d-6bb9bd380a20'::uuid, 'Shooting portrait', 'Séance photo 1h + retouches', 250.00, 120, 'https://images.pexels.com/photos/1319572/pexels-photo-1319572.jpeg?auto=compress&cs=tinysrgb&w=400'),
('40eebc99-9c0b-4ef8-bb6d-6bb9bd380a20'::uuid, 'Mariage complet', 'Journée complète avec album', 1500.00, 600, 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=400'),
('40eebc99-9c0b-4ef8-bb6d-6bb9bd380a20'::uuid, 'Shooting produit', '10 produits avec mise en scène', 350.00, 180, 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=400');