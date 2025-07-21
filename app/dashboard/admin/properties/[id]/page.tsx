import { RoleGuard } from '@/components/dashboard';
import { PropertyFormPage } from '@/components/properties/property-form-page';

interface PropertiesIdPageServerProps {
  params: Promise<{ id: string }>;
}

export default async function PropertiesIdPageServer({ params }: PropertiesIdPageServerProps) {
  const { id } = await params;
  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className='mx-auto flex max-w-7xl flex-col gap-6'>
        <PropertyFormPage id={id} />
      </div>
    </RoleGuard>
  );
}
