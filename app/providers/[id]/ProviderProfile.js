'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Star,
  MapPin,
  Briefcase,
  Loader2,
  Award,
  Calendar,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

export default function ProviderProfile({ params }) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [appointmentNotes, setAppointmentNotes] = useState('');

  useEffect(() => {
    if (params.id) {
      loadProviderData();
    }
  }, [params.id]);

  const loadProviderData = async () => {
    try {
      const [providerRes, servicesRes, reviewsRes] = await Promise.all([
        supabase.from('providers').select('*').eq('id', params.id).maybeSingle(),
        supabase
          .from('provider_services')
          .select('*')
          .eq('provider_id', params.id)
          .order('created_at'),
        supabase
          .from('reviews')
          .select('*, profiles(full_name, avatar_url)')
          .eq('provider_id', params.id)
          .order('created_at', { ascending: false }),
      ]);

      if (providerRes.error) throw providerRes.error;

      setProvider(providerRes.data);
      setServices(servicesRes.data || []);
      setReviews(reviewsRes.data || []);
    } catch (error) {
      console.error('Error loading provider:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger le profil',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Connexion requise',
        description: 'Vous devez être connecté pour laisser un avis',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert([
        {
          provider_id: params.id,
          user_id: user.id,
          rating: reviewRating,
          comment: reviewComment,
        },
      ]);

      if (error) throw error;

      toast({
        title: 'Avis publié',
        description: 'Merci pour votre avis!',
      });

      setIsReviewDialogOpen(false);
      setReviewComment('');
      setReviewRating(5);
      loadProviderData();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de publier votre avis',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!user) {
      toast({
        title: 'Connexion requise',
        description: 'Vous devez être connecté pour prendre rendez-vous',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast({
        title: 'Sélection incomplète',
        description: 'Veuillez sélectionner une date et une heure',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const [hours, minutes] = selectedTime.split(':');
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const { error } = await supabase.from('appointments').insert([
        {
          provider_id: params.id,
          user_id: user.id,
          service_id: selectedService || null,
          appointment_date: appointmentDate.toISOString(),
          status: 'pending',
          notes: appointmentNotes,
        },
      ]);

      if (error) throw error;

      toast({
        title: 'Rendez-vous demandé',
        description: 'Votre demande de rendez-vous a été envoyée',
      });

      setIsAppointmentDialogOpen(false);
      setSelectedDate(null);
      setSelectedTime('');
      setSelectedService('');
      setAppointmentNotes('');
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de réserver le rendez-vous',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              interactive ? 'cursor-pointer' : ''
            } ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
            onClick={() => interactive && onChange && onChange(star)}
          />
        ))}
      </div>
    );
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const calculatePercentage = (count) => {
    if (reviews.length === 0) return 0;
    return Math.round((count / reviews.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Prestataire introuvable</h2>
          <Button asChild>
            <Link href="/providers">Retour à la liste</Link>
          </Button>
        </div>
      </div>
    );
  }

  const distribution = getRatingDistribution();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-gray-900">KilakaPlatform</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-green-600 font-medium">
                Home
              </Link>
              <Link href="#services" className="text-gray-700 hover:text-green-600 font-medium">
                Services
              </Link>
              <Link href="/providers" className="text-gray-700 hover:text-green-600 font-medium">
                Providers
              </Link>
              <Link href="#about" className="text-gray-700 hover:text-green-600 font-medium">
                About Us
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white" asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative h-64 bg-gray-100">
        <img
          src={provider.cover_image_url || 'https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg?auto=compress&cs=tinysrgb&w=1200'}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-12">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage src={provider.avatar_url} alt={provider.name} />
                <AvatarFallback className="bg-green-600 text-white text-3xl">
                  {provider.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">{provider.name}</h1>
                      {provider.is_verified && (
                        <Award className="h-6 w-6 text-green-600" title="Vérifié" />
                      )}
                    </div>
                    <p className="text-lg text-gray-600 mb-2">{provider.title}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        {renderStars(Math.round(provider.rating))}
                        <span className="font-medium">
                          {provider.rating.toFixed(1)} ({provider.total_reviews} avis)
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setIsAppointmentDialogOpen(true)}>
                    Prendre un Rendez-vous
                  </Button>
                </div>

                <p className="text-gray-700 mb-4">{provider.description}</p>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{provider.location}</span>
                  </div>
                  <div className="text-gray-400">•</div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      {provider.experience_years} ans d'expérience
                    </span>
                  </div>
                  <div className="text-gray-400">•</div>
                  <span className="text-green-600 font-semibold">{provider.price_range}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Services Offerts</CardTitle>
                <CardDescription>Découvrez les services proposés</CardDescription>
              </CardHeader>
              <CardContent>
                {services.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Aucun service disponible</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {services.map((service) => (
                      <Card key={service.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          {service.image_url && (
                            <img
                              src={service.image_url}
                              alt={service.name}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                          )}
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {service.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-green-600">
                              {service.price} €
                            </span>
                            <span className="text-sm text-gray-500">
                              {service.duration} min
                            </span>
                          </div>
                          <Button
                            className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white"
                            size="sm"
                            onClick={() => {
                              setSelectedService(service.id);
                              setIsAppointmentDialogOpen(true);
                            }}
                          >
                            Réserver Maintenant
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Avis des Clients</CardTitle>
                    <CardDescription>
                      {reviews.length} avis au total
                    </CardDescription>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setIsReviewDialogOpen(true)}>
                    Laisser un avis
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Aucun avis pour le moment. Soyez le premier!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src={review.profiles?.avatar_url} />
                            <AvatarFallback className="bg-green-600 text-white">
                              {review.profiles?.full_name?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium">
                                {review.profiles?.full_name || 'Utilisateur'}
                              </p>
                              {renderStars(review.rating)}
                            </div>
                            <p className="text-sm text-gray-600">{review.comment}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(review.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Satisfaction des Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    {provider.rating.toFixed(1)}
                  </div>
                  <div className="flex justify-center mb-2">
                    {renderStars(Math.round(provider.rating))}
                  </div>
                  <p className="text-sm text-gray-600">{provider.total_reviews} avis</p>
                </div>

                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm w-4">{rating}</span>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{
                            width: `${calculatePercentage(distribution[rating])}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {calculatePercentage(distribution[rating])}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Prendre Rendez-vous
                </CardTitle>
                <CardDescription>Sélectionnez une date et heure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  className="rounded-md border w-full"
                />

                {selectedDate && (
                  <div className="space-y-4 animate-in fade-in-50 duration-300">
                    {services.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Service</label>
                        <Select value={selectedService} onValueChange={setSelectedService}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Consultation générale</SelectItem>
                            {services.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name} - {service.price}€
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Heure</label>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                            className={selectedTime === time ? "bg-green-600 hover:bg-green-700" : ""}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {selectedTime && (
                      <div className="space-y-4 animate-in fade-in-50 duration-300">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Notes (optionnel)</label>
                          <Textarea
                            value={appointmentNotes}
                            onChange={(e) => setAppointmentNotes(e.target.value)}
                            rows={2}
                            placeholder="Informations supplémentaires..."
                          />
                        </div>

                        <Button
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          size="lg"
                          onClick={handleBookAppointment}
                          disabled={submitting}
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Réservation...
                            </>
                          ) : (
                            <>
                              <Calendar className="mr-2 h-4 w-4" />
                              Confirmer le Rendez-vous
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {!selectedDate && (
                  <p className="text-sm text-gray-500 text-center">
                    Sélectionnez une date pour voir les créneaux disponibles
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmitReview}>
            <DialogHeader>
              <DialogTitle>Laisser un avis</DialogTitle>
              <DialogDescription>
                Partagez votre expérience avec {provider.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Note</label>
                {renderStars(reviewRating, true, setReviewRating)}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Commentaire</label>
                <Textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                  placeholder="Décrivez votre expérience..."
                  disabled={submitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsReviewDialogOpen(false)}
                disabled={submitting}
              >
                Annuler
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publication...
                  </>
                ) : (
                  'Publier'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isAppointmentDialogOpen} onOpenChange={setIsAppointmentDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Planifier un Rendez-vous</DialogTitle>
            <DialogDescription>
              Choisissez une date et heure pour votre rendez-vous
            </DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Sélectionner une date</label>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                className="rounded-md border"
              />
            </div>
            <div className="space-y-4">
              {services.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Service (optionnel)</label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucun service spécifique</SelectItem>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - {service.price}€
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Heure</label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une heure" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (optionnel)</label>
                <Textarea
                  value={appointmentNotes}
                  onChange={(e) => setAppointmentNotes(e.target.value)}
                  rows={3}
                  placeholder="Des informations supplémentaires..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAppointmentDialogOpen(false)}
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleBookAppointment} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Réservation...
                </>
              ) : (
                'Confirmer le rendez-vous'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
