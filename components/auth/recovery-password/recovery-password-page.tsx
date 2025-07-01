"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Home, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "next-auth/react";

import { recoveryPasswordFormSchema } from "@/lib/schemas/auth";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/form-generics";
import { useRecoveryPassword } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RecoveryPasswordPage({ token }: { token: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const recoveryPasswordMutation = useRecoveryPassword();

  const form = useForm<z.infer<typeof recoveryPasswordFormSchema>>({
    resolver: zodResolver(recoveryPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof recoveryPasswordFormSchema>) => {
    try {
      const body = {
        password: data.password,
        token,
      };

      await recoveryPasswordMutation.mutateAsync(body);

      // Cerrar cualquier sesión activa para forzar un nuevo login
      await signOut({ redirect: false });

      toast({
        title: "Contraseña actualizada",
        description:
          "Tu contraseña ha sido cambiada exitosamente. Por favor, inicia sesión con tu nueva contraseña.",
        variant: "default",
      });

      // Redirigir al login
      router.push("/login");
    } catch (error) {
      console.error("❌ Password reset error:", error);
      toast({
        title: "Error al cambiar contraseña",
        description: "Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

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
              Cambio de contraseña
            </CardTitle>
            <CardDescription className="text-gray-600">
              Ingresa tu nueva contraseña
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, (errors) => {
                  console.log(errors);
                })}
              >
                <div className="space-y-2">
                  <div className="relative">
                    <InputField
                      label="Contraseña"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Tu contraseña"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <InputField
                      label="Confirmar Contraseña"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirma tu contraseña"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={
                        showConfirmPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={recoveryPasswordMutation.isPending}
                  className="w-full h-11 bg-secondary hover:bg-secondary/90 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {recoveryPasswordMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cambiando contraseña...
                    </>
                  ) : (
                    "Cambiar contraseña"
                  )}
                </Button>
              </form>
            </Form>
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
