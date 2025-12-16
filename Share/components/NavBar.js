import React from 'react';
import Image from 'next/image';
import Link from "next/link";
import {Button} from "../../components/ui/button";

const NavBar =()=> {
    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <Image src={'/assets/logos/kilaka.png'} alt="" width={120} height={80} />
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-gray-700 hover:text-green-600 font-medium">
                            Accueil
                        </Link>
                        <Link href="#services" className="text-gray-700 hover:text-green-600 font-medium">
                            Services
                        </Link>
                        <Link href="/providers" className="text-gray-700 hover:text-green-600 font-medium">
                            Prestataires
                        </Link>
                        <Link href="#about" className="text-gray-700 hover:text-green-600 font-medium">
                            À propos de nous
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50" asChild>
                            <Link href="/login">Connexion</Link>
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-white" asChild>
                            <Link href="/register">Inscription</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};



export default NavBar;
