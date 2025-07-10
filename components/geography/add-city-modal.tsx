import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPinPlusIcon, SearchIcon, CheckIcon } from 'lucide-react';

import { InputField, SelectField } from '@/components/form-generics';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { API_ENDPOINTS, QUERY_KEYS } from '@/lib/constants';
import { georefService } from '@/lib/services/georef.service';
import { CityBackendDto, CityMapperDto } from '@/lib/types/geography';
import { geographyService } from '@/lib/services/geography.service';
import { toast } from '@/hooks/use-toast';
import { BackendResponse } from '@/app/api/utils/backend-client';
import { mapAxiosError } from '@/lib/utils/error-mapper';

type AddCityModalProps = {
  isOpen: boolean;
  onClose: () => void;
  provinceId: string;
  onSuccess: (provinceId: string, cityId: string, cpId: string) => void;
};

const addCitySchema = z.object({
  provinceId: z.string().min(1),
  searchCity: z.string().min(1),
  cityId: z.string().min(1),
  cityName: z.string().min(1),
  cp: z.string().min(1),
  latitude: z.string().min(1),
  longitude: z.string().min(1),
});

const AddCityModal = ({ isOpen, onClose, provinceId, onSuccess }: AddCityModalProps) => {
  const [shouldSearch, setShouldSearch] = useState(false);

  const queryClient = useQueryClient();

  const handleClose = () => {
    onClose();
    setShouldSearch(false);
  };

  const form = useForm<z.infer<typeof addCitySchema>>({
    resolver: zodResolver(addCitySchema),
    defaultValues: {
      provinceId: provinceId,
      searchCity: '',
      cityId: '',
      cityName: '',
      cp: '',
      latitude: '',
      longitude: '',
    },
  });

  const { data: cities } = useQuery({
    queryKey: [
      QUERY_KEYS.GEOREF_ALL_CITIES,
      form.getValues('provinceId'),
      form.watch('searchCity'),
    ],
    queryFn: async () => {
      const response = await georefService.getAllCitiesByName(
        form.getValues('provinceId'),
        form.getValues('searchCity')
      );

      // Filtrar primero las categorías no deseadas
      const filteredCities = response.localidades.filter(
        (el: CityBackendDto) => el.categoria !== 'Componente de localidad compuesta'
      );

      // Agrupar por nombre para detectar duplicados
      const citiesByName = filteredCities.reduce((acc: any, city: CityBackendDto) => {
        const name = city.nombre;
        if (!acc[name]) {
          acc[name] = [];
        }
        acc[name].push(city);
        return acc;
      }, {});

      // Procesar cada grupo de ciudades con el mismo nombre
      const processedCities = Object.values(citiesByName).map((cityGroup: any) => {
        if (cityGroup.length === 1) {
          // Si solo hay una ciudad con ese nombre, usarla directamente
          return cityGroup[0];
        } else {
          // Si hay duplicados, priorizar las que NO son "Entidad"
          const nonEntityCities = cityGroup.filter((city: any) => city.categoria !== 'Entidad');
          if (nonEntityCities.length > 0) {
            // Usar la primera ciudad que no sea "Entidad"
            return nonEntityCities[0];
          } else {
            // Si todas son "Entidad", usar la primera
            return cityGroup[0];
          }
        }
      });

      setShouldSearch(false);

      return processedCities.map((el: any) => ({
        id: el.id,
        name: el.nombre,
        latitude: el.centroide_lat.toString(),
        longitude: el.centroide_lon.toString(),
        provincieId: el.provincia_id,
      })) as CityMapperDto[];
    },
    enabled: shouldSearch && !!form.getValues('provinceId') && form.getValues('searchCity') !== '',
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => geographyService.addCity(data),
    onSuccess: async (createdCity: CityBackendDto) => {
      // Invalidar las queries de ciudades para que se actualicen los datos
      await queryClient.invalidateQueries({ queryKey: ['select-address.city'] });
      // Invalidar cualquier query que contenga 'cities' para asegurar que se actualicen
      await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.some((key) => typeof key === 'string' && key.includes('cities')),
      });

      toast({
        title: 'Ciudad agregada correctamente',
        variant: 'default',
      });

      // Pasar el ID de la ciudad recién creada, no el ID de Georef
      onSuccess(form.getValues('provinceId'), createdCity.id, form.getValues('cp'));
      handleClose();
      form.reset();
    },
    onError: (error: BackendResponse) => {
      const { message } = mapAxiosError(error);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });

  const handleSearch = () => {
    setShouldSearch(true);
  };

  const handleCitySelect = (city: CityMapperDto) => {
    form.setValue('cityId', city.id);
    form.setValue('cityName', city.name);
    form.setValue('latitude', city.latitude.toString());
    form.setValue('longitude', city.longitude.toString());
  };

  const handleSubmit = () => {
    const data = {
      provinceId: form.getValues('provinceId'),
      id: form.getValues('cityId'),
      name: form.getValues('cityName'),
      cp: form.getValues('cp'),
      latitude: form.getValues('latitude'),
      longitude: form.getValues('longitude'),
    };
    createMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <MapPinPlusIcon className='mr-2 h-5 w-5' />
            Agregar Ciudad
          </DialogTitle>
          <DialogDescription>Ingresa los datos de la ciudad que deseas agregar.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <SelectField
              name='provinceId'
              label='Provincia'
              placeholder='Selecciona una provincia'
              apiUrl={API_ENDPOINTS.PROVINCES}
              onChange={(value) => {
                form.setValue('provinceId', value);
                form.setValue('searchCity', '');
                form.setValue('cp', '');
              }}
            />
            <div className='flex w-full items-center gap-2'>
              <InputField
                name='searchCity'
                label='Ciudad'
                placeholder='Ciudad'
                className='w-full'
              />
              <Button variant='ghost' type='button' size='icon' onClick={handleSearch}>
                <SearchIcon className='h-5 w-5' />
              </Button>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium'>Selecciona una ciudad:</label>
              <Command className='rounded-lg border shadow-md'>
                <CommandList className='h-48'>
                  <CommandEmpty>No se encontraron ciudades.</CommandEmpty>
                  <CommandGroup>
                    {cities?.map((city) => (
                      <CommandItem
                        key={city.id}
                        value={city.name}
                        onSelect={() => {
                          handleCitySelect(city);
                          form.setValue('cp', '');
                        }}
                        className={`flex cursor-pointer items-center justify-between transition-colors ${form.watch('cityId') === city.id ? 'bg-accent text-accent-foreground' : '!bg-transparent'}`}
                      >
                        <span>{city.name}</span>
                        {form.watch('cityId') === city.id && (
                          <CheckIcon className='h-4 w-4 text-primary' />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>

            <InputField
              name='cp'
              label='Código Postal'
              placeholder='Código Postal'
              className='w-full'
              maxLength={7}
              disabled={!form.getValues('cityId')}
            />

            <div className='flex justify-end space-x-4 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                //  disabled={updateMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                disabled={!form.getValues('cp')}
                // disabled={updateMutation.isPending}
              >
                Agregar Ciudad
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { AddCityModal };
