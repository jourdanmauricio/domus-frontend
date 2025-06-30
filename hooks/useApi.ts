import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "axios";

const fetchWithAuth = async (url: string, token: string) => {
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const useApiQuery = <T = any>(
  endpoint: string,
  queryKey: string,
  options?: {
    staleTime?: number;
    enabled?: boolean;
  }
) => {
  const { data: session } = useSession();

  return useQuery<T>({
    queryKey: [queryKey],
    queryFn: () => fetchWithAuth(endpoint, session?.accessToken as string),
    enabled: options?.enabled ?? !!session?.accessToken,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutos por defecto
  });
};
