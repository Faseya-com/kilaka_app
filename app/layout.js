import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';


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
            <Toaster />
        </AuthProvider>
        </body>
        </html>
    );
}
