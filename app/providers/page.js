'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Briefcase, Star, Loader2, Users } from 'lucide-react';
import NavBar from "../../Share/components/NavBar";
import Footer from "../../Share/components/Footer";

const specialties = [
  'Tous',
  'Dentiste',
  'Médecin',
  'Plombier',
  'Électricien',
  'Coiffeur',
  'Coach',
  'Consultant',
  'Designer',
  'Développeur',
];

const locations = ['Tous', 'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Bordeaux'];

export default function ProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Tous');
  const [selectedLocation, setSelectedLocation] = useState('Tous');
  const [minNumber, setMinNumber] = useState('');
  const [experience, setExperience] = useState('');
  const [dateAvailable, setDateAvailable] = useState('');

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    filterProviders();
  }, [providers, searchTerm, selectedSpecialty, selectedLocation]);

  const loadProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error loading providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProviders = () => {
    let filtered = providers;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecialty !== 'Tous') {
      filtered = filtered.filter((p) => p.specialty === selectedSpecialty);
    }

    if (selectedLocation !== 'Tous') {
      filtered = filtered.filter((p) => p.location === selectedLocation);
    }

    setFilteredProviders(filtered);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar/>
      <div className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            Trouvez le Prestataire Idéal pour Votre Besoin
          </h1>
          <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            Découvrez des experts qualifiés prêts à répondre à vos besoins. Parcourez leurs
            profils, comparez les offres et engagez la bonne personne ou équipe pour votre projet.
          </p>

          <div className="bg-white border rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Localisation" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Nombre Minimum"
                value={minNumber}
                onChange={(e) => setMinNumber(e.target.value)}
              />

              <Input
                placeholder="Emploi Expérience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />

              <Input
                type="date"
                placeholder="Date disponible"
                value={dateAvailable}
                onChange={(e) => setDateAvailable(e.target.value)}
              />

              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Rechercher
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredProviders.length} Prestataires de Service
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : filteredProviders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun prestataire trouvé
              </h3>
              <p className="text-sm text-gray-600">
                Essayez de modifier vos critères de recherche
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProviders.map((provider) => (
              <Card key={provider.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-video w-full overflow-hidden bg-gray-100">
                  <img
                    src={provider.avatar_url || 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600'}
                    alt={provider.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl mb-1">{provider.name}</CardTitle>
                  <CardDescription className="text-lg font-semibold text-gray-900">
                    {provider.price_range}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    {renderStars(Math.round(provider.rating))}
                    <span className="text-sm text-gray-600">
                      {provider.rating.toFixed(1)} ({provider.total_reviews} avis)
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {provider.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>115 Experts</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/providers/${provider.id}`}>Voir le profil</Link>
                    </Button>
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white" asChild>
                      <Link href={`/providers/${provider.id}`}>Réserver</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Rejoignez 4 000 Prestataires Déjà Inscrits
          </h2>
          <p className="text-lg mb-8 text-white/90">
            Développez votre activité en ligne, acquérez de nouveaux clients et augmentez vos revenus. Inscrivez-vous
            gratuitement aujourd'hui et commencez à recevoir des demandes de clients potentiels.
          </p>
          <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100" asChild>
            <Link href="/register">S'inscrire en Tant que Prestataire</Link>
          </Button>
        </div>
      </section>
<Footer />
    </div>
  );
}
