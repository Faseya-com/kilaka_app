import React from 'react';
import Link from "next/link";
import {Button} from "../../components/ui/button";

const Banner = props => {
    return (
        <section className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            Connectez-vous,
                            <br />
                            collaborez, conquérez
                            <br />
                            avec Kilaka
                        </h1>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Plateforme de mise en relation entre clients et prestataires professionnels.
                            Trouvez les services experts, collaborez en une équipe d'élite pour
                            réussir tous vos projets et faites grandir votre
                            entreprise en toute autonomie pour développer et conquérir pour
                            mieux grandir.
                        </p>
                        <div className="flex gap-4">
                            <Button className="bg-green-600 hover:bg-green-700 text-white" asChild>
                                <Link href="/register">Inscription</Link>
                            </Button>
                            <Button variant="outline" className="border-gray-300" asChild>
                                <Link href="/providers">Devenir un service</Link>
                            </Button>
                        </div>
                    </div>
                    <div>
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <img
                                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
                                alt="Professionals"
                                className="w-full h-80 object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
