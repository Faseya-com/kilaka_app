'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Loader2,
  User,
  Mail,
  CreditCard,
  Bell,
  Shield,
  History,
  Smartphone,
  Building2,
  Plus,
  Trash2,
  MapPin,
  Monitor,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    avatar_url: profile?.avatar_url || '',
  });

  const [notifications, setNotifications] = useState({
    job_offers_email: true,
    job_offers_push: true,
    job_offers_sms: false,
    payment_email: true,
    payment_push: true,
    invoices_email: true,
    system_email: true,
    system_push: false,
    system_sms: false,
  });

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [securitySettings, setSecuritySettings] = useState({
    two_factor_enabled: false,
    two_factor_method: null,
  });

  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: '',
    mobile_number: '',
    mobile_provider: '',
    bank_account: '',
    bank_name: '',
    paypal_email: '',
  });

  useEffect(() => {
    loadUserSettings();
  }, [user]);

  const loadUserSettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [notifRes, paymentRes, historyRes, securityRes] = await Promise.all([
        supabase
          .from('user_notification_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('user_payment_methods')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('user_login_history')
          .select('*')
          .eq('user_id', user.id)
          .order('login_at', { ascending: false })
          .limit(10),
        supabase
          .from('user_security_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
      ]);

      if (notifRes.data) {
        setNotifications(notifRes.data);
      }
      if (paymentRes.data) {
        setPaymentMethods(paymentRes.data);
      }
      if (historyRes.data) {
        setLoginHistory(historyRes.data);
      }
      if (securityRes.data) {
        setSecuritySettings(securityRes.data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await updateProfile(formData);

      if (error) {
        toast({
          title: 'Erreur',
          description: error.message || 'Une erreur est survenue',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Profil mis à jour',
          description: 'Vos informations ont été mises à jour avec succès',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNotificationUpdate = async (key, value) => {
    const updatedNotifications = { ...notifications, [key]: value };
    setNotifications(updatedNotifications);

    try {
      const { data: existing } = await supabase
        .from('user_notification_preferences')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('user_notification_preferences')
          .update({ [key]: value, updated_at: new Date() })
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('user_notification_preferences')
          .insert({ user_id: user.id, ...updatedNotifications });
      }

      toast({
        title: 'Préférences mises à jour',
        description: 'Vos préférences de notification ont été enregistrées',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour les préférences',
        variant: 'destructive',
      });
    }
  };

  const handleAddPaymentMethod = async () => {
    if (!newPaymentMethod.type) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un type de paiement',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_payment_methods')
        .insert({
          user_id: user.id,
          payment_type: newPaymentMethod.type,
          mobile_number: newPaymentMethod.mobile_number || null,
          mobile_provider: newPaymentMethod.mobile_provider || null,
          bank_account: newPaymentMethod.bank_account || null,
          bank_name: newPaymentMethod.bank_name || null,
          paypal_email: newPaymentMethod.paypal_email || null,
        })
        .select()
        .single();

      if (error) throw error;

      setPaymentMethods([data, ...paymentMethods]);
      setNewPaymentMethod({
        type: '',
        mobile_number: '',
        mobile_provider: '',
        bank_account: '',
        bank_name: '',
        paypal_email: '',
      });

      toast({
        title: 'Méthode ajoutée',
        description: 'La méthode de paiement a été ajoutée avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter la méthode de paiement',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePaymentMethod = async (id) => {
    try {
      await supabase.from('user_payment_methods').delete().eq('id', id);
      setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));

      toast({
        title: 'Méthode supprimée',
        description: 'La méthode de paiement a été supprimée',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la méthode de paiement',
        variant: 'destructive',
      });
    }
  };

  const handleToggle2FA = async (enabled) => {
    try {
      const { data: existing } = await supabase
        .from('user_security_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('user_security_settings')
          .update({ two_factor_enabled: enabled, updated_at: new Date() })
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('user_security_settings')
          .insert({ user_id: user.id, two_factor_enabled: enabled });
      }

      setSecuritySettings({ ...securitySettings, two_factor_enabled: enabled });

      toast({
        title: enabled ? 'Authentification à deux facteurs activée' : 'Authentification à deux facteurs désactivée',
        description: enabled
          ? 'Votre compte est maintenant plus sécurisé'
          : 'L\'authentification à deux facteurs a été désactivée',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour les paramètres de sécurité',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 max-w-6xl">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Paramètres Utilisateur</h1>
            <p className="text-gray-600 mt-1">Gérez votre profil et vos préférences</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Détails Personnels</span>
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Méthodes de Paiement</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Sécurité</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">Historique</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du profil</CardTitle>
                  <CardDescription>
                    Mettez à jour vos informations personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="flex items-center gap-6">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={formData.avatar_url} alt={formData.full_name} />
                        <AvatarFallback className="bg-green-600 text-white text-2xl">
                          {getInitials(formData.full_name || user?.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Label htmlFor="avatar_url">URL de l'avatar</Label>
                        <Input
                          id="avatar_url"
                          type="url"
                          value={formData.avatar_url}
                          onChange={(e) =>
                            setFormData({ ...formData, avatar_url: e.target.value })
                          }
                          disabled={submitting}
                          placeholder="https://exemple.com/avatar.jpg"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="full_name">Nom complet</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) =>
                            setFormData({ ...formData, full_name: e.target.value })
                          }
                          disabled={submitting}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="pl-10 bg-gray-50"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        L'email ne peut pas être modifié
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold">Informations du compte</h3>
                      <div className="grid gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">ID utilisateur</p>
                          <p className="text-sm text-gray-600 mt-1 font-mono break-all">{user?.id}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Rôle</p>
                          <Badge variant="secondary" className="mt-1">
                            {profile?.role || 'user'}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Membre depuis</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {profile?.created_at
                              ? new Date(profile.created_at).toLocaleDateString('fr-FR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" disabled={submitting} className="bg-green-600 hover:bg-green-700">
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        'Enregistrer les modifications'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Méthodes de Paiement</CardTitle>
                  <CardDescription>
                    Ajoutez et gérez vos méthodes de paiement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Ajouter une nouvelle méthode</Label>
                    <Select
                      value={newPaymentMethod.type}
                      onValueChange={(value) =>
                        setNewPaymentMethod({ ...newPaymentMethod, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type de paiement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mobile_wallet">Portefeuille Mobile</SelectItem>
                        <SelectItem value="bank">Compte Bancaire</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                      </SelectContent>
                    </Select>

                    {newPaymentMethod.type === 'mobile_wallet' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Numéro de téléphone</Label>
                          <Input
                            value={newPaymentMethod.mobile_number}
                            onChange={(e) =>
                              setNewPaymentMethod({
                                ...newPaymentMethod,
                                mobile_number: e.target.value,
                              })
                            }
                            placeholder="Ex: 07XXXXXXXXX"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Fournisseur</Label>
                          <Select
                            value={newPaymentMethod.mobile_provider}
                            onValueChange={(value) =>
                              setNewPaymentMethod({
                                ...newPaymentMethod,
                                mobile_provider: value,
                              })
                            }
                          >
                            <SelectTrigger>
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

                    {newPaymentMethod.type === 'bank' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Nom de la banque</Label>
                          <Input
                            value={newPaymentMethod.bank_name}
                            onChange={(e) =>
                              setNewPaymentMethod({
                                ...newPaymentMethod,
                                bank_name: e.target.value,
                              })
                            }
                            placeholder="Ex: Bank of Africa"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Numéro de compte / IBAN</Label>
                          <Input
                            value={newPaymentMethod.bank_account}
                            onChange={(e) =>
                              setNewPaymentMethod({
                                ...newPaymentMethod,
                                bank_account: e.target.value,
                              })
                            }
                            placeholder="Ex: CI93XXXXXXXXXXXXXXXXXXXX"
                          />
                        </div>
                      </div>
                    )}

                    {newPaymentMethod.type === 'paypal' && (
                      <div className="space-y-2">
                        <Label>Email PayPal</Label>
                        <Input
                          type="email"
                          value={newPaymentMethod.paypal_email}
                          onChange={(e) =>
                            setNewPaymentMethod({
                              ...newPaymentMethod,
                              paypal_email: e.target.value,
                            })
                          }
                          placeholder="email@exemple.com"
                        />
                      </div>
                    )}

                    {newPaymentMethod.type && (
                      <Button
                        onClick={handleAddPaymentMethod}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter la méthode de paiement
                      </Button>
                    )}
                  </div>

                  {paymentMethods.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="font-semibold">Méthodes enregistrées</h3>
                        <div className="space-y-3">
                          {paymentMethods.map((method) => (
                            <div
                              key={method.id}
                              className="flex items-center justify-between p-4 border rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                {method.payment_type === 'mobile_wallet' && (
                                  <Smartphone className="h-5 w-5 text-green-600" />
                                )}
                                {method.payment_type === 'bank' && (
                                  <Building2 className="h-5 w-5 text-green-600" />
                                )}
                                {method.payment_type === 'paypal' && (
                                  <CreditCard className="h-5 w-5 text-green-600" />
                                )}
                                <div>
                                  <p className="font-medium">
                                    {method.payment_type === 'mobile_wallet' &&
                                      `${method.mobile_provider?.toUpperCase()} - ${method.mobile_number}`}
                                    {method.payment_type === 'bank' &&
                                      `${method.bank_name} - ${method.bank_account}`}
                                    {method.payment_type === 'paypal' && method.paypal_email}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Ajouté le{' '}
                                    {new Date(method.created_at).toLocaleDateString('fr-FR')}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeletePaymentMethod(method.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de Notification</CardTitle>
                  <CardDescription>
                    Choisissez comment vous souhaitez recevoir les notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Mise à jour des offres d'emploi</h3>
                    <p className="text-sm text-gray-600">
                      Recevez des mises à jour et des notifications sur vos offres de services
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-sm text-gray-500">
                            Recevez des notifications par email
                          </p>
                        </div>
                        <Switch
                          checked={notifications.job_offers_email}
                          onCheckedChange={(checked) =>
                            handleNotificationUpdate('job_offers_email', checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Push</p>
                          <p className="text-sm text-gray-500">
                            Recevez des notifications push sur vos appareils
                          </p>
                        </div>
                        <Switch
                          checked={notifications.job_offers_push}
                          onCheckedChange={(checked) =>
                            handleNotificationUpdate('job_offers_push', checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">SMS</p>
                          <p className="text-sm text-gray-500">
                            Recevez des notifications par SMS pour les mises à jour importantes
                          </p>
                        </div>
                        <Switch
                          checked={notifications.job_offers_sms}
                          onCheckedChange={(checked) =>
                            handleNotificationUpdate('job_offers_sms', checked)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Mise à jour de paiement</h3>
                    <p className="text-sm text-gray-600">
                      Recevez des notifications concernant vos paiements et transactions
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-sm text-gray-500">
                            Recevez des notifications par email
                          </p>
                        </div>
                        <Switch
                          checked={notifications.payment_email}
                          onCheckedChange={(checked) =>
                            handleNotificationUpdate('payment_email', checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Push</p>
                          <p className="text-sm text-gray-500">
                            Recevez des notifications push sur vos appareils
                          </p>
                        </div>
                        <Switch
                          checked={notifications.payment_push}
                          onCheckedChange={(checked) =>
                            handleNotificationUpdate('payment_push', checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Factures</p>
                          <p className="text-sm text-gray-500">
                            Recevez vos factures et reçus par email
                          </p>
                        </div>
                        <Switch
                          checked={notifications.invoices_email}
                          onCheckedChange={(checked) =>
                            handleNotificationUpdate('invoices_email', checked)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Autres systèmes</h3>
                    <p className="text-sm text-gray-600">
                      Recevez des informations sur les produits, les astuces, les changements de système et les enquêtes
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-sm text-gray-500">
                            Recevez des notifications par email
                          </p>
                        </div>
                        <Switch
                          checked={notifications.system_email}
                          onCheckedChange={(checked) =>
                            handleNotificationUpdate('system_email', checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Push</p>
                          <p className="text-sm text-gray-500">
                            Recevez des notifications push sur vos appareils
                          </p>
                        </div>
                        <Switch
                          checked={notifications.system_push}
                          onCheckedChange={(checked) =>
                            handleNotificationUpdate('system_push', checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">SMS</p>
                          <p className="text-sm text-gray-500">
                            Recevez des notifications par SMS
                          </p>
                        </div>
                        <Switch
                          checked={notifications.system_sms}
                          onCheckedChange={(checked) =>
                            handleNotificationUpdate('system_sms', checked)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité du Compte</CardTitle>
                  <CardDescription>
                    Gérez les paramètres de sécurité de votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Autorisation à deux facteurs</h3>
                    <p className="text-sm text-gray-600">
                      Augmentez la sécurité de votre compte avec l'authentification à deux facteurs. Si vous l'activez, vous devrez vous authentifier avec votre appareil mobile chaque fois que vous vous connecterez.
                    </p>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {securitySettings.two_factor_enabled
                            ? 'Authentification activée'
                            : 'Authentification désactivée'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {securitySettings.two_factor_enabled
                            ? 'Votre compte est protégé par une authentification à deux facteurs'
                            : 'Activez l\'authentification à deux facteurs pour plus de sécurité'}
                        </p>
                      </div>
                      <Switch
                        checked={securitySettings.two_factor_enabled}
                        onCheckedChange={handleToggle2FA}
                      />
                    </div>

                    {securitySettings.two_factor_enabled && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-900">
                              Authentification SMS ou Application
                            </p>
                            <p className="text-sm text-green-700 mt-1">
                              Configurez votre méthode d'authentification préférée dans les paramètres avancés
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Mot de passe</h3>
                    <p className="text-sm text-gray-600">
                      Pour changer votre mot de passe, veuillez vous déconnecter et utiliser l'option "Mot de passe oublié" sur la page de connexion.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historique de Connexion</CardTitle>
                  <CardDescription>
                    Consultez l'historique de vos connexions récentes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loginHistory.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date/Heure</TableHead>
                          <TableHead>Appareil</TableHead>
                          <TableHead>Localisation</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loginHistory.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>
                              {new Date(entry.login_at).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Monitor className="h-4 w-4 text-gray-500" />
                                {entry.device || 'Appareil inconnu'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                {entry.location || 'Non disponible'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={entry.status === 'success' ? 'default' : 'destructive'}
                                className={
                                  entry.status === 'success'
                                    ? 'bg-green-100 text-green-800'
                                    : ''
                                }
                              >
                                {entry.status === 'success' ? 'Réussi' : 'Échoué'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12">
                      <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Aucun historique de connexion disponible</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
