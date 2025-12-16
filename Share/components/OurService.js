import React from 'react';


const OurService =()=> {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Comment Kilaka vous rend plus fort
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    <div className="text-center">
                        <div className="bg-gray-900 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                            1
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Découvrez les opportunités
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Parcourez des milliers de profils vérifiés et trouvez le prestataire parfait
                            pour votre projet grâce à nos filtres de recherche avancés.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="bg-gray-900 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                            2
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Connectez-vous instantanément
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Communiquez directement avec les prestataires professionnels de confiance grâce à notre
                            plateforme sécurisée, envoi instantané pour vos projets.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="bg-gray-900 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                            3
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Développez votre réseau
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Collaborez avec des professionnels qualifiés, développez votre
                            réseau avec des communautés dynamiques et améliorez vos compétences.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};


export default OurService;
