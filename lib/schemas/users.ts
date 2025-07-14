import { z } from 'zod';
import { addressSchema } from './geography';

export const profileSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  dni: z.string().min(1, 'El DNI es requerido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  birthDate: z.any().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  language: z.string().optional(),
  bio: z.string().optional(),
  address: addressSchema,
});

export const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
      ),
    confirmPassword: z.string().min(1, 'Confirma tu nueva contraseña'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });
