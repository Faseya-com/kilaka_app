'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CreateServicePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    clientName: '',
    clientEmail: '',
    budget: '',
    deadline: '',
    files: '',
    additionalInfo: '',
  });

  const categories = [
    { id: 'web', name: 'Développement Web', emoji: '💻' },
    { id: 'mobile', name: 'Développement Mobile', emoji: '📱' },
    { id: 'design', name: 'Design UI/UX', emoji: '🎨' },
    { id: 'marketing', name: 'Marketing Digital', emoji: '📈' },
    { id: 'redaction', name: 'Rédaction de contenu', emoji: '✍️' },
    { id: 'video', name: 'Montage vidéo', emoji: '🎬' },
  ];

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep === 1 && !formData.category) {
      toast({
        title: 'Sélection requise',
        description: 'Veuillez sélectionner une catégorie',
        variant: 'destructive',
      });
      return;
    }

    if (currentStep === 2 && (!formData.title || !formData.description)) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez remplir le titre et la description',
        variant: 'destructive',
      });
      return;
    }

    if (currentStep === 3 && (!formData.clientName || !formData.clientEmail)) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez remplir les informations du client',
        variant: 'destructive',
      });
      return;
    }

    if (currentStep === 4 && !formData.budget) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez indiquer votre budget',
        variant: 'destructive',
      });
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const selectedCategory = categories.find(c => c.id === formData.category);

      const serviceData = {
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        category: selectedCategory?.name || formData.category,
        status: 'draft',
        price: formData.budget ? parseFloat(formData.budget) : null,
      };

      const { error } = await supabase
        .from('services')
        .insert([serviceData]);

      if (error) throw error;

      toast({
        title: 'Demande envoyée',
        description: 'Votre demande de service a été créée avec succès',
      });

      router.push('/dashboard/services');
    } catch (error) {
      console.error('Error creating service:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Décrivez votre service en quelques étapes
              </h2>
              <p className="text-lg text-gray-600">
                Catégorie
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFormData({ ...formData, category: category.id })}
                  className={`relative p-8 rounded-2xl border-2 transition-all hover:shadow-lg ${
                    formData.category === category.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-5xl mb-4">{category.emoji}</div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  {formData.category === category.id && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Décrivez votre service en quelques étapes
              </h2>
              <p className="text-lg text-gray-600">
                Détails
              </p>
            </div>

            <Card className="border-2">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-semibold">
                    Titre du service *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Création d'un site web e-commerce"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-semibold">
                    Description détaillée *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Décrivez en détail votre besoin, vos attentes, les fonctionnalités souhaitées..."
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-sm text-gray-500">
                    Soyez le plus précis possible pour obtenir les meilleurs résultats
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Décrivez votre service en quelques étapes
              </h2>
              <p className="text-lg text-gray-600">
                Cible & Lieu
              </p>
            </div>

            <Card className="border-2">
              <CardContent className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="clientName" className="text-base font-semibold">
                      Nom du client ou entreprise *
                    </Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      placeholder="Ex: Jean Dupont"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientEmail" className="text-base font-semibold">
                      Email de contact *
                    </Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      placeholder="contact@exemple.com"
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-base font-semibold">
                    Localisation du service
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: Paris, France ou À distance"
                    className="h-12"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Définissez votre budget
              </h2>
              <p className="text-lg text-gray-600">
                Informations sur le budget
              </p>
            </div>

            <Card className="border-2">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-base font-semibold">
                    Budget estimé (€) *
                  </Label>
                  <div className="relative">
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="1000"
                      className="h-12 pr-12"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      €
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-base font-semibold">
                    Date limite souhaitée
                  </Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="files" className="text-base font-semibold">
                    Fichiers joints (URLs)
                  </Label>
                  <Input
                    id="files"
                    value={formData.files}
                    onChange={(e) => setFormData({ ...formData, files: e.target.value })}
                    placeholder="https://exemple.com/fichier.pdf"
                    className="h-12"
                  />
                  <p className="text-sm text-gray-500">
                    Ajoutez des liens vers vos documents, maquettes, ou références
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo" className="text-base font-semibold">
                    Informations complémentaires
                  </Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                    placeholder="Toute autre information utile pour le prestataire..."
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        const selectedCategory = categories.find(c => c.id === formData.category);

        return (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Votre demande est prête
              </h2>
              <p className="text-lg text-gray-600">
                Vérifiez les informations avant d'envoyer
              </p>
            </div>

            <Card className="border-2">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="pb-6 border-b">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                      Catégorie de service
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{selectedCategory?.emoji}</span>
                      <span className="text-xl font-semibold">{selectedCategory?.name}</span>
                    </div>
                  </div>

                  <div className="pb-6 border-b">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                      Détails du service
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Titre</p>
                        <p className="text-lg font-medium text-gray-900">{formData.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Description</p>
                        <p className="text-gray-900">{formData.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pb-6 border-b">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                      Informations client
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Nom</p>
                        <p className="text-gray-900 font-medium">{formData.clientName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-gray-900 font-medium">{formData.clientEmail}</p>
                      </div>
                    </div>
                    {formData.location && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">Localisation</p>
                        <p className="text-gray-900 font-medium">{formData.location}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                      Budget et délais
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Budget</p>
                        <p className="text-2xl font-bold text-green-600">{formData.budget} €</p>
                      </div>
                      {formData.deadline && (
                        <div>
                          <p className="text-sm text-gray-600">Date limite</p>
                          <p className="text-gray-900 font-medium">
                            {new Date(formData.deadline).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Après validation, votre demande sera visible par les prestataires qualifiés qui pourront vous proposer leurs services.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 -m-6 p-6">
          <div className="max-w-7xl mx-auto py-8">
            <div className="mb-8">
              <div className="flex items-center justify-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        step < currentStep
                          ? 'bg-green-500 text-white'
                          : step === currentStep
                          ? 'bg-green-500 text-white ring-4 ring-green-100'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {step < currentStep ? <CheckCircle2 className="h-5 w-5" /> : step}
                    </div>
                    {step < 5 && (
                      <div
                        className={`w-12 h-1 mx-1 ${
                          step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Étape {currentStep} sur {totalSteps}
                </p>
              </div>
            </div>

            <div className="mb-8">
              {renderStepContent()}
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1 || submitting}
                size="lg"
                className="min-w-[140px]"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Précédent
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="min-w-[140px] bg-green-600 hover:bg-green-700"
                >
                  Suivant
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  size="lg"
                  className="min-w-[180px] bg-green-600 hover:bg-green-700"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer ma demande'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
