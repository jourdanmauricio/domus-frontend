'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLogout } from '@/hooks/useAuth';
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard';
import { ScrollArea } from '@radix-ui/react-scroll-area';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const logoutMutation = useLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className='flex items-center justify-center'>
        <div className='text-center'>
          <div className='h-32 w-32 animate-spin rounded-full border-b-2 border-indigo-600'></div>
          <p className='mt-4 text-gray-600'>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className='flex h-full flex-col overflow-hidden bg-gray-50'>
      <DashboardHeader
        user={session.user}
        onLogout={handleLogout}
        isLoading={logoutMutation.isPending}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className='flex h-full min-h-0 flex-1'>
        <DashboardSidebar
          userRoles={session.user.roles}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <ScrollArea className='mx-auto w-full overflow-auto'>
          <main className='mx-auto w-full p-4 md:p-6'>{children}</main>
        </ScrollArea>
      </div>
    </div>
  );
}
