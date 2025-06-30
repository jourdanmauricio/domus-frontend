"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useLogout } from "@/hooks/useAuth";
import { useApiQuery } from "@/hooks/useApi";
import { API_ENDPOINTS, QUERY_KEYS } from "@/lib/constants";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const logoutMutation = useLogout();
  const hasLoggedOut = useRef(false);

  // Agregar console.log al inicio para debugging
  // console.log("🔄 Dashboard render - status:", status);
  // console.log("🔄 Dashboard render - session:", session);

  const { data: dashboardData } = useApiQuery(
    API_ENDPOINTS.DASHBOARD,
    QUERY_KEYS.DASHBOARD
  );

  const { data: userProfile, isLoading: isProfileLoading } = useApiQuery(
    API_ENDPOINTS.USERS.ME,
    QUERY_KEYS.USERS.ME
  );

  useEffect(() => {
    if (status === "unauthenticated" && !hasLoggedOut.current) {
      router.push("/login");
    }
  }, [status, router]);

  const handleLogout = async () => {
    try {
      hasLoggedOut.current = true;
      await logoutMutation.mutateAsync();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
      hasLoggedOut.current = false;
    }
  };

  // if (status === "loading" || isDashboardLoading || isProfileLoading) {
  if (status === "loading" || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Hola, {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                {logoutMutation.isPending ? "Cerrando..." : "Cerrar Sesión"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* {dashboardError && ( */}
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error cargando los datos del dashboard
        </div>
        {/* )} */}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Usuarios
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {/* {dashboardData?.stats?.totalUsers || 0} */} 0
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Posts
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {/* {dashboardData?.stats?.totalPosts || 0}  */}0
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Estado
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Activo
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Perfil de Usuario
            </h3>
            {userProfile && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {userProfile.name || "No disponible"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {userProfile.email || session.user?.email}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ID de Usuario
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {userProfile.id || "No disponible"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha de Registro
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {userProfile.createdAt
                      ? new Date(userProfile.createdAt).toLocaleDateString()
                      : "No disponible"}
                  </div>
                </div>
              </div>
            )}
            {!userProfile && !isProfileLoading && (
              <div className="text-sm text-gray-500">
                No se pudo cargar la información del perfil
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Actividad Reciente
            </h3>
            <div className="text-sm text-gray-500">
              Esta sección se puede expandir con datos de actividad reciente del
              usuario
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
