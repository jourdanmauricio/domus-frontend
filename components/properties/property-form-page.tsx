'use client';

import z from 'zod';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { RoleGuard } from '@/components/dashboard';
import { BasicInfo } from '@/components/properties/properties-form/basic-info';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { AddressInfo } from '@/components/properties/properties-form/address-info';
import { DetailsInfo } from '@/components/properties/properties-form/details-form';
import { ServicesInfo } from '@/components/properties/properties-form/services-info';
import { ImagesGalery } from '@/components/form-generics/images-gallery/images-gallery';
import { useCreateProperty, useUpdateProperty } from '@/hooks/useProperties';
import { QUERY_KEYS } from '@/lib/constants';
import { FormProvider } from '@/lib/contexts/form-context';
import { propertyFormSchema } from '@/lib/schemas/property';
import { propertyMapperFront } from '@/lib/mappers/property';
import { propertiesService } from '@/lib/services/properties.service';
import { PropertyTypeEnum, OwnerIntentionEnum } from '@/lib/constants/list';

interface PropertyFormPageProps {
  id: string;
}

const defaultValues = {
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
    postalCode: '',
    nomenclator: '',
    latitude: '',
    longitude: '',
  },
};

const PropertyFormPage = ({ id }: PropertyFormPageProps) => {
  const router = useRouter();
  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.PROPERTIES, id],
    queryFn: () => propertiesService.getPropertyById(id),
    enabled: id !== 'new',
  });

  const form = useForm<z.infer<typeof propertyFormSchema>>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (data) {
      form.reset(propertyMapperFront(data));
    }
  }, [data, form]);

  const onSubmit = (data: z.infer<typeof propertyFormSchema>) => {

    if (id === 'new') {
      createPropertyMutation.mutate(data);
    } else {
      updatePropertyMutation.mutate({ data, id });
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/admin/properties');
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className='space-y-6'>
        <div>
          <h2 className='page-title'>{id === 'new' ? 'Nueva Propiedad' : 'Editar Propiedad'}</h2>
          <p className='page-description'>{id === 'new' ? 'Crea la nueva propiedad' : 'Edita la propiedad'}</p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
        
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
