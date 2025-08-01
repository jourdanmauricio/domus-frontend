// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { auth } from '@/lib/auth';
import SessionProvider from '@/providers/SessionProvider';
import QueryProvider from '@/providers/QueryProvider';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Domus App',
  description: 'Aplicación con NextAuth y TanStack Query',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang='es' className='h-full'>
      <body className={`${inter.className} h-full`} suppressHydrationWarning>
        <SessionProvider session={session}>
          <QueryProvider>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
