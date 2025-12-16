'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  Upload,
  Camera,
  Plus,
  X,
  Phone,
  CreditCard,
  FileText,
  Home,
  CheckCircle2,
  Facebook,
  Twitter,
  Linkedin,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';

export default function ProviderOnboardingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [onboardingId, setOnboardingId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    photoUrl: '',
    selectedCategories: [],
    customSkills: [],
    yearsExperience: '',
    certifications: [],
    portfolio: [],
    mobilePayment: {
      number: '',
      provider: '',
    },
    bankAccount: '',
    paypalEmail: '',
    paymentMethod: '',
    kycDocuments: {
      idPassport: null,
      proofAddress: null,
      backgroundCheck: null,
    },
  });

  const totalSteps = 7;
  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  useEffect(() => {
    loadCategories();
    loadOrCreateOnboarding();
  }, []);

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('display_order');

    if (!error && data) {
      setCategories(data);
    }
  };

  const loadOrCreateOnboarding = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('provider_onboarding')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setOnboardingId(data.id);
      setCurrentStep(data.current_step || 1);
      setFormData((prev) => ({
        ...prev,
        fullName: data.full_name || '',
        phone: data.phone || '',
        address: data.address || '',
        yearsExperience: data.years_experience || '',
      }));
    } else {
      const { data: newData, error: insertError } = await supabase
        .from('provider_onboarding')
        .insert([{ user_id: user.id, current_step: 1 }])
        .select()
        .single();

      if (newData) {
        setOnboardingId(newData.id);
      }
    }
  };

  const saveProgress = async (step, completed = false) => {
    if (!onboardingId) return;

    const updates = {
      current_step: step,
      updated_at: new Date().toISOString(),
    };

    if (step === 1) {
      updates.full_name = formData.fullName;
      updates.phone = formData.phone;
      updates.address = formData.address;
      updates.personal_info_completed = completed;
    } else if (step === 2) {
      updates.skills_completed = completed;
    } else if (step === 3) {
      updates.years_experience = formData.yearsExperience;
      updates.experience_completed = completed;
    } else if (step === 4) {
      updates.availability_completed = completed;
    } else if (step === 5) {
      updates.payment_completed = completed;
    } else if (step === 6) {
      updates.kyc_completed = completed;
    }

    await supabase
      .from('provider_onboarding')
      .update(updates)
      .eq('id', onboardingId);
  };

  const handleNext = async () => {
    if (currentStep === 1 && (!formData.fullName || !formData.email || !formData.phone || !formData.address)) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive',
      });
      return;
    }

    await saveProgress(currentStep + 1, true);
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await supabase
        .from('provider_onboarding')
        .update({
          status: 'submitted',
          updated_at: new Date().toISOString(),
        })
        .eq('id', onboardingId);

      toast({
        title: 'Demande envoyée',
        description: 'Votre demande pour devenir prestataire a été soumise avec succès',
      });

      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la soumission',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter((id) => id !== categoryId)
        : [...prev.selectedCategories, categoryId],
    }));
  };

  const addCustomSkill = () => {
    setFormData((prev) => ({
      ...prev,
      customSkills: [...prev.customSkills, { name: '', hourlyRate: '', dailyRate: '' }],
    }));
  };

  const updateCustomSkill = (index, field, value) => {
    setFormData((prev) => {
      const newSkills = [...prev.customSkills];
      newSkills[index][field] = value;
      return { ...prev, customSkills: newSkills };
    });
  };

  const removeCustomSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      customSkills: prev.customSkills.filter((_, i) => i !== index),
    }));
  };

  const renderStep1 = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">Informations personnelles</h2>
      <p className="text-gray-600 mb-8">
        Veuillez fournir vos coordonnées de base pour commencer votre profil de fournisseur.
      </p>

      <Card className="p-8 mb-8">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {formData.photoUrl ? (
                <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Camera className="h-12 w-12 text-gray-400" />
              )}
            </div>
          </div>
          <Button variant="outline" className="border-green-600 text-green-600">
            <Upload className="mr-2 h-4 w-4" />
            Télécharger une photo
          </Button>
          <p className="text-sm text-gray-500 mt-2">Une photo professionnelle aide à établir la confiance.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Entrez votre nom complet"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Entrez votre adresse e-mail"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Entrez votre numéro de téléphone"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Entrez votre adresse résidentielle"
              className="h-12"
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">Compétences et Services</h2>
      <p className="text-gray-600 mb-8">
        Sélectionnez les catégories de services que vous offrez et listez vos compétences spécifiques avec vos tarifs.
      </p>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Catégories de Services</h3>
        <p className="text-gray-600 mb-6">
          Cochez toutes les catégories de services que vous êtes en mesure de fournir.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                formData.selectedCategories.includes(category.id)
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={formData.selectedCategories.includes(category.id)}
                  onCheckedChange={() => toggleCategory(category.id)}
                />
                <span className="font-medium text-gray-900">{category.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Compétences Spécifiques et Tarifs</h3>
        <p className="text-gray-600 mb-6">
          Ajoutez vos compétences individuelles et définissez vos tarifs horaires ou journaliers.
        </p>

        <div className="space-y-4 mb-4">
          {formData.customSkills.map((skill, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 grid md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Nom de la compétence"
                    value={skill.name}
                    onChange={(e) => updateCustomSkill(index, 'name', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Tarif horaire (€)"
                    value={skill.hourlyRate}
                    onChange={(e) => updateCustomSkill(index, 'hourlyRate', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Tarif journalier (€)"
                    value={skill.dailyRate}
                    onChange={(e) => updateCustomSkill(index, 'dailyRate', e.target.value)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCustomSkill(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={addCustomSkill}
          className="w-full border-2 border-dashed border-gray-300 hover:border-green-600 hover:bg-green-50"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une compétence
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">Expérience & Certifications</h2>

      <div className="space-y-8">
        <div>
          <Label htmlFor="yearsExperience" className="text-lg font-semibold mb-3 block">
            Années d'Expérience
          </Label>
          <Input
            id="yearsExperience"
            type="number"
            min="0"
            value={formData.yearsExperience}
            onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
            placeholder="Ex: 5"
            className="h-12 max-w-xs"
          />
          <p className="text-sm text-gray-500 mt-2">
            Indiquez le nombre d'années d'expérience professionnelle dans votre domaine.
          </p>
        </div>

        <Card className="p-8 bg-gray-50">
          <div className="text-center mb-6">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Télécharger vos Certifications</h3>
            <p className="text-gray-600 mb-1">
              Ajoutez les documents prouvant vos qualifications ou diplômes.
            </p>
            <p className="text-sm text-gray-500">Formats acceptés : PDF, JPG, PNG</p>
          </div>
          <Button className="w-full bg-green-600 hover:bg-green-700">
            Télécharger des documents
          </Button>
        </Card>

        <Card className="p-8 bg-gray-50">
          <div className="text-center mb-6">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ajouter des Images de Portfolio</h3>
            <p className="text-gray-600 mb-1">
              Montrez vos réalisations avec des images. Ex: Projets terminés.
            </p>
            <p className="text-sm text-gray-500">Formats acceptés : JPG, PNG</p>
          </div>
          <Button className="w-full bg-green-600 hover:bg-green-700">
            Télécharger des images
          </Button>
        </Card>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">Disponibilité</h2>
      <p className="text-gray-600 mb-8">
        Indiquez vos horaires de disponibilité pour que les clients sachent quand vous contacter.
      </p>

      <Card className="p-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Fonctionnalité de calendrier de disponibilité à venir
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Pour l'instant, vous pouvez passer à l'étape suivante
          </p>
        </div>
      </Card>
    </div>
  );

  const renderStep5 = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">Informations de paiement</h2>
      <p className="text-gray-600 mb-8">
        Veuillez choisir et fournir les détails de votre méthode de paiement préférée.
      </p>

      <div className="space-y-6">
        <div
          className={`border-2 rounded-lg transition-all cursor-pointer ${
            formData.paymentMethod === 'mobile' ? 'border-green-600 bg-green-50' : 'border-gray-200'
          }`}
        >
          <div
            className="p-4 flex items-center justify-between"
            onClick={() => setFormData({ ...formData, paymentMethod: 'mobile' })}
          >
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-gray-900">Paiement Mobile</span>
            </div>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                formData.paymentMethod === 'mobile' ? 'rotate-180' : ''
              }`}
            />
          </div>

          {formData.paymentMethod === 'mobile' && (
            <div className="p-6 border-t space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Entrez les détails de votre compte de paiement mobile.
              </p>
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Numéro de téléphone mobile</Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  value={formData.mobilePayment.number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mobilePayment: { ...formData.mobilePayment, number: e.target.value },
                    })
                  }
                  placeholder="Ex: 07XXXXXXXXX"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileProvider">Fournisseur de service mobile</Label>
                <Select
                  value={formData.mobilePayment.provider}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      mobilePayment: { ...formData.mobilePayment, provider: value },
                    })
                  }
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sélectionnez un fournisseur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="orange">Orange Money</SelectItem>
                    <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                    <SelectItem value="moov">Moov Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <div
          className={`border-2 rounded-lg transition-all cursor-pointer ${
            formData.paymentMethod === 'bank' ? 'border-green-600 bg-green-50' : 'border-gray-200'
          }`}
        >
          <div
            className="p-4 flex items-center justify-between"
            onClick={() => setFormData({ ...formData, paymentMethod: 'bank' })}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-gray-900">Compte Bancaire</span>
            </div>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                formData.paymentMethod === 'bank' ? 'rotate-180' : ''
              }`}
            />
          </div>

          {formData.paymentMethod === 'bank' && (
            <div className="p-6 border-t space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Entrez vos informations bancaires pour les virements.
              </p>
              <div className="space-y-2">
                <Label htmlFor="bankAccount">Numéro de compte bancaire / IBAN</Label>
                <Input
                  id="bankAccount"
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                  placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                  className="h-12"
                />
              </div>
            </div>
          )}
        </div>

        <div
          className={`border-2 rounded-lg transition-all cursor-pointer ${
            formData.paymentMethod === 'paypal' ? 'border-green-600 bg-green-50' : 'border-gray-200'
          }`}
        >
          <div
            className="p-4 flex items-center justify-between"
            onClick={() => setFormData({ ...formData, paymentMethod: 'paypal' })}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-gray-900">PayPal</span>
            </div>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                formData.paymentMethod === 'paypal' ? 'rotate-180' : ''
              }`}
            />
          </div>

          {formData.paymentMethod === 'paypal' && (
            <div className="p-6 border-t space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Entrez votre adresse email PayPal.
              </p>
              <div className="space-y-2">
                <Label htmlFor="paypalEmail">Adresse email PayPal</Label>
                <Input
                  id="paypalEmail"
                  type="email"
                  value={formData.paypalEmail}
                  onChange={(e) => setFormData({ ...formData, paypalEmail: e.target.value })}
                  placeholder="votre@email.com"
                  className="h-12"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">Vérification d'identité (KYC)</h2>
      <p className="text-gray-600 mb-8">
        Veuillez télécharger les documents requis pour vérifier votre identité et votre adresse.
      </p>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Pièce d'identité ou Passeport
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Téléchargez une copie claire de votre carte d'identité ou de votre passeport.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-2">Glissez et déposez votre fichier ici, ou</p>
                <Button variant="outline" className="border-green-600 text-green-600">
                  Sélectionner un fichier
                </Button>
                <p className="text-xs text-gray-500 mt-3">
                  Formats pris en charge : PDF, JPG, PNG (max 5 Mo)
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Home className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Justificatif de Domicile
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Facture de services publics récente ou relevé bancaire avec votre adresse.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-2">Glissez et déposez votre fichier ici, ou</p>
                <Button variant="outline" className="border-green-600 text-green-600">
                  Sélectionner un fichier
                </Button>
                <p className="text-xs text-gray-500 mt-3">
                  Formats pris en charge : PDF, JPG, PNG (max 5 Mo)
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Documents de Vérification des Antécédents
                <span className="text-sm font-normal text-gray-500 ml-2">(facultatif)</span>
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Tout document supplémentaire pertinent pour la vérification des antécédents.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-2">Glissez et déposez votre fichier ici, ou</p>
                <Button variant="outline" className="border-green-600 text-green-600">
                  Sélectionner un fichier
                </Button>
                <p className="text-xs text-gray-500 mt-3">
                  Formats pris en charge : PDF, JPG, PNG (max 5 Mo)
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Révision et Soumission</h2>
        <p className="text-gray-600">
          Vérifiez toutes vos informations avant de soumettre votre candidature
        </p>
      </div>

      <Card className="p-8 mb-6">
        <div className="space-y-6">
          <div className="pb-6 border-b">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
              Informations Personnelles
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nom complet</p>
                <p className="font-medium text-gray-900">{formData.fullName || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{formData.email || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Téléphone</p>
                <p className="font-medium text-gray-900">{formData.phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Adresse</p>
                <p className="font-medium text-gray-900">{formData.address || '-'}</p>
              </div>
            </div>
          </div>

          <div className="pb-6 border-b">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
              Services et Compétences
            </h3>
            <div>
              <p className="text-sm text-gray-600 mb-2">Catégories sélectionnées</p>
              <p className="font-medium text-gray-900">
                {formData.selectedCategories.length} catégories sélectionnées
              </p>
            </div>
          </div>

          <div className="pb-6 border-b">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
              Expérience
            </h3>
            <div>
              <p className="text-sm text-gray-600">Années d'expérience</p>
              <p className="font-medium text-gray-900">
                {formData.yearsExperience ? `${formData.yearsExperience} ans` : '-'}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
              Paiement
            </h3>
            <div>
              <p className="text-sm text-gray-600">Méthode de paiement</p>
              <p className="font-medium text-gray-900 capitalize">
                {formData.paymentMethod || 'Non spécifié'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="p-6 bg-blue-50 rounded-lg border border-blue-200 mb-6">
        <p className="text-sm text-blue-900">
          <strong>Note importante:</strong> Votre profil sera examiné par notre équipe avant d'être publié.
          Vous recevrez une notification par email une fois votre demande approuvée.
          Ce processus peut prendre entre 24 et 48 heures.
        </p>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      case 7:
        return renderStep7();
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    const titles = [
      'Informations personnelles',
      'Compétences & Services',
      'Expérience et Certifications',
      'Disponibilité',
      'Informations de paiement',
      'Vérification (KYC)',
      'Révision et Soumission',
    ];
    return titles[currentStep - 1];
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-12">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">
                  Progression : Étape {currentStep} sur {totalSteps}
                </p>
                <p className="text-sm font-medium text-gray-600">{progressPercentage}% terminé</p>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900">{getStepTitle()}</h1>
          </div>

          <div className="mb-12">{renderStepContent()}</div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
              className="min-w-[120px]"
            >
              Retour
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={loading}
                className="min-w-[200px] bg-green-600 hover:bg-green-700"
              >
                {`Suivant : ${getStepTitle()}`}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="min-w-[200px] bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Soumission en cours...
                  </>
                ) : (
                  'Suivant : Réviser et Soumettre'
                )}
              </Button>
            )}
          </div>
        </div>

        <footer className="border-t mt-20 py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex gap-6 text-sm">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Ressources
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Légal
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Nous Contacter
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
