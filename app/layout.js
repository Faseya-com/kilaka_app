import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Script from "next/script";


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Kilaka',
    description: 'Manage your services and works efficiently',
    icons: {
        icon: '../assets/logos/kilaka.png',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <AuthProvider>
            {children}
            <Script
                src="https://skb-tech.github.io/botAI/dist/chatbot-widget.js"
                strategy="afterInteractive"
                data-faq="https://rmtlabs.ai/faq"
                data-lang="fr"
            />
            <Toaster />
        </AuthProvider>
        </body>
        </html>
    );
}
