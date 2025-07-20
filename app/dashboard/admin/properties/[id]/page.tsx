import { RoleGuard } from '@/components/dashboard';
import { PropertyFormPage } from '@/components/properties/property-form-page';

interface PropertiesIdPageServerProps {
  params: { id: string };
}

export default function PropertiesIdPageServer({ params }: PropertiesIdPageServerProps) {
  const { id } = params;
  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className='mx-auto flex max-w-7xl flex-col gap-6'>
        <PropertyFormPage id={id} />
      </div>
    </RoleGuard>
  );
}
