import { RoleGuard } from '@/components/dashboard';
import UsersPage from '@/components/users/usersPage';

export default function UsersPageServer() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className='mx-auto flex max-w-7xl flex-col gap-6'>
        <UsersPage />
      </div>
    </RoleGuard>
  );
}
