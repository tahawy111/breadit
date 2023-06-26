import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/Toaster';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import { Inter } from "next/font/google";

export const metadata = {
  title: 'Breadit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
  authModal
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html lang='en' className={ cn("bg-white text-slate-900 light antialiased", inter.className) }>
      <body className='min-h-screen py-12 bg-slate-50 antialiased'>
        {/* @ts-expect-error server component */ }
        <Navbar />
        { authModal }
        <div className="container max-w-7xl mx-auto h-full pt-12"></div>

        { children }
        <Toaster />
      </body>
    </html>
  );
}
