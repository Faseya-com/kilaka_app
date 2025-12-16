'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Image, TrendingUp, Activity, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalServices: 0,
    activeServices: 0,
    totalWorks: 0,
    activeWorks: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
  });
  const [recentServices, setRecentServices] = useState([]);
  const [recentWorks, setRecentWorks] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [servicesRes, worksRes, appointmentsRes] = await Promise.all([
        supabase
          .from('services')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('works')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('appointments')
          .select('*, providers(name), provider_services(name)', { count: 'exact' })
          .eq('user_id', user.id)
          .order('appointment_date', { ascending: false })
          .limit(5),
      ]);

      const activeServicesRes = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'active');

      const activeWorksRes = await supabase
        .from('works')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'active');

      const pendingAppointmentsRes = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'pending');

      const completedAppointmentsRes = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'completed');

      setStats({
        totalServices: servicesRes.count || 0,
        activeServices: activeServicesRes.count || 0,
        totalWorks: worksRes.count || 0,
        activeWorks: activeWorksRes.count || 0,
        totalAppointments: appointmentsRes.count || 0,
        pendingAppointments: pendingAppointmentsRes.count || 0,
        completedAppointments: completedAppointmentsRes.count || 0,
      });

      setRecentServices(servicesRes.data || []);
      setRecentWorks(worksRes.data || []);
      setRecentAppointments(appointmentsRes.data || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Services',
      value: stats.totalServices,
      icon: Briefcase,
      description: `${stats.activeServices} actifs`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Oeuvres',
      value: stats.totalWorks,
      icon: Image,
      description: `${stats.activeWorks} actives`,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Rendez-vous',
      value: stats.totalAppointments,
      icon: Calendar,
      description: `${stats.pendingAppointments} en attente`,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      title: 'Complétés',
      value: stats.completedAppointments,
      icon: CheckCircle2,
      description: 'Rendez-vous terminés',
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
    },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="text-gray-600 mt-1">
                Bienvenue! Voici un aperçu de votre activité.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/become-provider">Devenir prestataire</Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Rendez-vous récents</CardTitle>
                    <CardDescription>Vos derniers rendez-vous</CardDescription>
                  </div>
                  <Button asChild size="sm">
                    <Link href="/dashboard/appointments">Voir tout</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Chargement...</p>
                ) : recentAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-sm text-muted-foreground">Aucun rendez-vous</p>
                    <Button asChild size="sm" className="mt-3">
                      <Link href="/providers">Trouver un prestataire</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`p-2 rounded-lg ${
                            appointment.status === 'pending' ? 'bg-amber-100' :
                            appointment.status === 'completed' ? 'bg-emerald-100' :
                            appointment.status === 'confirmed' ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            <Calendar className={`h-4 w-4 ${
                              appointment.status === 'pending' ? 'text-amber-600' :
                              appointment.status === 'completed' ? 'text-emerald-600' :
                              appointment.status === 'confirmed' ? 'text-blue-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {appointment.providers?.name || 'Prestataire'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {appointment.provider_services?.name || 'Service'}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <p className="text-xs text-muted-foreground">
                                {new Date(appointment.appointment_date).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                            appointment.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : appointment.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : appointment.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {appointment.status}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Services récents</CardTitle>
                      <CardDescription>Vos derniers services créés</CardDescription>
                    </div>
                    <Button asChild size="sm">
                      <Link href="/dashboard/services">Voir tout</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-sm text-muted-foreground">Chargement...</p>
                  ) : recentServices.length === 0 ? (
                    <div className="text-center py-8">
                      <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-sm text-muted-foreground">Aucun service</p>
                      <Button asChild size="sm" className="mt-3">
                        <Link href="/dashboard/services">Créer un service</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentServices.map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{service.title}</p>
                            <p className="text-xs text-muted-foreground">{service.category}</p>
                          </div>
                          <div
                            className={`px-2 py-1 text-xs rounded-full ${
                              service.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {service.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Oeuvres récentes</CardTitle>
                      <CardDescription>Vos dernières oeuvres créées</CardDescription>
                    </div>
                    <Button asChild size="sm">
                      <Link href="/dashboard/works">Voir tout</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-sm text-muted-foreground">Chargement...</p>
                  ) : recentWorks.length === 0 ? (
                    <div className="text-center py-8">
                      <Image className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-sm text-muted-foreground">Aucune oeuvre</p>
                      <Button asChild size="sm" className="mt-3">
                        <Link href="/dashboard/works">Créer une oeuvre</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentWorks.map((work) => (
                        <div
                          key={work.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{work.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {work.description}
                            </p>
                          </div>
                          <div
                            className={`px-2 py-1 text-xs rounded-full ${
                              work.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {work.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
