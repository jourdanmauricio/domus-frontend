import { RoleGuard } from '@/components/dashboard';
import { PropertyFormPage } from '@/components/properties/property-form-page';

export default function PropertiesNewPageServer() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className='mx-auto flex max-w-7xl flex-col gap-6'>
        <PropertyFormPage />
      </div>
    </RoleGuard>
  );
}
