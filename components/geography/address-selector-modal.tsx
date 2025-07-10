'use client';

import React, { Suspense, useState } from 'react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { CheckIcon, MapPinIcon } from 'lucide-react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { QUERY_KEYS } from '@/lib/constants';
import { georefService } from '@/lib/services/georef.service';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';
import { CityMapperDto, georefAddressDto } from '@/lib/types/geography';
import { useFormContext } from '@/lib/contexts/form-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

// const LeafletMap = dynamic(() => import('@/components/form-generics/maps/meaflet-map'), {
//   ssr: false,
//   loading: () => <p className='p-4 text-gray-500'>Cargando mapa...</p>,
// });

const MultiMarkerMap = dynamic(() => import('@/components/form-generics/maps/multi-marke-map'), {
  ssr: false,
  loading: () => <p className='p-4 text-gray-500'>Cargando mapa...</p>,
});

type ModalProps = {
  label: string;
  name: string;
  className?: string;
  labelClassName?: string;
  enableClean?: boolean;
  errorClassName?: string;
  description?: string;
  isOpen: boolean;
  selectedCity: CityMapperDto | null;
  onClose: () => void;
};

interface MarkerData {
  position: LatLngExpression;
  popupText?: string;
  iconColor?: string;
  iconSize?: number;
}

type AddressDataDto = {
  id: string;
  name: string;
  street: string;
  number: string;
  nomenclatura: string;
  latitude: string;
  longitude: string;
};

const AddressSelectorModal = ({
  label,
  className,
  labelClassName,
  errorClassName,
  isOpen,
  onClose,
  selectedCity,
}: ModalProps) => {
  const [selectedAddress, setSelectedAddress] = useState<AddressDataDto | null>(null);
  const { form } = useFormContext();

  const { error } = useFormField();

  const { data } = useQuery({
    queryKey: [
      QUERY_KEYS.GEOREF_ALL_ADDRESSES,
      form.watch('address.city.province.id'),
      form.watch('address.city.id'),
      form.watch('address.street'),
      form.watch('address.number'),
    ],
    queryFn: async () => {
      const response = await georefService.getAllAddressesByCity(
        form.watch('address.city.province.id')!,
        form.watch('address.city.id')!,
        `${form.watch('address.street')} ${form.watch('address.number')}`
      );

      const filteredAddresses: georefAddressDto[] = [];
      const UMBRAL_DIFERENCIA = 0.001; // Ajusta este valor según necesidad (~100 metros)

      for (const currentAddress of response) {
        const isDuplicate = filteredAddresses.some((existingAddress) => {
          return (
            Math.abs(existingAddress.ubicacion_lat - currentAddress.ubicacion_lat) <
              UMBRAL_DIFERENCIA &&
            Math.abs(existingAddress.ubicacion_lon - currentAddress.ubicacion_lon) <
              UMBRAL_DIFERENCIA
          );
        });

        if (!isDuplicate) {
          const address = {
            ...currentAddress,
            id:
              currentAddress.nomenclatura +
              currentAddress.ubicacion_lat +
              currentAddress.ubicacion_lon,
          };
          filteredAddresses.push(address);
        }
      }

      const addresses: AddressDataDto[] = filteredAddresses.map((address: georefAddressDto) => ({
        id: address.nomenclatura + address.ubicacion_lat + address.ubicacion_lon,
        name: address.nomenclatura,
        street: address.calle_nombre,
        number: address.altura_valor.toString(),
        nomenclatura: address.nomenclatura,
        latitude: address.ubicacion_lat.toString(),
        longitude: address.ubicacion_lon.toString(),
      }));

      return addresses;
    },
    enabled:
      !!form.watch('address.city.province.id') &&
      !!form.watch('address.city.id') &&
      !!form.watch('address.street') &&
      !!form.watch('address.number'),
  });

  // Auto-select single address or pre-existing address from form
  React.useEffect(() => {
    if (data && data.length > 0 && !selectedAddress) {
      // Si hay solo una dirección, seleccionarla automáticamente
      if (data.length === 1) {
        setSelectedAddress(data[0]);
        return;
      }

      // Buscar si existe una dirección previamente cargada en el formulario
      const existingNomenclator = form.watch('address.nomenclator');
      const existingLatitude = form.watch('address.latitude');
      const existingLongitude = form.watch('address.longitude');

      if (existingNomenclator || (existingLatitude && existingLongitude)) {
        const matchingAddress = data.find((address) => {
          // Comparar por nomenclator si existe
          if (
            existingNomenclator &&
            address.nomenclatura + address.latitude + address.longitude ===
              existingNomenclator + existingLatitude + existingLongitude
          ) {
            return true;
          }

          // Comparar por coordenadas si existen
          if (existingLatitude && existingLongitude) {
            const latMatch =
              Math.abs(parseFloat(address.latitude) - parseFloat(existingLatitude)) < 0.0001;
            const lngMatch =
              Math.abs(parseFloat(address.longitude) - parseFloat(existingLongitude)) < 0.0001;
            return latMatch && lngMatch;
          }

          return false;
        });

        if (matchingAddress) {
          setSelectedAddress(matchingAddress);
        }
      }
    }
  }, [data, selectedAddress, form]);

  const handleSelectAddress = () => {
    form.setValue('address.latitude', selectedAddress?.latitude);
    form.setValue('address.longitude', selectedAddress?.longitude);
    form.setValue('address.nomenclator', selectedAddress?.nomenclatura);
    form.setValue('address.street', selectedAddress?.street);
    form.setValue('address.number', selectedAddress?.number);
    onClose();
  };

  const center: LatLngExpression = [
    parseFloat(form.watch('address.city.latitude')!),
    parseFloat(form.watch('address.city.longitude')!),
  ];

  const markers: MarkerData[] =
    data?.map((item: AddressDataDto) => {
      const isSelected = selectedAddress?.id === item.id;
      return {
        position: [parseFloat(item.latitude), parseFloat(item.longitude)],
        popupText: item.name,
        iconColor: isSelected ? '#ef4444' : '#8b5cf6', // Rojo para seleccionado, violeta para otros
        iconSize: isSelected ? 32 : 24, // Más grande para el seleccionado
        id: item.id, // Agregar ID para identificar el marcador
      };
    }) ?? [];

  const handleMarkerClick = (markerId: string) => {
    const address = data?.find((item) => item.id === markerId);
    if (address) {
      setSelectedAddress(address);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-[1200px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <MapPinIcon className='mr-2 h-5 w-5' />
            Seleccionar Dirección
          </DialogTitle>
          <DialogDescription>
            Selecciona una dirección de la lista o haz clic en el mapa para continuar.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-8 overflow-hidden'>
          <div className='flex gap-8'>
            <div className='w-1/2'>
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <div>
                    <FormItem className={className}>
                      <FormLabel
                        className={cn('text-sm font-medium text-gray-700', labelClassName)}
                      >
                        {label}
                      </FormLabel>
                      <FormControl>
                        <Command className='rounded-lg border'>
                          <CommandList className='h-24'>
                            <CommandEmpty>No se encontraron direcciones.</CommandEmpty>
                            <CommandGroup>
                              {data?.map((item: AddressDataDto) => {
                                return (
                                  <CommandItem
                                    className={`flex cursor-pointer items-center justify-between transition-colors ${selectedAddress?.id === item.id ? 'bg-accent text-accent-foreground' : '!bg-transparent'}`}
                                    key={item.id}
                                    value={item.id}
                                    onSelect={() => setSelectedAddress(item)}
                                  >
                                    <span>{item.name}</span>
                                    {selectedAddress?.id ===
                                      item.nomenclatura + item.latitude + item.longitude && (
                                      <CheckIcon className='h-4 w-4 text-primary' />
                                    )}
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </FormControl>
                    </FormItem>
                    <div className='flex h-5 items-start'>
                      <FormMessage
                        className={cn(
                          'text-xs transition-all duration-200 ease-in-out',
                          error
                            ? 'translate-y-0 opacity-100'
                            : 'pointer-events-none translate-y-1 opacity-0',
                          errorClassName
                        )}
                      />
                    </div>
                  </div>
                )}
              />
            </div>
            <div className='w-1/2'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg font-bold'>{selectedAddress?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2'>
                      <MapPinIcon className='h-4 w-4' />
                      <span className='text-sm font-medium'>{selectedAddress?.latitude}</span>
                      <span className='text-sm font-medium'>{selectedAddress?.longitude}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className='h-[500px] w-full'>
            <Suspense fallback={<p>Cargando...</p>}>
              <MultiMarkerMap
                center={center}
                markers={markers}
                defaultIconColor='#8b5cf6' // Color por defecto (violeta)
                className='h-[500px] rounded-lg border border-gray-200'
                onMarkerClick={handleMarkerClick}
                selectedMarkerId={selectedAddress?.id}
              />
            </Suspense>
          </div>
        </div>
        <div className='flex justify-between pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            // disabled={updateMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type='button'
            onClick={handleSelectAddress}
            // disabled={updateMutation.isPending}
          >
            Seleccionar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { AddressSelectorModal };
