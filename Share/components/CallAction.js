import React from 'react';
import Link from "next/link";
import {Button} from "../../components/ui/button";

const CallAction =()=> {
    return (
        <section className="py-16 bg-green-600 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Prêt à faire passer votre Agence au niveau supérieur?
                </h2>
                <p className="text-lg mb-8 text-white/90">
                    Rejoignez dès aujourd'hui la plateforme Kilaka et développez votre réseau de
                    clients et professionnels. Bénéficiez d'une visibilité accrue auprès d'une communauté de clients sélectionnés
                    partout dans le monde.
                </p>
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100" asChild>
                    <Link href="/register" className={"font-bold"}>Rejoindre Kilaka</Link>
                </Button>
            </div>
        </section>
    );
};


export default CallAction;
