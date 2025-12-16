/*
  # Insert Service Categories Demo Data

  1. Categories
    Inserts 12 service categories matching the homepage design:
    - Électricité, Plomberie, Médecine, Mécanique Auto
    - Ménage, Coaching, Santé Mentale, Immobilier
    - Bricolage, Informatique, Enseignement, Inspiration et Innovation
  
  2. Subcategories
    Adds relevant subcategories for each category with descriptions
    
  3. Notes
    - Uses IF NOT EXISTS logic to avoid duplicate insertions
    - Includes realistic French descriptions
    - Provides image URLs from Pexels
*/

DO $$
DECLARE
  cat_electricite uuid;
  cat_plomberie uuid;
  cat_medecine uuid;
  cat_mecanique uuid;
  cat_menage uuid;
  cat_coaching uuid;
  cat_sante_mentale uuid;
  cat_immobilier uuid;
  cat_bricolage uuid;
  cat_informatique uuid;
  cat_enseignement uuid;
  cat_innovation uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM service_categories WHERE slug = 'electricite') THEN
    INSERT INTO service_categories (name, slug, description, icon_name, color, image_url, display_order)
    VALUES 
      ('Électricité', 'electricite', 'Services électriques professionnels pour installations, réparations et mises aux normes de vos systèmes électriques résidentiels et commerciaux.', 'Zap', 'text-green-600', 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1200', 1),
      ('Plomberie', 'plomberie', 'Experts en plomberie pour tous vos besoins : installation, dépannage d''urgence, et entretien de vos systèmes de plomberie.', 'Wrench', 'text-green-600', 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1200', 2),
      ('Médecine', 'medecine', 'Professionnels de santé qualifiés offrant des consultations, soins et suivis médicaux adaptés à vos besoins.', 'Stethoscope', 'text-green-600', 'https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg?auto=compress&cs=tinysrgb&w=1200', 3),
      ('Mécanique Auto', 'mecanique-auto', 'Services complets de mécanique automobile : entretien, réparation et diagnostic pour tous types de véhicules.', 'Car', 'text-green-600', 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=1200', 4),
      ('Ménage', 'menage', 'Services de nettoyage professionnel pour maisons, bureaux et espaces commerciaux. Qualité et fiabilité garanties.', 'Shirt', 'text-green-600', 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=1200', 5),
      ('Coaching', 'coaching', 'Accompagnement personnalisé par des coachs professionnels pour atteindre vos objectifs personnels et professionnels.', 'Users', 'text-green-600', 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200', 6),
      ('Santé Mentale', 'sante-mentale', 'Soutien psychologique et thérapeutique par des professionnels qualifiés pour votre bien-être mental.', 'Heart', 'text-green-600', 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=1200', 7),
      ('Immobilier', 'immobilier', 'Services immobiliers complets : achat, vente, location et gestion de propriétés par des experts du marché.', 'Home', 'text-green-600', 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1200', 8),
      ('Bricolage', 'bricolage', 'Professionnels du bricolage pour tous vos travaux de rénovation, réparation et amélioration de l''habitat.', 'Hammer', 'text-green-600', 'https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=1200', 9),
      ('Informatique', 'informatique', 'Services informatiques : développement, maintenance, dépannage et conseils pour vos besoins numériques.', 'Laptop', 'text-green-600', 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1200', 10),
      ('Enseignement', 'enseignement', 'Cours particuliers et formations par des enseignants qualifiés dans diverses matières et niveaux.', 'GraduationCap', 'text-green-600', 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1200', 11),
      ('Inspiration et Innovation', 'inspiration-innovation', 'Consulting créatif et innovation pour transformer vos idées en réalité et stimuler la croissance de votre entreprise.', 'Lightbulb', 'text-green-600', 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200', 12);
  END IF;

  SELECT id INTO cat_electricite FROM service_categories WHERE slug = 'electricite';
  SELECT id INTO cat_plomberie FROM service_categories WHERE slug = 'plomberie';
  SELECT id INTO cat_medecine FROM service_categories WHERE slug = 'medecine';
  SELECT id INTO cat_mecanique FROM service_categories WHERE slug = 'mecanique-auto';
  SELECT id INTO cat_menage FROM service_categories WHERE slug = 'menage';
  SELECT id INTO cat_coaching FROM service_categories WHERE slug = 'coaching';
  SELECT id INTO cat_sante_mentale FROM service_categories WHERE slug = 'sante-mentale';
  SELECT id INTO cat_immobilier FROM service_categories WHERE slug = 'immobilier';
  SELECT id INTO cat_bricolage FROM service_categories WHERE slug = 'bricolage';
  SELECT id INTO cat_informatique FROM service_categories WHERE slug = 'informatique';
  SELECT id INTO cat_enseignement FROM service_categories WHERE slug = 'enseignement';
  SELECT id INTO cat_innovation FROM service_categories WHERE slug = 'inspiration-innovation';

  IF NOT EXISTS (SELECT 1 FROM service_subcategories WHERE category_id = cat_electricite) THEN
    INSERT INTO service_subcategories (category_id, name, slug, description, image_url, display_order)
    VALUES
      (cat_electricite, 'Installation électrique', 'installation-electrique', 'Installation complète de systèmes électriques pour nouvelles constructions et rénovations', 'https://images.pexels.com/photos/162539/architecture-building-amsterdam-blue-sky-162539.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
      (cat_electricite, 'Dépannage électrique', 'depannage-electrique', 'Intervention rapide pour pannes et problèmes électriques urgents 24/7', 'https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
      (cat_electricite, 'Mise aux normes', 'mise-aux-normes', 'Mise en conformité de vos installations électriques selon les normes en vigueur', 'https://images.pexels.com/photos/221012/pexels-photo-221012.jpeg?auto=compress&cs=tinysrgb&w=800', 3),
      (cat_electricite, 'Éclairage intelligent', 'eclairage-intelligent', 'Installation de systèmes d''éclairage connectés et domotique', 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800', 4),
      
      (cat_plomberie, 'Installation sanitaire', 'installation-sanitaire', 'Installation complète de salles de bains, cuisines et équipements sanitaires', 'https://images.pexels.com/photos/1358912/pexels-photo-1358912.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
      (cat_plomberie, 'Dépannage urgence', 'depannage-urgence', 'Intervention rapide pour fuites, canalisations bouchées et urgences plomberie', 'https://images.pexels.com/photos/4247688/pexels-photo-4247688.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
      (cat_plomberie, 'Chauffage', 'chauffage', 'Installation et entretien de systèmes de chauffage central et chaudières', 'https://images.pexels.com/photos/5137986/pexels-photo-5137986.jpeg?auto=compress&cs=tinysrgb&w=800', 3),
      (cat_plomberie, 'Débouchage', 'debouchage', 'Débouchage professionnel de canalisations et évacuations', 'https://images.pexels.com/photos/209251/pexels-photo-209251.jpeg?auto=compress&cs=tinysrgb&w=800', 4),
      
      (cat_medecine, 'Médecine générale', 'medecine-generale', 'Consultations de médecine générale pour diagnostics et soins courants', 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
      (cat_medecine, 'Pédiatrie', 'pediatrie', 'Soins médicaux spécialisés pour nourrissons, enfants et adolescents', 'https://images.pexels.com/photos/3845129/pexels-photo-3845129.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
      (cat_medecine, 'Cardiologie', 'cardiologie', 'Consultations et suivis cardiologiques par des spécialistes', 'https://images.pexels.com/photos/4021763/pexels-photo-4021763.jpeg?auto=compress&cs=tinysrgb&w=800', 3),
      (cat_medecine, 'Dermatologie', 'dermatologie', 'Soins de la peau et traitement des affections cutanées', 'https://images.pexels.com/photos/3845126/pexels-photo-3845126.jpeg?auto=compress&cs=tinysrgb&w=800', 4),
      
      (cat_mecanique, 'Entretien véhicule', 'entretien-vehicule', 'Entretien régulier : vidange, filtres, révisions complètes', 'https://images.pexels.com/photos/4489737/pexels-photo-4489737.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
      (cat_mecanique, 'Réparation moteur', 'reparation-moteur', 'Diagnostic et réparation de problèmes moteur et transmission', 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
      (cat_mecanique, 'Carrosserie', 'carrosserie', 'Réparation de carrosserie et peinture automobile', 'https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg?auto=compress&cs=tinysrgb&w=800', 3),
      (cat_mecanique, 'Pneumatiques', 'pneumatiques', 'Changement et équilibrage de pneus, géométrie', 'https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=800', 4),
      
      (cat_menage, 'Ménage résidentiel', 'menage-residentiel', 'Nettoyage complet de maisons et appartements', 'https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
      (cat_menage, 'Ménage bureaux', 'menage-bureaux', 'Nettoyage professionnel d''espaces de travail et bureaux', 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
      (cat_menage, 'Nettoyage profond', 'nettoyage-profond', 'Grand nettoyage en profondeur avec détartrage et désinfection', 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=800', 3),
      (cat_menage, 'Repassage', 'repassage', 'Service de repassage professionnel à domicile', 'https://images.pexels.com/photos/6197119/pexels-photo-6197119.jpeg?auto=compress&cs=tinysrgb&w=800', 4),
      
      (cat_coaching, 'Coaching de vie', 'coaching-vie', 'Accompagnement personnel pour atteindre vos objectifs de vie', 'https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
      (cat_coaching, 'Coaching professionnel', 'coaching-professionnel', 'Développement de carrière et coaching en leadership', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
      (cat_coaching, 'Coaching sportif', 'coaching-sportif', 'Programmes d''entraînement personnalisés et suivi sportif', 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=800', 3),
      (cat_coaching, 'Coaching nutrition', 'coaching-nutrition', 'Conseil nutritionnel et plans alimentaires personnalisés', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800', 4),
      
      (cat_sante_mentale, 'Psychologie', 'psychologie', 'Consultations psychologiques et thérapies comportementales', 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
      (cat_sante_mentale, 'Psychothérapie', 'psychotherapie', 'Thérapies individuelles et de couple par psychothérapeutes certifiés', 'https://images.pexels.com/photos/7176325/pexels-photo-7176325.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
      (cat_sante_mentale, 'Gestion du stress', 'gestion-stress', 'Techniques de relaxation et gestion du stress et de l''anxiété', 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=800', 3),
      (cat_sante_mentale, 'Méditation', 'meditation', 'Cours de méditation et pleine conscience pour le bien-être', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800', 4),
      
      (cat_immobilier, 'Achat/Vente', 'achat-vente', 'Accompagnement complet dans vos projets d''achat ou vente immobilière', 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
      (cat_immobilier, 'Location', 'location', 'Gestion locative et recherche de locataires de confiance', 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
      (cat_immobilier, 'Estimation', 'estimation', 'Estimation professionnelle de la valeur de votre bien immobilier', 'https://images.pexels.com/photos/7578847/pexels-photo-7578847.jpeg?auto=compress&cs=tinysrgb&w=800', 3),
      (cat_immobilier, 'Gestion de bien', 'gestion-bien', 'Gestion complète de propriétés locatives', 'https://images.pexels.com/photos/3184419/pexels-photo-3184419.jpeg?auto=compress&cs=tinysrgb&w=800', 4),
      
      (cat_bricolage, 'Montage meubles', 'montage-meubles', 'Montage professionnel de meubles en kit', 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
      (cat_bricolage, 'Peinture', 'peinture', 'Travaux de peinture intérieure et extérieure', 'https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
      (cat_bricolage, 'Petits travaux', 'petits-travaux', 'Réparations et petits travaux de bricolage à domicile', 'https://images.pexels.com/photos/5691607/pexels-photo-5691607.jpeg?auto=compress&cs=tinysrgb&w=800', 3),
      (cat_bricolage, 'Menuiserie', 'menuiserie', 'Travaux de menuiserie sur mesure et aménagements', 'https://images.pexels.com/photos/5974401/pexels-photo-5974401.jpeg?auto=compress&cs=tinysrgb&w=800', 4),
      
      (cat_informatique, 'Développement web', 'developpement-web', 'Création de sites web et applications sur mesure', 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
      (cat_informatique, 'Dépannage PC', 'depannage-pc', 'Réparation et maintenance d''ordinateurs et périphériques', 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
      (cat_informatique, 'Cybersécurité', 'cybersecurite', 'Protection et sécurisation de vos systèmes informatiques', 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800', 3),
      (cat_informatique, 'Cloud & Infrastructure', 'cloud-infrastructure', 'Migration cloud et gestion d''infrastructure IT', 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800', 4),
      
      (cat_enseignement, 'Mathématiques', 'mathematiques', 'Cours particuliers de mathématiques tous niveaux', 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
      (cat_enseignement, 'Langues', 'langues', 'Cours de langues étrangères par professeurs natifs', 'https://images.pexels.com/photos/5212320/pexels-photo-5212320.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
      (cat_enseignement, 'Musique', 'musique', 'Cours de musique et formation instrumentale', 'https://images.pexels.com/photos/7520697/pexels-photo-7520697.jpeg?auto=compress&cs=tinysrgb&w=800', 3),
      (cat_enseignement, 'Soutien scolaire', 'soutien-scolaire', 'Aide aux devoirs et soutien scolaire personnalisé', 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800', 4),
      
      (cat_innovation, 'Conseil stratégique', 'conseil-strategique', 'Consulting en stratégie d''entreprise et innovation', 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
      (cat_innovation, 'Design thinking', 'design-thinking', 'Ateliers de créativité et méthodologies d''innovation', 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
      (cat_innovation, 'Transformation digitale', 'transformation-digitale', 'Accompagnement dans la digitalisation de votre entreprise', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800', 3),
      (cat_innovation, 'Innovation produit', 'innovation-produit', 'Développement de nouveaux produits et services innovants', 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=800', 4);
  END IF;

END $$;
