'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Briefcase,
  ArrowLeft,
  Loader2,
  Zap,
  Wrench,
  Stethoscope,
  Car,
  Shirt,
  Users,
  Heart,
  Home as HomeIcon,
  Hammer,
  Laptop,
  GraduationCap,
  Lightbulb,
} from 'lucide-react';

const iconMap = {
  Zap,
  Wrench,
  Stethoscope,
  Car,
  Shirt,
  Users,
  Heart,
  Home: HomeIcon,
  Hammer,
  Laptop,
  GraduationCap,
  Lightbulb,
  Briefcase,
};

export default function ServiceCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryData();
  }, [params.slug]);

  const loadCategoryData = async () => {
    try {
      const { data: categoryData, error: categoryError } = await supabase
        .from('service_categories')
        .select('*')
        .eq('slug', params.slug)
        .maybeSingle();

      if (categoryError) throw categoryError;

      if (!categoryData) {
        router.push('/');
        return;
      }

      setCategory(categoryData);

      const { data: subcategoriesData, error: subcategoriesError } = await supabase
        .from('service_subcategories')
        .select('*')
        .eq('category_id', categoryData.id)
        .order('display_order', { ascending: true });

      if (subcategoriesError) throw subcategoriesError;

      setSubcategories(subcategoriesData || []);
    } catch (error) {
      console.error('Error loading category:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!category) {
    return null;
  }

  const IconComponent = iconMap[category.icon_name] || Briefcase;

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-gray-900">KilakaPlatform</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50" asChild>
                <Link href="/login">Connexion</Link>
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white" asChild>
                <Link href="/register">Inscription</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-green-50 to-emerald-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="mb-6 text-gray-700 hover:text-green-600"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <IconComponent className={`h-12 w-12 ${category.color}`} />
                </div>
                <div>
                  <Badge className="bg-green-600 text-white mb-2">Service professionnel</Badge>
                  <h1 className="text-4xl font-bold text-gray-900">{category.name}</h1>
                </div>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">{category.description}</p>
              <div className="flex gap-4">
                <Button className="bg-green-600 hover:bg-green-700 text-white" asChild>
                  <Link href="/providers">Trouver un professionnel</Link>
                </Button>
                <Button variant="outline" className="border-gray-300" asChild>
                  <Link href="/become-provider">Devenir prestataire</Link>
                </Button>
              </div>
            </div>
            <div>
              {category.image_url && (
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-96 object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos Services en {category.name}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez tous les services spécialisés disponibles dans cette catégorie
            </p>
          </div>

          {subcategories.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {subcategories.map((subcategory) => (
                <Card
                  key={subcategory.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <CardContent className="p-0">
                    {subcategory.image_url && (
                      <div className="relative overflow-hidden">
                        <img
                          src={subcategory.image_url}
                          alt={subcategory.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">
                          {subcategory.name}
                        </h3>
                      </div>
                    )}
                    <div className="p-6">
                      {!subcategory.image_url && (
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {subcategory.name}
                        </h3>
                      )}
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {subcategory.description}
                      </p>
                      <Button
                        variant="outline"
                        className="w-full border-green-600 text-green-600 hover:bg-green-50"
                        asChild
                      >
                        <Link href="/providers">Voir les professionnels</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun service disponible pour le moment</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Besoin d'un professionnel en {category.name}?
          </h2>
          <p className="text-lg mb-8 text-white/90">
            Inscrivez-vous dès maintenant et trouvez le prestataire idéal pour votre projet
          </p>
          <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100" asChild>
            <Link href="/register">Commencer maintenant</Link>
          </Button>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="h-6 w-6 text-green-600" />
                <span className="text-xl font-bold">KilakaPlatform</span>
              </div>
              <p className="text-gray-400 text-sm">
                © 2024 Kilaka Platform. All rights reserved
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Kilaka</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/#about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
