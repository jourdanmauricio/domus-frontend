import { InputField } from '@/components/form-generics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Mail } from 'lucide-react';

type ContactInfoProps = {
  disabled?: boolean;
};

const ContactInfoTab = ({ disabled }: ContactInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center'>
          <Mail className='mr-2 h-5 w-5' />
          Información de Contacto
        </CardTitle>
      </CardHeader>
      <CardContent className='pb-0'>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <InputField name='firstName' label='Nombre' placeholder='Nombre' disabled={disabled} />

          <InputField name='lastName' label='Apellido' placeholder='Apellido' disabled={disabled} />

          <InputField name='dni' label='DNI' placeholder='DNI' disabled={disabled} />

          <InputField name='phone' label='Teléfono' placeholder='Teléfono' disabled={disabled} />
        </div>
      </CardContent>
    </Card>
  );
};

export { ContactInfoTab };
