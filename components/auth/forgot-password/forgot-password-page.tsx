"use client";

import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { Home, Mail, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/form-generics";
import { forgotPasswordSchema } from "@/lib/schemas/auth";
import { useForgotPassword } from "@/hooks/useAuth";

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const forgotPasswordMutation = useForgotPassword();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);

    try {
      await forgotPasswordMutation.mutateAsync({ email: data.email });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error enviando email:", error);
      setError(
        error instanceof Error ? error.message : "Error al enviar el email"
      );
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary/5 to-primary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2">
              <Home className="h-8 w-8 text-primary" />
              <span className="font-bold text-2xl text-primary">Domus App</span>
            </Link>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Email Enviado
              </CardTitle>
              <CardDescription className="text-gray-600">
                Hemos enviado un enlace de recuperación a tu correo electrónico
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                  Revisa tu bandeja de entrada y sigue las instrucciones para
                  restablecer tu contraseña.
                </div>

                <div className="text-sm text-gray-600">
                  ¿No recibiste el email? Verifica que la dirección sea correcta
                  y revisa tu carpeta de spam.
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full h-11 bg-secondary hover:bg-secondary/90 text-white font-medium"
                >
                  Enviar otro email
                </Button>

                <Link href="/login">
                  <Button variant="outline" className="w-full h-11">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver al login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/5 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Home className="h-8 w-8 text-primary" />
            <span className="font-bold text-2xl text-primary">Domus App</span>
          </Link>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">
              ¿Olvidaste tu contraseña?
            </CardTitle>
            <CardDescription className="text-gray-600">
              Ingresa tu correo electrónico y te enviaremos un enlace para
              restablecer tu contraseña
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
                noValidate
              >
                <InputField
                  name="email"
                  label="Correo Electrónico"
                  type="email"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  enableClean
                  className="space-y-2"
                />

                <Button
                  type="submit"
                  disabled={forgotPasswordMutation.isPending}
                  className="w-full h-11 bg-secondary hover:bg-secondary/90 text-white font-medium disabled:opacity-50"
                >
                  {forgotPasswordMutation.isPending
                    ? "Enviando..."
                    : "Enviar enlace de recuperación"}
                </Button>
              </form>
            </Form>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                ¿Recordaste tu contraseña?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Inicia sesión aquí
                </Link>
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
