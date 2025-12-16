import React from 'react';
import Link from "next/link";
import Image from "next/image";

const Footer =()=> {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4 ">
                            <Image src={'/assets/logos/kilaka.png'} alt="" width={120} height={40} className={'rounded-lg'} />
                        </div>
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} Kilaka. All rights reserved
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Kilaka</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Apropos
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Aide
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Contact Nous
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Status
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
