import React from 'react';
import {Heart, Lightbulb, Users} from "lucide-react";

const OurMission =()=> {
    return (
        <section className="py-20 bg-white" id="about">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        À Propos de Kilaka
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        La plateforme qui révolutionne la mise en relation entre clients et prestataires professionnels
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <img
                            src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800"
                            alt="Team collaboration"
                            className="rounded-xl shadow-lg w-full h-96 object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Notre Mission</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Kilaka Platform a été créée avec une vision claire : simplifier et sécuriser la
                            connexion entre les clients à la recherche de services de qualité et les
                            prestataires professionnels qualifiés.
                        </p>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Nous croyons que chaque projet mérite d'être réalisé par des experts passionnés.
                            C'est pourquoi nous vérifions rigoureusement chaque prestataire et offrons une
                            plateforme transparente où les avis clients et le professionnalisme sont au
                            cœur de notre écosystème.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
                                <p className="text-sm text-gray-600">Prestataires vérifiés</p>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
                                <p className="text-sm text-gray-600">Projets réalisés</p>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-green-600 mb-2">4.8/5</div>
                                <p className="text-sm text-gray-600">Note moyenne</p>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                                <p className="text-sm text-gray-600">Clients satisfaits</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-gray-50 p-8 rounded-xl">
                        <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Communauté Active</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Rejoignez une communauté dynamique de professionnels et de clients engagés
                            dans la qualité et l'excellence.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-xl">
                        <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <Heart className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Confiance & Sécurité</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Tous nos prestataires sont vérifiés. Paiements sécurisés et système
                            d'évaluation transparent pour votre tranquillité d'esprit.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-xl">
                        <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <Lightbulb className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation Continue</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Nous améliorons constamment notre plateforme pour offrir la meilleure
                            expérience utilisateur possible.
                        </p>
                    </div>
                </div>
            </div>
        </section>

    );
};

export default OurMission;
