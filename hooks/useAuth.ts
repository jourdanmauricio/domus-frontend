// hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import { signIn, signOut } from "next-auth/react";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
}

interface ForgotPasswordData {
  email: string;
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      console.log("🔍 SignIn result:", result);

      if (result?.error) {
        throw new Error(`Error de autenticación: ${result.error}`);
      }

      if (!result?.ok) {
        throw new Error("Error de autenticación");
      }

      return result;
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al registrar usuario");
      }

      return response.json();
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      await signOut({ redirect: false });
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const response = await fetch(`/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Error al enviar email de recuperación"
        );
      }

      return response.json();
    },
  });
};
