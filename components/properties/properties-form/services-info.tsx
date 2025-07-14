import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils } from 'lucide-react';
import { InputField, TextareaField } from '@/components/form-generics';
import { InputNumberField } from '@/components/form-generics/input-number-field';
import BooleanCheckbox from '@/components/form-generics/boolean-checkbox';

const ServicesInfo = () => {
  return (
    <>
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle className='flex items-center justify-between text-primary'>
            <div className='flex items-center'>
              <Utensils className='mr-2 h-5 w-5' />
              Servicios / Comodidades
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className='pb-0'>
          <div className='grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2'>
            <BooleanCheckbox name='hasKitchen' label='¿Tiene cocina?' />
            <BooleanCheckbox name='hasPatio' label='¿Tiene patio?' />
            <BooleanCheckbox name='hasBarbecue' label='¿Tiene parrilla?' />
            <BooleanCheckbox name='hasTerrace' label='¿Tiene terraza?' />
            <BooleanCheckbox name='hasPool' label='¿Tiene pileta?' />
            <BooleanCheckbox name='hasGarden' label='¿Tiene jardín?' />
            <BooleanCheckbox name='hasBalcony' label='¿Tiene balcón?' />
            <BooleanCheckbox name='hasFurnished' label='¿Amoblado?' />
            <BooleanCheckbox name='hasZoom' label='¿Zoom?' />
            <BooleanCheckbox name='hasParking' label='¿Cochera?' />
          </div>
          <TextareaField
            name='servicesComment'
            label='Observaciones'
            placeholder='Observaciones'
            rows={4}
          />
        </CardContent>
      </Card>
    </>
  );
};

export { ServicesInfo };
