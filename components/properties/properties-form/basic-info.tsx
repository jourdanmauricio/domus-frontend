import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { InputField, SelectField, TextareaField, ImageField } from '@/components/form-generics';
import {
  OWNER_INTENTION_LIST,
  PROPERTY_CONDITION_LIST,
  PROPERTY_TYPE_LIST,
} from '@/lib/constants/list';

const BasicInfo = () => {
  return (
    <>
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle className='flex items-center justify-between text-primary'>
            <div className='flex items-center'>
              <User className='mr-2 h-5 w-5' />
              Información Básica
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className='pb-0'>
          <div className='grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2'>
            <InputField
              name='registryNumber'
              label='Número de Registro (Partida)'
              placeholder='Número de Registro'
              required
            />
            <InputField
              name='functionalUnit'
              label='Unidad Funcional'
              placeholder='Unidad Funcional'
            />
            <InputField name='name' label='Nombre' placeholder='Nombre' required />

            <SelectField
              name='propertyType'
              label='Tipo de Propiedad'
              placeholder='Tipo de Propiedad'
              options={[...PROPERTY_TYPE_LIST]}
              required
            />

            <SelectField
              name='ownerIntention'
              label='Intención del Propietario'
              placeholder='Intención del Propietario'
              options={[...OWNER_INTENTION_LIST]}
              required
            />

            <SelectField
              name='propertyCondition'
              label='Condición de la Propiedad'
              placeholder='Condición de la Propiedad'
              options={[...PROPERTY_CONDITION_LIST]}
              required
            />
            <InputField
              name='commercialStatus'
              label='Estado Comercial'
              placeholder='Estado Comercial'
              disabled
            />

            <InputField
              name='ownerName'
              label='Nombre del Propietario'
              placeholder='Nombre del Propietario'
            />
            <InputField
              name='ownerPhone'
              label='Teléfono del Propietario'
              placeholder='Teléfono del Propietario'
            />
            <InputField
              name='ownerCBU'
              label='CBU del Propietario'
              placeholder='CBU del Propietario'
            />
            <InputField
              name='ownerAlias'
              label='Alias del Propietario'
              placeholder='Alias del Propietario'
            />

            <div></div>

            <TextareaField
              className=''
              name='description'
              label='Descripción'
              placeholder='Descripción'
              rows={10}
            />

            <ImageField
              name='thumbnail'
              label='Imagen Principal'
              placeholder='Seleccionar imagen'
              aspectRatio='16/9'
              maxSize={5}
              className='mx-auto h-56 w-56'
              objectFit='contain'
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export { BasicInfo };
