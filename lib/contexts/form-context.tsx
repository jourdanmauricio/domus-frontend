import { createContext, useContext, ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface FormContextType {
  form: UseFormReturn<any>;
}

const FormContext = createContext<FormContextType | null>(null);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext debe usarse dentro de FormProvider');
  }
  return context;
};

interface FormProviderProps {
  children: ReactNode;
  form: UseFormReturn<any>;
}

export const FormProvider = ({ children, form }: FormProviderProps) => {
  return <FormContext.Provider value={{ form }}>{children}</FormContext.Provider>;
};
