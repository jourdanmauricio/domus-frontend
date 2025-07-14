import { RoleGuard } from '@/components/dashboard';
import { PropertiesPage } from '@/components/properties/properties-page';

export default function PropertiesIdPageServer() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className='mx-auto flex max-w-7xl flex-col gap-6'>{/* <PropertiesPage /> */}</div>
    </RoleGuard>
  );
}
