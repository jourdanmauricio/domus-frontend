import { useState } from 'react';
import { MapPin, PlusCircleIcon, SearchIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SelectField, InputField } from '@/components/form-generics';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { API_ENDPOINTS, buildEndpoint } from '@/lib/constants';
import { AddCityModal } from '@/components/geography/add-city-modal';
import { useFormContext } from '@/lib/contexts/form-context';
import { AddressSelectorModal } from '@/components/geography/address-selector-modal';
import { CityMapperDto } from '@/lib/types/geography';

type AddressSelectorProps = {
  disabled: boolean;
};

const AddressSelector = ({ disabled }: AddressSelectorProps) => {
  const { form } = useFormContext();
  const [showAddCity, setShowAddCity] = useState(false);
  const [shouldSearchAddress, setShouldSearchAddress] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CityMapperDto | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center'>
          <MapPin className='mr-2 h-5 w-5' />
          Dirección
        </CardTitle>
      </CardHeader>
      <CardContent className='pb-0'>
        <div className='grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2'>
          <SelectField
            name='address.city.province.id'
            label='Provincia'
            placeholder='Selecciona una provincia'
            disabled={disabled}
            apiUrl={API_ENDPOINTS.PROVINCES}
            required
          />

          <div className='flex w-full items-center gap-2'>
            <SelectField<{ id: string; name: string; latitude: string; longitude: string }>
              name='address.city.id'
              className='w-full'
              label='Ciudad'
              placeholder='Selecciona una Ciudad'
              disabled={disabled}
              apiUrl={
                form.watch('address.province')
                  ? buildEndpoint(API_ENDPOINTS.CITIES, {
                      provinceId: form.watch('address.province') || '',
                    })
                  : API_ENDPOINTS.ALL_CITIES
              }
              dataMapper={(item) => ({
                id: item.id,
                name: item.name,
                latitude: item.latitude,
                longitude: item.longitude,
              })}
              onChange={(value) => {
                setSelectedCity(value as CityMapperDto);
                form.setValue('address.city.latitude', value?.latitude);
                form.setValue('address.city.longitude', value?.longitude);
              }}
              required
            />
            <Button
              variant='ghost'
              type='button'
              size='icon'
              onClick={() => setShowAddCity(true)}
              disabled={disabled}
            >
              <PlusCircleIcon className='!h-5 !w-5' />
            </Button>
          </div>

          <InputField
            name='address.postalCode'
            label='Código Postal'
            placeholder='Código Postal'
            disabled={disabled}
            required
          />

          <InputField
            name='address.neighborhood'
            label='Barrio (opcional)'
            placeholder='Barrio'
            disabled={disabled}
          />

          <InputField
            name='address.street'
            label='Calle'
            placeholder='Calle'
            disabled={disabled}
            required
          />

          <div className='flex w-full items-center gap-2'>
            <InputField
              className='w-full'
              name='address.number'
              label='Número'
              placeholder='Número'
              disabled={disabled}
              required
            />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='inline-block text-primary'>
                    <Button
                      variant='outline'
                      type='button'
                      // size='icon'
                      onClick={() => setShouldSearchAddress(true)}
                      disabled={
                        disabled ||
                        !form.watch('address.city.id') ||
                        !form.watch('address.street') ||
                        !form.watch('address.number')
                      }
                    >
                      Confirmar domicilio
                      <SearchIcon className='h-5 w-5' />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {!form.watch('address.city.id') &&
                    !form.watch('address.street') &&
                    !form.watch('address.number') && (
                      <p>Selecciona ciudad, calle y número para confirmar el domicilio</p>
                    )}
                  {form.watch('address.city.id') &&
                    !form.watch('address.street') &&
                    !form.watch('address.number') && (
                      <p>Completa calle y número para confirmar el domicilio</p>
                    )}
                  {form.watch('address.city.id') &&
                    form.watch('address.street') &&
                    !form.watch('address.number') && (
                      <p>Completa el número para confirmar el domicilio</p>
                    )}
                  {form.watch('address.city.id') &&
                    !form.watch('address.street') &&
                    form.watch('address.number') && (
                      <p>Completa la calle para confirmar el domicilio</p>
                    )}
                  {form.watch('address.city.id') &&
                    form.watch('address.street') &&
                    form.watch('address.number') && <p>Confirmar domicilio</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <InputField
            name='address.apartment'
            label='Departamento (opcional)'
            placeholder='Departamento'
            disabled={disabled}
          />

          <InputField
            name='address.nomenclator'
            label='Nomenclatura'
            placeholder='Nomenclatura'
            disabled
            required
          />
        </div>
      </CardContent>

      {shouldSearchAddress && (
        <AddressSelectorModal
          label='Direcciones disponibles'
          name='address'
          isOpen={shouldSearchAddress}
          onClose={() => setShouldSearchAddress(false)}
          selectedCity={selectedCity}
        />
      )}

      {showAddCity && (
        <AddCityModal
          isOpen={showAddCity}
          onClose={() => setShowAddCity(false)}
          provinceId={form.watch('address.province')!}
          onSuccess={async (provinceId: string, cityId: string, cpId: string) => {
            form.setValue('address.province', provinceId);
            form.setValue('address.city', cityId);
            form.setValue('address.cp', cpId);
          }}
        />
      )}
    </Card>
  );
};

export { AddressSelector };
