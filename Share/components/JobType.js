import React from 'react';
import {
    Car,
    GraduationCap,
    Hammer,
    Heart,
    Home as HomeIcon,
    Laptop, Lightbulb,
    Shirt,
    Stethoscope,
    Users,
    Wrench,
    Zap
} from "lucide-react";
import Link from "next/link";

const JobType =()=> {

    const services = [
        { icon: Zap, name: 'Électricité', color: 'text-green-600', slug: 'electricite' },
        { icon: Wrench, name: 'Plomberie', color: 'text-green-600', slug: 'plomberie' },
        { icon: Stethoscope, name: 'Médecine', color: 'text-green-600', slug: 'medecine' },
        { icon: Car, name: 'Mécanique Auto', color: 'text-green-600', slug: 'mecanique-auto' },
        { icon: Shirt, name: 'Ménage', color: 'text-green-600', slug: 'menage' },
        { icon: Users, name: 'Coaching', color: 'text-green-600', slug: 'coaching' },
        { icon: Heart, name: 'Santé Mentale', color: 'text-green-600', slug: 'sante-mentale' },
        { icon: HomeIcon, name: 'Immobilier', color: 'text-green-600', slug: 'immobilier' },
        { icon: Hammer, name: 'Bricolage', color: 'text-green-600', slug: 'bricolage' },
        { icon: Laptop, name: 'Informatique', color: 'text-green-600', slug: 'informatique' },
        { icon: GraduationCap, name: 'Enseignement', color: 'text-green-600', slug: 'enseignement' },
        { icon: Lightbulb, name: 'Inspiration et Innovation', color: 'text-green-600', slug: 'inspiration-innovation' },
    ];
    return (
        <section className="py-20 bg-gray-50" id="services">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Trouvez le Service Qu'il Vous Faut
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <Link
                            key={index}
                            href={`/services/${service.slug}`}
                            className="flex flex-col items-center justify-center p-6 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <service.icon className={`h-10 w-10 ${service.color} mb-3`} />
                            <span className="text-sm font-medium text-gray-900 text-center">
                  {service.name}
                </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};



export default JobType;
