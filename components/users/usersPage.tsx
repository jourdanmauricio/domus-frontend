"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { API_ENDPOINTS, QUERY_KEYS } from "@/lib/constants";
import { useApiQuery } from "@/hooks/useApi";
import { UsersDataTable } from "./users-data-table/users-table";
import { useCallback, useMemo } from "react";
import { UserBackendDto } from "@/lib/types/users";
import { getUsersColumns } from "./users-data-table/columns";

export default function UsersPage() {
  // Fetch users from the API
  const { data: users, isLoading, error } = useApiQuery<UserBackendDto[]>(
    API_ENDPOINTS.USERS.LIST,
    QUERY_KEYS.USERS.LIST
  );

  console.log("users", users);

  const onDownload = useCallback(async (row: UserBackendDto) => {
    console.log('Download:', row);
  }, []);

  const onEdit = useCallback((row: UserBackendDto) => {
    // Implementar edición del query
    console.log('Edit query:', row);
  }, []);

  async function handleDialogConfirmation() {
    // await deleteMutation.mutateAsync(currentRow?.id!);
  }

  const onDelete = useCallback(async (row: UserBackendDto) => {
    // setCurrentRow(row);
    // setAlertDialogIsOpen(true);
  }, []);

  const columns = useMemo(
    () =>
      getUsersColumns({
        onEdit,
        onDownload,
        onDelete,
      }),
    [onEdit, onDownload, onDelete]
  );

  return (
    <div className="space-y-6 h-full flex flex-col overflow-x-hidden">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Gestión de Usuarios
          </h2>
          <p className="text-muted-foreground">
            Administra los usuarios del sistema
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      <Card className="flex-1 flex flex-col w-full max-w-full">
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar usuarios..." className="pl-8 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4 overflow-x-auto">
          <UsersDataTable columns={columns} data={users || []} isLoading={isLoading} error={!!error} />
        </CardContent>
      </Card>
    </div>
  );
}
