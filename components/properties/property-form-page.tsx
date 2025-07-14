'use client';

import { RoleGuard } from '@/components/dashboard';
import { BasicInfo } from '@/components/properties/properties-form/basic-info';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertyFormSchema } from '@/lib/schemas/property';
import z from 'zod';
import { Form } from '@/components/ui/form';
import { FormProvider } from '@/lib/contexts/form-context';
import { PropertyTypeEnum, OwnerIntentionEnum } from '@/lib/constants/list';
import { Button } from '@/components/ui/button';
import { AddressInfo } from '@/components/properties/properties-form/address-info';
import { DetailsInfo } from '@/components/properties/properties-form/details-form';
import { ServicesInfo } from '@/components/properties/properties-form/services-info';
import { ImagesGalery } from '@/components/form-generics/images-gallery/images-gallery';
import { useCreateProperty } from '@/hooks/useProperties';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const PropertyFormPage = () => {
  const router = useRouter();
  const createPropertyMutation = useCreateProperty();

  const form = useForm<z.infer<typeof propertyFormSchema>>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      functionalUnit: '',
      name: '',
      description: '',
      propertyType: PropertyTypeEnum.PH,
      ownerIntention: OwnerIntentionEnum.RENT,
      ownerName: '',
      ownerPhone: '',
      ownerCBU: '',
      ownerAlias: '',
      registryNumber: '',
      commercialStatus: 'Disponible',
      propertyCondition: '',
      thumbnail: undefined,
      images: [],
      documents: [],
      coveredMeters: '',
      uncoveredMeters: '',
      rooms: '',
      bathrooms: '',
      yearOfConstruction: '',
      electricityIdentifier: '',
      gasIdentifier: '',
      ABLIdentifier: '',
      administration: '',
      administrationPhone: '',
      administrationEmail: '',
      administrationAddress: '',
      hasExpenses: false,
      hasExtraordinaryExpenses: false,
      hasKitchen: false,
      hasPatio: false,
      hasPool: false,
      hasParking: false,
      address: {
        city: {
          id: '',
          name: '',
          province: {
            id: '06',
            name: 'Buenos Aires',
          },
          latitude: '',
          longitude: '',
        },
        street: '',
        number: '',
        apartment: '',
        neighborhood: '',
        searchCity: '',
        postalCode: {
          code: '',
          id: '',
        },
        nomenclator: '',
        latitude: '',
        longitude: '',
      },
    },
  });

  const onSubmit = (data: z.infer<typeof propertyFormSchema>) => {
    console.log('Datos del formulario:', data);
    console.log('Imágenes:', data.images);
    console.log('Documentos:', data.documents);
    createPropertyMutation.mutate(data);
  };

  const handleCancel = () => {
    router.push('/dashboard/admin/properties');
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className='space-y-6'>
        <div>
          <h2 className='page-title'>Nueva Propiedad</h2>
          <p className='page-description'>Crea la nueva propiedad</p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log('Errores:', errors);
          })}
          className='space-y-8'
        >
          <FormProvider form={form}>
            <BasicInfo />
            <AddressInfo disabled={false} />
            <DetailsInfo />
            <ServicesInfo />
            <ImagesGalery />
            <div className='flex justify-end gap-6'>
              <Button
                type='button'
                variant='outline'
                onClick={handleCancel}
                disabled={createPropertyMutation.isPending}
              >
                Cancelar
              </Button>
              <Button type='submit' disabled={createPropertyMutation.isPending}>
                {createPropertyMutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Guardando...
                  </>
                ) : (
                  'Guardar'
                )}
              </Button>
            </div>
          </FormProvider>
        </form>
      </Form>
    </RoleGuard>
  );
};

export { PropertyFormPage };
