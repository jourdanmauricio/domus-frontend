import { z } from 'zod';

export const addressSchema = z
  .object({
    city: z.object({
      id: z.string().optional(),
      name: z.string().optional(),
      province: z.object({
        id: z.string().optional(),
        name: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        defaultZoom: z.number().optional(),
      }),
      latitude: z.string().optional(),
      longitude: z.string().optional(),
    }),
    street: z.string().optional(),
    number: z.string().optional(),
    apartment: z.string().optional(),
    neighborhood: z.string().optional(),
    searchCity: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    nomenclator: z.string().optional(),
    postalCode: z.object({
      code: z.string().optional(),
      id: z.string().optional(),
    }),
  })
  .superRefine((address, ctx) => {
    const street = address.street?.trim();
    const number = address.number?.trim();
    const postalCode = address.postalCode?.code?.trim();
    const cityId = address.city?.id?.trim();
    const provinciaId = address.city?.province?.id?.trim();
    // Si alguno está completo, todos deben estarlo
    const anyFilled = street || number || postalCode || cityId || provinciaId;
    if (!anyFilled) return;
    if (!street) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La calle es obligatoria',
        path: ['street'],
      });
    }
    if (!number) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El número es obligatorio',
        path: ['number'],
      });
    }
    if (!postalCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El código postal es obligatorio',
        path: ['postalCode', 'code'],
      });
    }
    if (!provinciaId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La provincia es obligatoria',
        path: ['city', 'province', 'id'],
      });
    }
    if (!cityId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La ciudad es obligatoria',
        path: ['city', 'id'],
      });
    }
  });
