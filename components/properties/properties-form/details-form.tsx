import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, User } from 'lucide-react';
import { InputField } from '@/components/form-generics';
import { InputNumberField } from '@/components/form-generics/input-number-field';
import BooleanCheckbox from '@/components/form-generics/boolean-checkbox';

const DetailsInfo = () => {
  return (
    <>
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle className='flex items-center justify-between text-primary'>
            <div className='flex items-center'>
              <ClipboardList className='mr-2 h-5 w-5' />
              Detalles de la Propiedad
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className='pb-0'>
          <div className='grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2'>
            <InputNumberField
              name='coveredMeters'
              label='Metros cuadrados cubiertos'
              placeholder='Metros cuadrados cubiertos'
              regExp={/^(0|(0,\d{0,2})|([1-9]\d{0,5})(,\d{0,2})?)?$/}
              required
            />

            <InputNumberField
              name='uncoveredMeters'
              label='Metros cuadrados descubiertos'
              placeholder='Metros cuadrados descubiertos'
              regExp={/^(0|(0,\d{0,2})|([1-9]\d{0,5})(,\d{0,2})?)?$/}
              required
            />

            <InputNumberField
              name='rooms'
              label='Cantidad de habitaciones'
              placeholder='Cantidad de habitaciones'
              integerDigits={3}
              required
            />

            <InputNumberField
              name='bathrooms'
              label='Cantidad de baños'
              placeholder='Cantidad de baños'
              integerDigits={3}
              required
            />

            <InputNumberField
              name='yearOfConstruction'
              label='Año de construcción'
              placeholder='Año de construcción'
              integerDigits={4}
              regExp={
                /^(1|2|19|20|21|199|200|201|202|203|204|205|206|207|208|209|210|199[0-9]|20[0-9]{1,2}|2100)?$/
              }
            />

            <InputField
              name='ABLIdentifier'
              label='Id ABL (SUM - APR)'
              placeholder='Id ABL (SUM - APR)'
            />

            <InputField
              name='electricityIdentifier'
              label='Id medidor de electricidad (NIS)'
              placeholder='Id medidor de electricidad (NIS)'
            />

            <InputField
              name='gasIdentifier'
              label='Id medidor de gas'
              placeholder='Id medidor de gas'
            />

            <InputField name='administration' label='Administración' placeholder='Administración' />

            <InputField
              name='administrationPhone'
              label='Teléfono de administración'
              placeholder='Teléfono de administración'
            />

            <InputField
              name='administrationEmail'
              type='email'
              label='Email de administración'
              placeholder='Email de administración'
            />

            <InputField
              name='administrationAddress'
              label='Dirección de administración'
              placeholder='Dirección de administración'
            />

            <BooleanCheckbox name='hasExpenses' label='¿Tiene expensas?' />
            <BooleanCheckbox
              name='hasExtraordinaryExpenses'
              label='¿Tiene expensas extraordinarias?'
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export { DetailsInfo };
