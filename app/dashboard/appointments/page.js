'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Loader2, MapPin, User, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];

const statusConfig = {
  pending: {
    label: 'En attente',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: Clock,
  },
  confirmed: {
    label: 'Confirmé',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Calendar,
  },
  completed: {
    label: 'Complété',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: Calendar,
  },
  cancelled: {
    label: 'Annulé',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: X,
  },
};

export default function AppointmentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user]);

  const loadAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, providers(name, avatar_url, specialty, location), provider_services(name, price, duration)')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les rendez-vous',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: 'Statut mis à jour',
        description: 'Le statut du rendez-vous a été mis à jour',
      });

      loadAppointments();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut',
        variant: 'destructive',
      });
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (activeTab === 'all') return true;
    return apt.status === activeTab;
  });

  const AppointmentCard = ({ appointment }) => {
    const StatusIcon = statusConfig[appointment.status]?.icon || Clock;
    const isPast = new Date(appointment.appointment_date) < new Date();

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              {appointment.providers?.avatar_url ? (
                <img
                  src={appointment.providers.avatar_url}
                  alt={appointment.providers.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {appointment.providers?.name || 'Prestataire'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {appointment.providers?.specialty || 'Service'}
                  </p>
                </div>
                <Badge className={statusConfig[appointment.status]?.color || 'bg-gray-100'}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig[appointment.status]?.label || appointment.status}
                </Badge>
              </div>

              <div className="space-y-2">
                {appointment.provider_services && (
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="font-medium">{appointment.provider_services.name}</span>
                    {appointment.provider_services.price && (
                      <span className="ml-2 text-gray-600">
                        - {appointment.provider_services.price} €
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(appointment.appointment_date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(appointment.appointment_date).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {appointment.providers?.location && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{appointment.providers.location}</span>
                  </div>
                )}

                {appointment.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{appointment.notes}</p>
                  </div>
                )}
              </div>

              {appointment.status === 'pending' && (
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                  >
                    Confirmer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleUpdateStatus(appointment.id, 'cancelled')}
                  >
                    Annuler
                  </Button>
                </div>
              )}

              {appointment.status === 'confirmed' && !isPast && (
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                  >
                    Marquer comme complété
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleUpdateStatus(appointment.id, 'cancelled')}
                  >
                    Annuler
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes rendez-vous</h1>
              <p className="text-gray-600 mt-1">Gérez vos rendez-vous avec les prestataires</p>
            </div>
            <Button asChild>
              <a href="/providers">Trouver un prestataire</a>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-amber-600">En attente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-600">Confirmés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-emerald-600">Complétés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">{stats.completed}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Tous ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending">En attente ({stats.pending})</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmés ({stats.confirmed})</TabsTrigger>
              <TabsTrigger value="completed">Complétés ({stats.completed})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredAppointments.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucun rendez-vous
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 text-center">
                      {activeTab === 'all'
                        ? 'Vous n\'avez pas encore de rendez-vous'
                        : `Aucun rendez-vous ${activeTab === 'pending' ? 'en attente' : activeTab === 'confirmed' ? 'confirmé' : 'complété'}`}
                    </p>
                    <Button asChild>
                      <a href="/providers">Trouver un prestataire</a>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
