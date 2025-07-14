import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextareaField, SelectField, InputDatePicker } from '../../form-generics';
import { User } from 'lucide-react';
import { GENDER_LIST, LANGUAGE_LIST, NATIONALITY_LIST } from '@/lib/constants/list';

type PersonalInfoProps = {
  disabled?: boolean;
};

const PersonalInfoTab = ({ disabled }: PersonalInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center'>
          <User className='mr-2 h-5 w-5' />
          Información Personal
        </CardTitle>
      </CardHeader>
      <CardContent className='pb-0'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <InputDatePicker
            name='birthDate'
            label='Fecha de Nacimiento'
            placeholder='Selecciona una fecha'
            disabled={disabled}
          />

          <SelectField
            name='gender'
            label='Género'
            placeholder='Selecciona un género'
            disabled={disabled}
            options={GENDER_LIST}
          />

          <SelectField
            name='nationality'
            label='Nacionalidad'
            placeholder='Selecciona una nacionalidad'
            disabled={disabled}
            options={NATIONALITY_LIST}
          />

          <SelectField
            name='language'
            label='Idioma'
            placeholder='Selecciona un idioma'
            disabled={disabled}
            options={LANGUAGE_LIST}
          />

          <TextareaField
            name='bio'
            label='Biografía'
            placeholder='Cuéntanos un poco sobre ti...'
            rows={3}
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export { PersonalInfoTab };
