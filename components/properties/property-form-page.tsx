'use client';

import z from 'zod';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { RoleGuard } from '@/components/dashboard';
import { BasicInfo } from '@/components/properties/properties-form/basic-info';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { AddressInfo } from '@/components/properties/properties-form/address-info';
import { DetailsInfo } from '@/components/properties/properties-form/details-form';
import { ServicesInfo } from '@/components/properties/properties-form/services-info';
import { DocumentsGallery } from '@/components/form-generics/documents-gallery/documents-gallery';
import { useCreateProperty, useGetPropertyById, useUpdateProperty } from '@/hooks/useProperties';
import { FormProvider } from '@/lib/contexts/form-context';
import { propertyFormSchema } from '@/lib/schemas/property';
import { propertyDefaultValues, propertyMapperFront } from '@/lib/mappers/property';

interface PropertyFormPageProps {
  id: string;
}

const PropertyFormPage = ({ id }: PropertyFormPageProps) => {
  const router = useRouter();
  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();
  const { data, error } = useGetPropertyById(id);

  const form = useForm<z.infer<typeof propertyFormSchema>>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: propertyDefaultValues,
  });

  useEffect(() => {
    if (data) {
      form.reset(propertyMapperFront(data));
    }
  }, [data, form]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error al obtener la propiedad',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [error]);

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

  console.log('errors', form.formState.errors);
  console.log('form', form.getValues());

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className='space-y-6'>
        <div>
          <h2 className='page-title'>{id === 'new' ? 'Nueva Propiedad' : 'Editar Propiedad'}</h2>
          <p className='page-description'>
            {id === 'new' ? 'Crea la nueva propiedad' : 'Edita la propiedad'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {})}
          noValidate
          className='space-y-8'
        >
          <FormProvider form={form}>
            <BasicInfo />
            <AddressInfo disabled={false} />
            <DetailsInfo />
            <ServicesInfo />
            <DocumentsGallery />
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
