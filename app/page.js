'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Loader2,
} from 'lucide-react';
import NavBar from "../Share/components/NavBar";
import Banner from "../Share/components/Banner";
import OurService from "../Share/components/OurService";
import OurMission from "../Share/components/OurMission";
import CallAction from "../Share/components/CallAction";
import Footer from "../Share/components/Footer";
import JobType from "../Share/components/JobType";


export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (user) {
    return null;
  }


  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <Banner />
      <OurService/>
      <JobType/>
     <OurMission/>
      <CallAction/>
      <Footer />
    </div>
  );
}
